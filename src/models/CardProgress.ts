import mongoose, { Schema } from 'mongoose';
import { CardProgressDocument } from './study.types';

const cardProgressSchema = new Schema<CardProgressDocument>(
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
    cardReference: {
      type: String,
      required: [true, 'Card reference is required'],
      index: true, // For efficient lookups
    },
    cardData: {
      front: { type: String, required: true },
      back: { type: String, required: true },
      frontSub: { type: String },
      backSub: { type: String },
      metadata: { type: Schema.Types.Mixed }, // Additional data like row, level, topic, etc.
    },
    stats: {
      totalAttempts: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      correctAttempts: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      wrongAttempts: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      totalTimeSpent: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      averageTimePerAttempt: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      accuracy: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100,
      },
      masteryLevel: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 5, // 0 = never seen, 5 = mastered
      },
      lastStudiedAt: {
        type: Date,
        default: Date.now,
      },
      firstStudiedAt: {
        type: Date,
        default: Date.now,
      },
      consecutiveCorrect: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      bestStreak: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
    },
    recentSessions: [
      {
        sessionId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        studiedAt: {
          type: Date,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
        timeSpent: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
    // Compound index for efficient queries
    index: [
      { userId: 1, studyType: 1, category: 1 },
      { userId: 1, cardReference: 1 },
      { userId: 1, studyType: 1, 'stats.masteryLevel': 1 },
    ],
  },
);

// Pre-save middleware to update calculated fields
cardProgressSchema.pre('save', function (next) {
  const stats = this.stats;

  // Calculate accuracy
  if (stats.totalAttempts > 0) {
    stats.accuracy = (stats.correctAttempts / stats.totalAttempts) * 100;
    stats.averageTimePerAttempt = stats.totalTimeSpent / stats.totalAttempts;
  }

  // Update mastery level based on performance
  if (stats.totalAttempts >= 1) {
    if (stats.accuracy >= 90 && stats.consecutiveCorrect >= 3) {
      stats.masteryLevel = 5; // Mastered
    } else if (stats.accuracy >= 80 && stats.consecutiveCorrect >= 2) {
      stats.masteryLevel = 4; // Very good
    } else if (stats.accuracy >= 70) {
      stats.masteryLevel = 3; // Good
    } else if (stats.accuracy >= 50) {
      stats.masteryLevel = 2; // Learning
    } else {
      stats.masteryLevel = 1; // Needs work
    }
  }

  // Update best streak
  if (stats.consecutiveCorrect > stats.bestStreak) {
    stats.bestStreak = stats.consecutiveCorrect;
  }

  next();
});

// Static method to update card progress from session data
cardProgressSchema.statics.updateFromSession = async function (
  userId: string,
  studyType: string,
  category: string,
  cardDetails: any[],
) {
  const bulkOps = cardDetails.map(card => ({
    updateOne: {
      filter: {
        userId: new mongoose.Types.ObjectId(userId),
        studyType,
        category,
        cardReference: card.cardReference,
      },
      update: {
        $setOnInsert: {
          cardData: {
            front: card.front,
            back: card.back,
            frontSub: card.frontSub,
            backSub: card.backSub,
            metadata: card.metadata || {},
          },
          firstStudiedAt: new Date(),
        },
        $inc: {
          'stats.totalAttempts': 1,
          'stats.totalTimeSpent': card.timeSpent,
          ...(card.isCorrect
            ? { 'stats.correctAttempts': 1, 'stats.consecutiveCorrect': 1 }
            : { 'stats.wrongAttempts': 1 }),
        },
        $set: {
          'stats.lastStudiedAt': new Date(),
          ...(card.isCorrect ? {} : { 'stats.consecutiveCorrect': 0 }),
        },
        $push: {
          recentSessions: {
            $each: [
              {
                sessionId: card.sessionId,
                studiedAt: new Date(),
                isCorrect: card.isCorrect,
                timeSpent: card.timeSpent,
              },
            ],
            $slice: -10, // Keep only last 10 sessions
          },
        },
      },
    },
  }));

  return this.bulkWrite(bulkOps, { upsert: true });
};

const CardProgress = mongoose.model<CardProgressDocument>('CardProgress', cardProgressSchema);

export default CardProgress;
