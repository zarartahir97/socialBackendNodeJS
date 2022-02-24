import { Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Document } from 'mongoose';

export interface userInterface extends Document {
  name: string,
  email: string,
  password: string,
  DOB: Date,
  gender: string,
  followingList: string[],
  createdAt: Date,
  updatedAt: number,
}

export interface postInterface extends Document {
  userID: userInterface['_id'],
  caption: string,
  createdAt: Date,
  updatedAt: number,
}

export interface APIResponse extends Response {
  decodedData?: JwtPayload | string,
  post?: postInterface,
  user?: userInterface,
}