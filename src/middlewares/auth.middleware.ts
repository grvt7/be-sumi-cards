import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { ExpressRequestInterface } from '@/models/expressRequest.interface';
import User from '@/models/User';
import { ApiError } from '@/utils/ApiErrors';
import asyncHandler from '@/utils/asyncHandler';

export const verifyJWT = asyncHandler(
  async (req: ExpressRequestInterface, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

      if (!accessToken) throw new ApiError(401, 'UnAuthorized Request');

      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET) as
        | {
            _id: string;
            email: string;
            username: string;
            fullname: string;
          }
        | undefined;

      const user = await User.findById(decoded?._id).select('-password -refreshToken');

      if (!user) throw new ApiError(401, 'Invalid Access Token');

      req.user = user;
      next();
    } catch (error) {
      const message = (error as Error).message;
      throw new ApiError(401, message || 'Invalid Access Token');
    }
  },
);

export const authenticate = verifyJWT;
