declare global {
  namespace Express {
    interface Request {
      user?: import('@/models/UserTypes').UserDocument;
      requestId?: string;
    }
  }
}

export {};
