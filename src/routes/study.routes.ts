import { Router } from 'express';
import { createSession, getSessions, getProgress, getStats } from '@/controllers/study.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

// All study routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/study/sessions
 * @desc    Create a new study session
 * @access  Private
 */
router.post('/sessions', createSession);

/**
 * @route   GET /api/v1/study/sessions
 * @desc    Get user's study sessions
 * @access  Private
 * @query   studyType? - Filter by study type (kana, vocabulary, flashcard)
 * @query   limit? - Number of sessions to return (default: 10)
 */
router.get('/sessions', getSessions);

/**
 * @route   GET /api/v1/study/progress
 * @desc    Get user's progress by study type
 * @access  Private
 * @query   studyType? - Filter by study type (kana, vocabulary, flashcard)
 */
router.get('/progress', getProgress);

/**
 * @route   GET /api/v1/study/stats
 * @desc    Get user's overall statistics
 * @access  Private
 */
router.get('/stats', getStats);

export default router;
