import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import validator from 'validator';

import { ApiError } from '../utils/ApiErrors';

import { UserDocument } from './user.types';
import { config } from '@/config';

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is Required'],
      validate: [validator.isEmail, 'Invalid Email'],
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: [true, 'Fullname is Required'],
      trim: true, // Fix #6: added trim
    },
    username: {
      type: String,
      required: [true, 'Username is Required'],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      minlength: [8, 'Password must be at least 8 characters'], // Fix #5: min length
      select: false,
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    throw error as Error;
  }
});

// Fix #1: propagate errors instead of swallowing them, add return type
userSchema.methods.validatePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Fix #2 & #3: correct status code (500), validate expiry env var, add return type
userSchema.methods.generateAccessToken = function (): string {
  const secret = config.jwt.accessTokenSecret;
  const expiry = config.jwt.accessTokenExpiry;

  if (!secret) throw new ApiError(500, 'ACCESS_TOKEN_SECRET is not configured');
  if (!expiry) throw new ApiError(500, 'ACCESS_TOKEN_EXPIRY is not configured');

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    secret,
    { expiresIn: expiry },
  );
};

// Fix #2 & #3: correct status code (500), validate expiry env var, add return type
userSchema.methods.generateRefreshToken = function (): string {
  const secret = config.jwt.refreshTokenSecret;
  const expiry = config.jwt.refreshTokenExpiry;

  if (!secret) throw new ApiError(500, 'REFRESH_TOKEN_SECRET is not configured');
  if (!expiry) throw new ApiError(500, 'REFRESH_TOKEN_EXPIRY is not configured');

  return jwt.sign({ _id: this._id }, secret, { expiresIn: expiry });
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
