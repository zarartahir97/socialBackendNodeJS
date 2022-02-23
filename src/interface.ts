import { Response } from 'express';
import { userInterface } from './models/user';
import { postInterface } from './models/post';
import { JwtPayload } from 'jsonwebtoken';

export interface APIResponse extends Response {
  decodedData?: JwtPayload | string,
  post?: postInterface,
  user?: userInterface,
}

export interface ErrorResponse  {
  message: string
}