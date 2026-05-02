import { Router } from 'express';

import { register, login, logout, refreshTokens, getProfile } from '@/controllers/auth.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { authLimiter } from '@/middlewares/rateLimiters';

const router = Router();

// Apply auth rate limiter to all auth routes
router.use(authLimiter);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 * validateBody(registerSchema),
 */
router.post('/register', register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 * validateBody(loginSchema),
 */
router.post('/login', login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 * validateBody(refreshTokenSchema),
 */
router.post('/refresh', refreshTokens);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

export default router;
