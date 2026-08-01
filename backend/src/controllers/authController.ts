import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { config } from '../config.js';
import { AuthRequest } from '../middleware/auth.js';

// Input Schemas
const RegisterSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const PromoteGuestSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  guestData: z.object({
    xp: z.number().optional(),
    level: z.number().optional(),
    streak: z.number().optional(),
    achievements: z.array(z.string()).optional(),
    bookmarks: z.array(z.string()).optional(),
    history: z.array(z.object({
      labId: z.string(),
      timestamp: z.string(),
      xpEarned: z.number(),
    })).optional(),
  }).optional(),
});

async function buildUserProfile(user: any) {
  const achievements = await prisma.achievement.findMany({
    where: { userId: user.id },
  });
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
  });
  const history = await prisma.labHistory.findMany({
    where: { userId: user.id },
    orderBy: { timestamp: 'desc' },
    take: 50,
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email || undefined,
    avatar: user.avatar,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    lastActive: user.lastActive.toISOString(),
    isGuest: user.isGuest,
    achievements: achievements.map((a) => a.code),
    bookmarks: bookmarks.map((b) => b.labId),
    history: history.map((h) => ({
      labId: h.labId,
      timestamp: h.timestamp.toISOString(),
      xpEarned: h.xpEarned,
    })),
  };
}

export async function register(req: Request, res: Response) {
  try {
    const parseResult = RegisterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid input fields', details: parseResult.error.flatten() });
    }

    const { username, email, password } = parseResult.data;

    // Check duplicate
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ error: 'Email is already registered.' });
      }
      return res.status(409).json({ error: 'Username is already taken.' });
    }

    const passwordHash = await hashPassword(password);
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        avatar,
        isGuest: false,
      },
    });

    const accessToken = generateAccessToken({ userId: user.id, isGuest: false });
    const refreshToken = generateRefreshToken({ userId: user.id, isGuest: false });

    // Store refresh token session in DB
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);
    const profile = await buildUserProfile(user);

    return res.status(201).json({ user: profile, token: accessToken });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to create user account.' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parseResult = LoginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const { email, password } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await comparePassword(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Update lastActive
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() },
    });

    const accessToken = generateAccessToken({ userId: user.id, isGuest: false });
    const refreshToken = generateRefreshToken({ userId: user.id, isGuest: false });

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);
    const profile = await buildUserProfile(user);

    return res.status(200).json({ user: profile, token: accessToken });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Authentication failed.' });
  }
}

export async function guestLogin(req: Request, res: Response) {
  try {
    const usernameInput = req.body.username || `GuestCoder_${Math.floor(1000 + Math.random() * 9000)}`;
    const username = usernameInput.trim();
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;

    const user = await prisma.user.create({
      data: {
        username,
        avatar,
        isGuest: true,
      },
    });

    const accessToken = generateAccessToken({ userId: user.id, isGuest: true });
    const refreshToken = generateRefreshToken({ userId: user.id, isGuest: true });

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);
    const profile = await buildUserProfile(user);

    return res.status(200).json({ user: profile, token: accessToken });
  } catch (error) {
    console.error('Guest login error:', error);
    return res.status(500).json({ error: 'Failed to create guest session.' });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      await prisma.session.deleteMany({
        where: { refreshToken },
      });
    }

    clearAuthCookies(res);
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    clearAuthCookies(res);
    return res.status(200).json({ message: 'Logged out.' });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      clearAuthCookies(res);
      return res.status(404).json({ error: 'User session no longer valid.' });
    }

    const profile = await buildUserProfile(user);
    return res.status(200).json({ user: profile });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided.' });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Refresh token expired.' });
    }

    const session = await prisma.session.findUnique({
      where: { refreshToken },
    });

    if (!session || session.expiresAt < new Date()) {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Session invalidated.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'User not found.' });
    }

    const newAccessToken = generateAccessToken({ userId: user.id, isGuest: user.isGuest });
    setAuthCookies(res, newAccessToken, refreshToken);
    const profile = await buildUserProfile(user);

    return res.status(200).json({ user: profile, token: newAccessToken });
  } catch (error) {
    clearAuthCookies(res);
    return res.status(500).json({ error: 'Token refresh failed.' });
  }
}

