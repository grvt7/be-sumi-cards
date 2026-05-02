import User from '@/models/user.model';
import { UserDocument, UserRegistrationData, UserLoginData } from '@/models/user.types';
import { ErrorCategory } from '@/types/errorTypes';
import { ApiError } from '@/utils/ApiErrors';
import { verifyAccessToken, verifyRefreshToken, type TokenPayload } from '@/utils/tokens';

export class AuthService {
  async register(userData: UserRegistrationData) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email }).select('+password');
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    const existingUsername = await User.findOne({ username: userData.username });
    if (existingUsername) {
      throw new ApiError(409, 'Username already taken');
    }
    // Creates user data through model
    const newUser = new User({
      email: userData.email,
      fullname: userData.fullname,
      username: userData.username.toLowerCase(),
      password: userData.password,
    });

    // Saves the new user
    const createdUser = await newUser.save();
    if (!createdUser) {
      throw new ApiError(500, 'Something when wrong while creating user.');
    }

    // Generate tokens
    const accessToken = createdUser.generateAccessToken();
    const refreshToken = createdUser.generateRefreshToken();

    // Store refresh token
    createdUser.refreshToken = refreshToken;
    await createdUser.save();

    // Exclude sensitive information before returning user data
    const sanitizedUser = await User.findById(createdUser._id).select('-password -refreshToken');
    if (!sanitizedUser) {
      throw new ApiError(500, 'Something went wrong while sanitizing user.');
    }
    return {
      user: sanitizedUser,
      accessToken,
      refreshToken,
    };
  }

  async login(loginData: UserLoginData) {
    // Find user with password
    const user = await User.findOne({ email: loginData.email }).select('+password +refreshToken');
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(loginData.password);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: this.sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: undefined });
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken) as TokenPayload;

      // Find user
      const user = await User.findById(decoded._id).select('+refreshToken');
      if (!user) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      // Check stored refresh token matches
      const storedToken = user.refreshToken;
      if (storedToken && storedToken !== refreshToken) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      // Generate new tokens
      const newAccessToken = user.generateAccessToken();
      const newRefreshToken = user.generateRefreshToken();

      // Update stored refresh token
      user.refreshToken = newRefreshToken;
      await user.save();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new ApiError(
        401,
        'Invalid refresh token',
        undefined,
        ErrorCategory.AUTH,
        true,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }

  verifyAccessToken(token: string): TokenPayload {
    return verifyAccessToken(token);
  }

  verifyRefreshToken(token: string): TokenPayload {
    return verifyRefreshToken(token);
  }

  sanitizeUser(user: UserDocument) {
    const { password, refreshToken, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }
}
