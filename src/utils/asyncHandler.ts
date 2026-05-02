import { Request, Response, NextFunction } from 'express';

import { ErrorCategory } from '../types/errorTypes';

import { ApiError } from './ApiErrors';

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

const asyncHandler = (requestHandler: AsyncRequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      if (error instanceof ApiError) {
        next(error);
      } else {
        next(
          new ApiError(
            500,
            'Internal Server Error',
            {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            ErrorCategory.SYSTEM,
          ),
        );
      }
    }
  };
};

export default asyncHandler;
