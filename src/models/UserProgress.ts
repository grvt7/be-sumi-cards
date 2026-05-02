import mongoose, { Schema } from 'mongoose';
import { UserProgressDocument } from './study.types';

const userProgressSchema = new Schema<UserProgressDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    studyType: {
      type: String,
      enum: ['kana', 'vocabulary', 'flashcard'],
      required: [true, 'Study type is required'],
    },
    category: {
      type: String,
      trim: true,
    },
    totalSessions: {
      type: Number,
      default: 0,
      min: [0, 'Total sessions cannot be negative'],
    },
    totalCardsStudied: {
      type: Number,
      default: 0,
      min: [0, 'Total cards studied cannot be negative'],
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0,
      min: [0, 'Total correct answers cannot be negative'],
    },
    averageAccuracy: {
      type: Number,
      default: 0,
      min: [0, 'Average accuracy cannot be negative'],
      max: [100, 'Average accuracy cannot exceed 100'],
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
      min: [0, 'Total time spent cannot be negative'],
    },
    lastStudiedAt: {
      type: Date,
      default: Date.now,
    },
    uniqueCardIds: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

// Compound index for efficient queries
userProgressSchema.index({ userId: 1, studyType: 1, category: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, lastStudiedAt: -1 });

const UserProgress = mongoose.model<UserProgressDocument>('UserProgress', userProgressSchema);

export default UserProgress;
