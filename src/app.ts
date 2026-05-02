import crypto from 'crypto';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import dataRoutes from './routes/data.routes';

// import { config } from '@/config';
import errorHandler from '@/middlewares/errorHandler';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { authLimiter, globalLimiter } from '@/middlewares/rateLimiters';
import authRoutes from '@/routes/auth.routes';
import studyRoutes from '@/routes/study.routes';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(globalLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use((req, res, next) => {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);
  next();
});

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, data: { status: 'ok' } });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/study', studyRoutes);
app.use('/api/v1/data', dataRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

export { app };
