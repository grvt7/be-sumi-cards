import jwt from 'jsonwebtoken';

import { config } from '@/config';

export interface TokenPayload extends jwt.JwtPayload {
  id: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.accessTokenSecret, {
    expiresIn: config.jwt.accessTokenExpiry as jwt.SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.refreshTokenSecret, {
    expiresIn: config.jwt.refreshTokenExpiry as jwt.SignOptions['expiresIn'],
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.jwt.accessTokenSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.jwt.refreshTokenSecret) as TokenPayload;
};
