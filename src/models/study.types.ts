import mongoose from 'mongoose';

export type StudyType = 'kana' | 'vocabulary' | 'flashcard' | 'words';

export interface CardStudyDetail {
  cardId: string;
  front: string;
  back: string;
  frontSub?: string;
  backSub?: string;
  isCorrect: boolean;
  attempts: number;
  timeSpent: number;
}

export interface StudySessionDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  studyType: StudyType;
  category?: string; // e.g., 'hiragana', 'jlpt-n5', etc.
  cardsStudied: number;
  correctAnswers: number;
  totalTime: number; // in seconds
  accuracy: number; // percentage
  studiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  cardsStudiedDetails?: CardStudyDetail[];
}

export interface UserProgressDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  studyType: StudyType;
  category?: string;
  totalSessions: number;
  totalCardsStudied: number;
  totalCorrectAnswers: number;
  averageAccuracy: number;
  totalTimeSpent: number;
  lastStudiedAt: Date;
  uniqueCardIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudySessionData {
  studyType: StudyType;
  category?: string;
  cardsStudied: number;
  correctAnswers: number;
  totalTime: number;
  cardsStudiedDetails?: CardStudyDetail[];
}

export interface StudySessionResponse {
  _id: string;
  studyType: StudyType;
  category?: string;
  cardsStudied: number;
  correctAnswers: number;
  totalTime: number;
  accuracy: number;
  studiedAt: Date;
  cardsStudiedDetails?: CardStudyDetail[];
}

export interface UserProgressResponse {
  _id: string;
  studyType: StudyType;
  category?: string;
  totalSessions: number;
  totalCardsStudied: number;
  totalCorrectAnswers: number;
  averageAccuracy: number;
  totalTimeSpent: number;
  lastStudiedAt: Date;
}

export interface CardProgressDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  studyType: StudyType;
  category?: string;
  cardReference: string;
  cardData: {
    front: string;
    back: string;
    frontSub?: string;
    backSub?: string;
    metadata?: any;
  };
  stats: {
    totalAttempts: number;
    correctAttempts: number;
    wrongAttempts: number;
    totalTimeSpent: number;
    averageTimePerAttempt: number;
    accuracy: number;
    masteryLevel: number;
    lastStudiedAt: Date;
    firstStudiedAt: Date;
    consecutiveCorrect: number;
    bestStreak: number;
  };
  recentSessions: Array<{
    sessionId: mongoose.Types.ObjectId;
    studiedAt: Date;
    isCorrect: boolean;
    timeSpent: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
