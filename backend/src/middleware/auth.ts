import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken, setAuthCookies } from '../utils/jwt.js';
import { prisma } from '../db.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string | null;
    username: string;
    isGuest: boolean;
  };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let token = req.cookies?.access_token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      // Attempt token refresh via refresh_token cookie
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) {
        return res.status(401).json({ error: 'Unauthorized. Session missing or expired.' });
      }

      const refreshPayload = verifyRefreshToken(refreshToken);
      if (!refreshPayload) {
        return res.status(401).json({ error: 'Session expired. Please log in again.' });
      }

      const session = await prisma.session.findUnique({
        where: { refreshToken },
      });

      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({ error: 'Invalid refresh session.' });
      }

      const user = await prisma.user.findUnique({
        where: { id: refreshPayload.userId },
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found.' });
      }

      const newAccessToken = generateAccessToken({ userId: user.id, isGuest: user.isGuest });
      setAuthCookies(res, newAccessToken, refreshToken);
      req.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        isGuest: user.isGuest,
      };
      return next();
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      // Access token expired, check refresh token
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) {
        return res.status(401).json({ error: 'Access token expired.' });
      }

      const refreshPayload = verifyRefreshToken(refreshToken);
      if (!refreshPayload) {
        return res.status(401).json({ error: 'Session expired.' });
      }

      const user = await prisma.user.findUnique({
        where: { id: refreshPayload.userId },
      });

      if (!user) {
        return res.status(401).json({ error: 'User not found.' });
      }

      const newAccessToken = generateAccessToken({ userId: user.id, isGuest: user.isGuest });
      setAuthCookies(res, newAccessToken, refreshToken);
      req.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        isGuest: user.isGuest,
      };
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      isGuest: user.isGuest,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed.' });
  }
}
