declare global {
  namespace Express {
    interface Request {
      user?: import('@/models/user.types').UserDocument;
      requestId?: string;
    }
  }
}

export {};
