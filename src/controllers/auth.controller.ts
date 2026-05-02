import { AuthService } from '@/services/auth.service';
import { ErrorCategory } from '@/types/errorTypes';
import { ApiError } from '@/utils/ApiErrors';
import { ApiResponse } from '@/utils/ApiResponse';
import asyncHandler from '@/utils/asyncHandler';

const authService = new AuthService();

export const register = asyncHandler(async (req, res) => {
  const { email, username, fullname, password } = req.body;
  const result = await authService.register({ email, username, fullname, password });

  res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });

  res.status(200).json(new ApiResponse(200, result, 'Login successful'));
});

export const logout = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();

  if (!userId) {
    throw new ApiError(401, 'User not authenticated', undefined, ErrorCategory.AUTHENTICATION);
  }

  await authService.logout(userId);

  res.status(200).json(new ApiResponse(200, null, 'Logout successful'));
});

export const refreshTokens = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required', undefined, ErrorCategory.VALIDATION);
  }

  const result = await authService.refreshTokens(refreshToken);

  res.status(200).json(new ApiResponse(200, result, 'Tokens refreshed successfully'));
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, 'User not found in request', undefined, ErrorCategory.AUTHENTICATION);
  }

  res.status(200).json(new ApiResponse(200, authService.sanitizeUser(user), 'Profile retrieved'));
});
