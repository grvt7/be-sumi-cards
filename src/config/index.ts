import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  frontendUrl: string;
  database: {
    url: string;
    name: string;
  };
  jwt: {
    accessTokenSecret: string;
    accessTokenExpiry: string;
    refreshTokenSecret: string;
    refreshTokenExpiry: string;
  };
  cors: {
    origin: string | string[];
  };
  redis?: {
    url?: string;
  };
  oauth?: {
    google?: {
      clientId?: string;
      clientSecret?: string;
      redirectUri?: string;
    };
    youtube?: {
      clientId?: string;
      clientSecret?: string;
      redirectUri?: string;
    };
  };
  encryption?: {
    tokenKeyHex?: string;
  };
}

const getConfig = (): Config => {
  const requiredEnvVars = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

  const missing = requiredEnvVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    database: {
      url: process.env.MONGODB_URI!,
      name: process.env.MONGODB_NAME!,
    },
    jwt: {
      accessTokenSecret: process.env.JWT_ACCESS_SECRET!,
      accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
      refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
      refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '30d',
    },
    cors: {
      origin: process.env.FRONTEND_URL || '*',
    },
  };
};

export const config = getConfig();
