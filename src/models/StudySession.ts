import mongoose, { Schema } from 'mongoose';
import { StudySessionDocument } from './study.types';

const cardStudyDetailSchema = new Schema(
  {
    cardId: { type: String, required: true },
    front: { type: String, required: true },
    back: { type: String, required: true },
    frontSub: { type: String },
    backSub: { type: String },
    isCorrect: { type: Boolean, required: true },
    attempts: { type: Number, required: true, min: 1 },
    timeSpent: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const studySessionSchema = new Schema<StudySessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    studyType: {
      type: String,
      enum: ['kana', 'vocabulary', 'flashcard', 'words'],
      required: [true, 'Study type is required'],
    },
    category: {
      type: String,
      trim: true,
    },
    cardsStudied: {
      type: Number,
      required: [true, 'Cards studied is required'],
      min: [0, 'Cards studied cannot be negative'],
    },
    correctAnswers: {
      type: Number,
      required: [true, 'Correct answers is required'],
      min: [0, 'Correct answers cannot be negative'],
    },
    totalTime: {
      type: Number,
      required: [true, 'Total time is required'],
      min: [0, 'Total time cannot be negative'],
    },
    accuracy: {
      type: Number,
      required: [true, 'Accuracy is required'],
      min: [0, 'Accuracy cannot be negative'],
      max: [100, 'Accuracy cannot exceed 100'],
    },
    studiedAt: {
      type: Date,
      default: Date.now,
    },
    cardsStudiedDetails: {
      type: [cardStudyDetailSchema],
      default: [],
    },
  },
  { timestamps: true },
);

// Index for efficient queries
studySessionSchema.index({ userId: 1, studyType: 1, category: 1 });
studySessionSchema.index({ userId: 1, studiedAt: -1 });

const StudySession = mongoose.model<StudySessionDocument>('StudySession', studySessionSchema);

export default StudySession;
