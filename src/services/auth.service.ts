import { verifyAccessToken, type TokenPayload } from '@/utils/tokens';

export class AuthService {
  verifyAccessToken(token: string): TokenPayload {
    return verifyAccessToken(token);
  }

  verifyRefreshToken(_token: string): TokenPayload {
    // Implementation can be added when needed
    throw new Error('Method not implemented');
  }
}
