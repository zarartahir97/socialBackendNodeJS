import { Response } from "express";

export interface userInterface {
  name: String,
  email: String,
  password: String,
  DOB: Date,
  gender: String,
  followingList: String[],
  createdAt: Date,
  updatedAt: Date,
}

export interface postInterface {
  userID: String,
  caption: String,
  createdAt: Date,
  updatedAt: Date,
}

export interface APIResponse extends Response {
  decodedData?: any
  post?: any,
  user?: any,
}