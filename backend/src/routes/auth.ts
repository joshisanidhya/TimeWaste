import { Router } from 'express';
import {
  register,
  login,
  guestLogin,
  logout,
  getMe,
  refresh,
  promoteGuest,
  githubAuth,
  githubCallback,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/guest', guestLogin);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, getMe);
authRouter.post('/refresh', refresh);
authRouter.post('/promote-guest', promoteGuest);
authRouter.get('/github', githubAuth);
authRouter.get('/github/callback', githubCallback);
