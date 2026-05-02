import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
  fullname: string;
  password: string;
  avatar?: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  // Methods
  validatePassword(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface UserRegistrationData {
  email: string;
  username: string;
  fullname: string;
  password: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  _id: string;
  email: string;
  username: string;
  fullname: string;
  avatar?: string;
  createdAt: Date;
}
