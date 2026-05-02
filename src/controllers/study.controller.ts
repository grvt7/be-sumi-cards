import { StudyService } from '@/services/study.service';
import { ErrorCategory } from '@/types/errorTypes';
import { ApiError } from '@/utils/ApiErrors';
import { ApiResponse } from '@/utils/ApiResponse';
import asyncHandler from '@/utils/asyncHandler';

const studyService = new StudyService();

export const createSession = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();

  if (!userId) {
    throw new ApiError(401, 'User not authenticated', undefined, ErrorCategory.AUTHENTICATION);
  }

  const session = await studyService.createStudySession(userId, req.body);

  res.status(201).json(new ApiResponse(201, session, 'Study session created'));
});

export const getSessions = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();

  if (!userId) {
    throw new ApiError(401, 'User not authenticated', undefined, ErrorCategory.AUTHENTICATION);
  }

  const { studyType, limit } = req.query;
  const parsedLimit = limit ? parseInt(limit) : 10;
  const sessions = await studyService.getUserSessions(userId, studyType, parsedLimit);

  res.status(200).json(new ApiResponse(200, sessions, 'Study sessions retrieved'));
});

export const getProgress = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();

  if (!userId) {
    throw new ApiError(401, 'User not authenticated', undefined, ErrorCategory.AUTHENTICATION);
  }

  const { studyType } = req.query;
  const progress = await studyService.getUserProgress(userId, studyType);

  res.status(200).json(new ApiResponse(200, progress, 'Progress retrieved'));
});

export const getCategoryProgress = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();

  if (!userId) {
    throw new ApiError(401, 'User not authenticated', undefined, ErrorCategory.AUTHENTICATION);
  }

  const { category } = req.params;
  const sessions = await studyService.getCategorySessions(userId, category);

  res.status(200).json(new ApiResponse(200, sessions, 'Category progress retrieved'));
});

export const getCardProgress = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();

  if (!userId) {
    throw new ApiError(401, 'User not authenticated', undefined, ErrorCategory.AUTHENTICATION);
  }

  const { studyType, category, masteryLevel } = req.query;
  const cards = await studyService.getCardProgress(
    userId,
    studyType as string,
    category as string,
    masteryLevel ? parseInt(masteryLevel as string) : undefined,
  );

  res.status(200).json(new ApiResponse(200, cards, 'Card progress retrieved'));
});

export const getCardProgressSummary = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();

  if (!userId) {
    throw new ApiError(401, 'User not authenticated', undefined, ErrorCategory.AUTHENTICATION);
  }

  const { studyType, category } = req.query;
  const summary = await studyService.getCardProgressSummary(
    userId,
    studyType as string,
    category as string,
  );

  res.status(200).json(new ApiResponse(200, summary, 'Card progress summary retrieved'));
});

export const getStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id.toString();

  if (!userId) {
    throw new ApiError(401, 'User not authenticated', undefined, ErrorCategory.AUTHENTICATION);
  }

  const stats = await studyService.getUserStats(userId);

  res.status(200).json(new ApiResponse(200, stats, 'Stats retrieved'));
});
