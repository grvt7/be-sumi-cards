import { z } from 'zod';

export const studyTypeEnum = z.enum(['kana', 'vocabulary', 'flashcard', 'words']);

export const cardStudyDetailSchema = z.object({
  cardId: z.string().min(1, 'Card ID is required'),
  front: z.string().min(1, 'Front text is required'),
  back: z.string().min(1, 'Back text is required'),
  frontSub: z.string().optional(),
  backSub: z.string().optional(),
  isCorrect: z.boolean(),
  attempts: z.number().int().min(1).default(1),
  timeSpent: z.number().int().min(0).default(0),
});

export const createSessionSchema = z.object({
  studyType: studyTypeEnum,
  category: z.string().optional(),
  cardsStudied: z.number().int().min(0),
  correctAnswers: z.number().int().min(0),
  totalTime: z.number().int().min(0),
  cardsStudiedDetails: z.array(cardStudyDetailSchema).optional(),
});

export const getSessionsQuerySchema = z.object({
  studyType: studyTypeEnum.optional(),
  limit: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().min(1).max(100)).optional(),
});

export const getProgressQuerySchema = z.object({
  studyType: studyTypeEnum.optional(),
});

export const getCardProgressQuerySchema = z.object({
  studyType: studyTypeEnum.optional(),
  category: z.string().optional(),
  masteryLevel: z.string().transform((val) => parseInt(val, 10)).pipe(z.number().int().min(0).max(5)).optional(),
});

export const categoryParamsSchema = z.object({
  category: z.string().min(1, 'Category is required'),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type GetSessionsQuery = z.infer<typeof getSessionsQuerySchema>;
export type GetProgressQuery = z.infer<typeof getProgressQuerySchema>;
export type GetCardProgressQuery = z.infer<typeof getCardProgressQuerySchema>;
export type CategoryParams = z.infer<typeof categoryParamsSchema>;
