import mongoose from 'mongoose';

import StudySession from '@/models/StudySession';
import UserProgress from '@/models/UserProgress';
import CardProgress from '@/models/CardProgress';
import {
  CreateStudySessionData,
  StudySessionResponse,
  UserProgressResponse,
} from '@/models/study.types';

export class StudyService {
  async createStudySession(userId: string, sessionData: CreateStudySessionData) {
    const accuracy =
      sessionData.cardsStudied > 0
        ? Math.round((sessionData.correctAnswers / sessionData.cardsStudied) * 100)
        : 0;

    const session = await StudySession.create({
      userId: new mongoose.Types.ObjectId(userId),
      ...sessionData,
      accuracy,
    });

    // Update user progress
    await this.updateUserProgress(userId, sessionData, accuracy);

    // Update card progress if cardsStudiedDetails are provided
    if (sessionData.cardsStudiedDetails && sessionData.cardsStudiedDetails.length > 0) {
      const cardDetailsForProgress = sessionData.cardsStudiedDetails.map(card => ({
        cardReference: card.cardId, // Use cardId as reference
        front: card.front,
        back: card.back,
        frontSub: card.frontSub,
        backSub: card.backSub,
        isCorrect: card.isCorrect,
        timeSpent: card.timeSpent,
        sessionId: session._id,
        metadata: {}, // Can be extended with additional metadata
      }));

      await CardProgress.updateFromSession(
        userId,
        sessionData.studyType,
        sessionData.category || '',
        cardDetailsForProgress,
      );
    }

    return this.sanitizeStudySession(session);
  }

  async getUserSessions(userId: string, studyType?: string, limit = 10) {
    const filter: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (studyType) {
      filter.studyType = studyType;
    }

    const sessions = await StudySession.find(filter).sort({ studiedAt: -1 }).limit(limit).exec();
    return sessions.map(session => this.sanitizeStudySession(session));
  }

  async getCategorySessions(userId: string, category: string, limit = 100) {
    const filter: any = {
      userId: new mongoose.Types.ObjectId(userId),
      category: category,
    };

    const sessions = await StudySession.find(filter).sort({ studiedAt: -1 }).limit(limit).exec();

    return sessions.map(session => this.sanitizeStudySession(session));
  }

  async getUserProgress(userId: string, studyType?: string) {
    const filter: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (studyType) {
      filter.studyType = studyType;
    }

    const progress = await UserProgress.find(filter).sort({ lastStudiedAt: -1 });
    return progress.map(p => this.sanitizeUserProgress(p));
  }