export async function promoteGuest(req: Request, res: Response) {
  try {
    const parseResult = PromoteGuestSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid promotion input.', details: parseResult.error.flatten() });
    }

    const { username, email, password, guestData } = parseResult.data;

    // Check duplicate
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser && !existingUser.isGuest) {
      return res.status(409).json({ error: 'An account with that email or username already exists.' });
    }

    const passwordHash = await hashPassword(password);
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        avatar,
        xp: guestData?.xp || 0,
        level: guestData?.level || 1,
        streak: guestData?.streak || 1,
        isGuest: false,
      },
    });

    // Idempotently merge achievements
    if (guestData?.achievements && guestData.achievements.length > 0) {
      for (const code of guestData.achievements) {
        await prisma.achievement.upsert({
          where: { userId_code: { userId: user.id, code } },
          create: { userId: user.id, code },
          update: {},
        });
      }
    }

    // Idempotently merge bookmarks
    if (guestData?.bookmarks && guestData.bookmarks.length > 0) {
      for (const labId of guestData.bookmarks) {
        await prisma.bookmark.upsert({
          where: { userId_labId: { userId: user.id, labId } },
          create: { userId: user.id, labId },
          update: {},
        });
      }
    }

    // Merge lab history
    if (guestData?.history && guestData.history.length > 0) {
      for (const item of guestData.history) {
        await prisma.labHistory.create({
          data: {
            userId: user.id,
            labId: item.labId,
            xpEarned: item.xpEarned,
            timestamp: new Date(item.timestamp),
          },
        });
      }
    }

    const accessToken = generateAccessToken({ userId: user.id, isGuest: false });
    const refreshToken = generateRefreshToken({ userId: user.id, isGuest: false });

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);
    const profile = await buildUserProfile(user);

    return res.status(200).json({ user: profile, token: accessToken });
  } catch (error) {
    console.error('Guest promotion error:', error);
    return res.status(500).json({ error: 'Failed to promote guest account.' });
  }
}

export async function githubAuth(req: Request, res: Response) {
  if (!config.github.clientId) {
    // Development mode fallback when GitHub client credentials aren't configured
    const devGithubUser = {
      username: 'Octocat_Dev',
      email: 'octocat@github.dev',
      githubId: '5832347',
      avatar: 'https://avatars.githubusercontent.com/u/5832347?v=4',
    };

    let user = await prisma.user.findFirst({
      where: { OR: [{ githubId: devGithubUser.githubId }, { email: devGithubUser.email }] },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: devGithubUser.username,
          email: devGithubUser.email,
          githubId: devGithubUser.githubId,
          avatar: devGithubUser.avatar,
          isGuest: false,
        },
      });
    }

    const accessToken = generateAccessToken({ userId: user.id, isGuest: false });
    const refreshToken = generateRefreshToken({ userId: user.id, isGuest: false });

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(`${config.frontendUrl}/?oauth=success`);
  }

  const state = Math.random().toString(36).substring(7);
  res.cookie('oauth_state', state, { httpOnly: true, maxAge: 10 * 60 * 1000 });

  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${encodeURIComponent(config.github.callbackUrl)}&scope=user:email&state=${state}`;
  return res.redirect(githubUrl);
}

export async function githubCallback(req: Request, res: Response) {
  const { code, state } = req.query;
  const savedState = req.cookies?.oauth_state;

  if (config.github.clientId && state !== savedState) {
    return res.status(400).redirect(`${config.frontendUrl}/auth?error=invalid_state`);
  }

  try {
    if (!code) {
      return res.redirect(`${config.frontendUrl}/auth?error=no_code`);
    }

    // Request Access Token from GitHub
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: config.github.clientId,
        client_secret: config.github.clientSecret,
        code,
        redirect_uri: config.github.callbackUrl,
      }),
    });

    const tokenData = await tokenResponse.json() as any;
    if (!tokenData.access_token) {
      return res.redirect(`${config.frontendUrl}/auth?error=github_token_failed`);
    }

    // Fetch GitHub Profile
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${tokenData.access_token}`,
        'User-Agent': 'Playorithm-App',
      },
    });
    const githubUser = await userResponse.json() as any;

    let user = await prisma.user.findFirst({
      where: { OR: [{ githubId: String(githubUser.id) }, { email: githubUser.email }] },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username: githubUser.login || `github_${githubUser.id}`,
          email: githubUser.email || undefined,
          githubId: String(githubUser.id),
          avatar: githubUser.avatar_url,
          isGuest: false,
        },
      });
    }

    const accessToken = generateAccessToken({ userId: user.id, isGuest: false });
    const refreshToken = generateRefreshToken({ userId: user.id, isGuest: false });

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(`${config.frontendUrl}/?oauth=success`);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return res.redirect(`${config.frontendUrl}/auth?error=oauth_failed`);
  }
}
