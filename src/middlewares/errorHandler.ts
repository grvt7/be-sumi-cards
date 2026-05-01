import { Request, Response, NextFunction } from 'express';

import { config } from '@/config';
import { ErrorCategory } from '@/types/errorTypes';
import { ApiError } from '@/utils/ApiErrors';

interface ErrorResponse {
  category?: ErrorCategory;
  success: boolean;
  message: string;
  errors?: unknown;
  stack?: string;
  requestId?: string;
}

const errorHandler = (err: ApiError | Error, req: Request, res: Response, _next: NextFunction) => {
  const response: ErrorResponse = {
    success: false,
    message: err instanceof ApiError ? err.message : 'Internal Server Error',
    requestId: req.requestId,
  };

  if (err instanceof ApiError) {
    response.errors = err.errors;
    response.category = err.category;
  } else if (config.nodeEnv === 'development') {
    response.errors = err.message;
    response.stack = err.stack;
    response.category = ErrorCategory.SYSTEM;
  }

  console.error({
    error: err,
    requestId: response.requestId,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  res.status(err instanceof ApiError ? err.statusCode : 500).json(response);
};

export default errorHandler;

