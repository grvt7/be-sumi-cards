import { Request, Response, NextFunction } from 'express';
import { ZodError, z } from 'zod';

import { ErrorCategory } from '@/types/errorTypes';
import { ApiError } from '@/utils/ApiErrors';

export const validate = <T extends z.ZodTypeAny>(schema: T, source: 'body' | 'query' = 'body') => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (source === 'body') {
        req.body = (await schema.parseAsync(req.body)) as z.infer<T>;
      } else if (source === 'query') {
        await schema.parseAsync(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach(err => {
          const path = err.path.join('.');
          formattedErrors[path] = err.message;
        });

        return next(
          new ApiError(400, 'Validation Failed', formattedErrors, ErrorCategory.VALIDATION),
        );
      }
      next(error);
    }
  };
};
