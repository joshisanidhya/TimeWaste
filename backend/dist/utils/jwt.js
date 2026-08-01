import jwt from 'jsonwebtoken';
import { config } from '../config.js';
export function generateAccessToken(payload) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn: '15m' });
}
export function generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: '7d' });
}
export function verifyAccessToken(token) {
    try {
        return jwt.verify(token, config.jwtSecret);
    }
    catch {
        return null;
    }
}
export function verifyRefreshToken(token) {
    try {
        return jwt.verify(token, config.jwtRefreshSecret);
    }
    catch {
        return null;
    }
}
export function setAuthCookies(res, accessToken, refreshToken) {
    const isProd = config.nodeEnv === 'production';
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: '/',
    });
    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
    });
}
export function clearAuthCookies(res) {
    const isProd = config.nodeEnv === 'production';
    res.clearCookie('access_token', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
    });
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
    });
}
