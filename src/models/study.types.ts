import mongoose from 'mongoose';

export type StudyType = 'kana' | 'vocabulary' | 'flashcard';

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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudySessionData {
  studyType: StudyType;
  category?: string;
  cardsStudied: number;
  correctAnswers: number;
  totalTime: number;
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
