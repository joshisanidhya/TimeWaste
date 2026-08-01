import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config.js';
import { authRouter } from './routes/auth.js';

export const app = express();

// CORS setup allowing credentials
app.use(
  cors({
    origin: [config.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'playorithm-backend', timestamp: new Date().toISOString() });
});

// Authentication Routes mounted on both /api/v1/auth and /api/auth for complete API compatibility
app.use('/api/v1/auth', authRouter);
app.use('/api/auth', authRouter);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});
