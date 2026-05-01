import crypto from 'crypto';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { config } from '@/config';
import errorHandler from '@/middlewares/errorHandler';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { authLimiter, globalLimiter } from '@/middlewares/rateLimiters';

const app = express();

app.use(
  cors({
    origin: config.cors.origin,
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

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

export { app };
