import type { Request, Response, NextFunction } from 'express';
import { config } from '@/config';

/**
 * Request logging middleware
 * Logs all incoming requests for debugging and monitoring
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const { method, url, requestId } = req;

  // Log request start
  if (config.nodeEnv !== 'production') {
    console.log(`[${new Date().toISOString()}] ${requestId} → ${method} ${url}`);
  }

  // Capture response finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    const logLevel = statusCode >= 400 ? 'error' : 'info';
    const emoji = statusCode >= 500 ? '💥' : statusCode >= 400 ? '⚠️' : '✅';

    if (config.nodeEnv !== 'production') {
      console.log(
        `[${new Date().toISOString()}] ${requestId} ← ${emoji} ${method} ${url} ${statusCode} ${duration}ms`,
      );
    }

    // In production, you might want to send this to a logging service
    if (config.nodeEnv === 'production' && statusCode >= 400) {
      // Log errors in production
      console.error({
        timestamp: new Date().toISOString(),
        requestId,
        method,
        url,
        statusCode,
        duration,
        level: logLevel,
      });
    }
  });

  next();
};