  async getUserStats(userId: string) {
    const stats = await StudySession.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalCardsStudied: { $sum: '$cardsStudied' },
          totalCorrectAnswers: { $sum: '$correctAnswers' },
          totalTimeSpent: { $sum: '$totalTime' },
          averageAccuracy: { $avg: '$accuracy' },
        },
      },
    ]);

    return (
      stats[0] || {
        totalSessions: 0,
        totalCardsStudied: 0,
        totalCorrectAnswers: 0,
        totalTimeSpent: 0,
        averageAccuracy: 0,
      }
    );
  }

  async getCardProgress(
    userId: string,
    studyType?: string,
    category?: string,
    masteryLevel?: number,
  ) {
    const filter: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (studyType) filter.studyType = studyType;
    if (category) filter.category = category;
    if (masteryLevel !== undefined) filter['stats.masteryLevel'] = masteryLevel;

    const cards = await CardProgress.find(filter).sort({ 'stats.lastStudiedAt': -1 }).exec();

    return cards.map(card => ({
      _id: card._id.toString(),
      studyType: card.studyType,
      category: card.category,
      cardReference: card.cardReference,
      cardData: card.cardData,
      stats: card.stats,
      recentSessions: card.recentSessions,
    }));
  }

  async getCardProgressSummary(userId: string, studyType?: string, category?: string) {
    const matchStage: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (studyType) matchStage.studyType = studyType;
    if (category) matchStage.category = category;

    const summary = await CardProgress.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalCards: { $sum: 1 },
          masteredCards: {
            $sum: { $cond: [{ $gte: ['$stats.masteryLevel', 5] }, 1, 0] },
          },
          learningCards: {
            $sum: {
              $cond: [
                {
                  $and: [{ $gte: ['$stats.masteryLevel', 2] }, { $lt: ['$stats.masteryLevel', 5] }],
                },
                1,
                0,
              ],
            },
          },
          needsWorkCards: {
            $sum: { $cond: [{ $lt: ['$stats.masteryLevel', 2] }, 1, 0] },
          },
          averageAccuracy: { $avg: '$stats.accuracy' },
          totalAttempts: { $sum: '$stats.totalAttempts' },
          totalCorrect: { $sum: '$stats.correctAttempts' },
          totalTimeSpent: { $sum: '$stats.totalTimeSpent' },
        },
      },
    ]);

    return (
      summary[0] || {
        totalCards: 0,
        masteredCards: 0,
        learningCards: 0,
        needsWorkCards: 0,
        averageAccuracy: 0,
        totalAttempts: 0,
        totalCorrect: 0,
        totalTimeSpent: 0,
      }
    );
  }

  private async updateUserProgress(
    userId: string,
    sessionData: CreateStudySessionData,
    accuracy: number,
  ): Promise<void> {
    const filter = {
      userId: new mongoose.Types.ObjectId(userId),
      studyType: sessionData.studyType,
      category: sessionData.category || undefined,
    };

    // Get current progress to calculate cumulative unique cards
    const currentProgress = await UserProgress.findOne(filter);

    let totalUniqueCards = 0;
    let existingUniqueCardIds = new Set<string>();

    // If we have existing progress with tracked unique cards, use them
    if (
      currentProgress &&
      currentProgress.uniqueCardIds &&
      currentProgress.uniqueCardIds.length > 0
    ) {
      existingUniqueCardIds = new Set(currentProgress.uniqueCardIds);
      totalUniqueCards = existingUniqueCardIds.size;
    } else if (currentProgress && currentProgress.totalCardsStudied > 0) {
      // Fallback: calculate unique cards from CardProgress for existing data
      try {
        const CardProgress = mongoose.model('CardProgress');
        const cardProgressRecords = await CardProgress.find({
          userId: currentProgress.userId,
          studyType: sessionData.studyType,
          category: sessionData.category || undefined,
        }).distinct('cardReference');

        existingUniqueCardIds = new Set(cardProgressRecords);
        totalUniqueCards = existingUniqueCardIds.size;
      } catch (error) {
        console.error('Error calculating unique cards from CardProgress:', error);
        // Final fallback: use current totalCardsStudied but cap it at reasonable number
        totalUniqueCards = Math.min(currentProgress.totalCardsStudied, 100); // Reasonable cap
      }
    }

    // Add new unique cards from this session
    if (sessionData.cardsStudiedDetails && sessionData.cardsStudiedDetails.length > 0) {
      sessionData.cardsStudiedDetails.forEach(card => {
        existingUniqueCardIds.add(card.cardId);
      });
      totalUniqueCards = existingUniqueCardIds.size;
    } else {
      // Fallback if no card details available
      totalUniqueCards = Math.max(totalUniqueCards, sessionData.cardsStudied);
    }

    const update = {
      $inc: {
        totalSessions: 1,
        totalCorrectAnswers: sessionData.correctAnswers,
        totalTimeSpent: sessionData.totalTime,
      },
      $set: {
        totalCardsStudied: totalUniqueCards,
        uniqueCardIds: Array.from(existingUniqueCardIds),
        lastStudiedAt: new Date(),
      },
    };

    const options = { upsert: true, new: true };

    const progress = await UserProgress.findOneAndUpdate(filter, update, options);

    if (progress) {
      // Recalculate average accuracy
      const totalAccuracy = progress.totalSessions * progress.averageAccuracy + accuracy;
      const newAverageAccuracy = totalAccuracy / progress.totalSessions;

      await UserProgress.updateOne(
        { _id: progress._id },
        { $set: { averageAccuracy: Math.round(newAverageAccuracy * 100) / 100 } },
      );
    }
  }

  private sanitizeStudySession(session: any): StudySessionResponse {
    return {
      _id: session._id.toString(),
      studyType: session.studyType,
      category: session.category,
      cardsStudied: session.cardsStudied,
      correctAnswers: session.correctAnswers,
      totalTime: session.totalTime,
      accuracy: session.accuracy,
      studiedAt: session.studiedAt,
      cardsStudiedDetails: session.cardsStudiedDetails || [],
    };
  }

  private sanitizeUserProgress(progress: any): UserProgressResponse {
    return {
      _id: progress._id.toString(),
      studyType: progress.studyType,
      category: progress.category,
      totalSessions: progress.totalSessions,
      totalCardsStudied: progress.totalCardsStudied,
      totalCorrectAnswers: progress.totalCorrectAnswers,
      averageAccuracy: progress.averageAccuracy,
      totalTimeSpent: progress.totalTimeSpent,
      lastStudiedAt: progress.lastStudiedAt,
    };
  }
}
