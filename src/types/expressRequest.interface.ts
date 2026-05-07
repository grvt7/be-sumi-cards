import { Request } from 'express';

import { UserDocument } from '../models/UserTypes';

export interface ExpressRequestInterface extends Request {
  user?: UserDocument;
}
