import { Request } from 'express';

import { UserDocument } from './user.types';

export interface ExpressRequestInterface extends Request {
  user?: UserDocument;
}
