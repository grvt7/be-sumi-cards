import { ErrorCategory } from '../types/errorTypes';

import { config } from '@/config';

interface ApiErrorResponse {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
  errors?: Record<string, unknown>;
  category?: ErrorCategory;
  stack?: string;
}

class ApiError extends Error {
  public readonly statusCode: number;
  public readonly data: null;
  public readonly message: string;
  public readonly success: boolean;
  public readonly errors?: Record<string, unknown>;
  public readonly category: ErrorCategory;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message = 'Something went wrong',
    errors?: Record<string, unknown>,
    category: ErrorCategory = ErrorCategory.SYSTEM,
    isOperational = true,
    stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    this.category = category;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  public toJSON(): ApiErrorResponse {
    return {
      statusCode: this.statusCode,
      data: this.data,
      message: this.message,
      success: this.success,
      errors: this.errors,
      category: this.category,
      ...(config.nodeEnv === 'development' && { stack: this.stack }),
    };
  }
}

export { ApiError, type ApiErrorResponse };

