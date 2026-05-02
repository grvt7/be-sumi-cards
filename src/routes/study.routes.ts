import { Router } from 'express';
import {
  createSession,
  getSessions,
  getProgress,
  getStats,
  getCategoryProgress,
  getCardProgress,
  getCardProgressSummary,
} from '@/controllers/study.controller';
import { authenticate } from '@/middlewares/auth.middleware';
import { validateBody, validateQuery, validateParams } from '@/middlewares/validateRequest';
import {
  createSessionSchema,
  getSessionsQuerySchema,
  getProgressQuerySchema,
  getCardProgressQuerySchema,
  categoryParamsSchema,
} from '@/validations/study.validation';

const router = Router();

// All study routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/study/sessions
 * @desc    Create a new study session
 * @access  Private
 */
router.post('/sessions', validateBody(createSessionSchema), createSession);

/**
 * @route   GET /api/v1/study/sessions
 * @desc    Get user's study sessions
 * @access  Private
 * @query   studyType? - Filter by study type (kana, vocabulary, flashcard)
 * @query   limit? - Number of sessions to return (default: 10)
 */
router.get('/sessions', validateQuery(getSessionsQuerySchema), getSessions);

/**
 * @route   GET /api/v1/study/progress
 * @desc    Get user's progress by study type
 * @access  Private
 * @query   studyType? - Filter by study type (kana, vocabulary, flashcard)
 */
router.get('/progress', validateQuery(getProgressQuerySchema), getProgress);

/**
 * @route   GET /api/v1/study/stats
 * @desc    Get user's overall statistics
 * @access  Private
 */
router.get('/stats', getStats);

/**
 * @route   GET /api/v1/study/progress/:category
 * @desc    Get user's progress for a specific category with detailed sessions and cards
 * @access  Private
 * @param   category - Category name (e.g., 'hiragana-words', 'vocabulary', etc.)
 */
router.get('/progress/:category', validateParams(categoryParamsSchema), getCategoryProgress);

/**
 * @route   GET /api/v1/study/cards
 * @desc    Get user's card progress with detailed metrics
 * @access  Private
 * @query   studyType? - Filter by study type (kana, vocabulary, flashcard, words)
 * @query   category? - Filter by category
 * @query   masteryLevel? - Filter by mastery level (0-5)
 */
router.get('/cards', validateQuery(getCardProgressQuerySchema), getCardProgress);

/**
 * @route   GET /api/v1/study/cards/summary
 * @desc    Get user's card progress summary with mastery breakdown
 * @access  Private
 * @query   studyType? - Filter by study type (kana, vocabulary, flashcard, words)
 * @query   category? - Filter by category
 */
router.get('/cards/summary', validateQuery(getCardProgressQuerySchema), getCardProgressSummary);

export default router;
