import { Request, Response, NextFunction } from 'express';

import { AuthService } from '@/services/auth.service';
import { ErrorCategory } from '@/types/errorTypes';
import { ApiError } from '@/utils/ApiErrors';
import asyncHandler from '@/utils/asyncHandler';

const authService = new AuthService();

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.header('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(
        401,
        'Authorization header missing or invalid',
        undefined,
        ErrorCategory.AUTHENTICATION,
      );
    }

    const token = authHeader.substring(7);

    const { userId } = authService.verifyAccessToken(token);
    req.userId = userId;

    next();
  },
);
