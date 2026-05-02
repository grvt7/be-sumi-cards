import mongoose from 'mongoose';

import StudySession from '@/models/StudySession';
import UserProgress from '@/models/UserProgress';
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

  async getUserProgress(userId: string, studyType?: string) {
    const filter: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (studyType) {
      filter.studyType = studyType;
    }

    const progress = await UserProgress.find(filter).sort({ lastStudiedAt: -1 });
    return progress.map(p => this.sanitizeUserProgress(p));
  }

  async getUserStats(userId: string) {
    const sessions = await StudySession.aggregate([
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

    const result = sessions[0] || {
      totalSessions: 0,
      totalCardsStudied: 0,
      totalCorrectAnswers: 0,
      averageAccuracy: 0,
      totalTimeSpent: 0,
    };

    return {
      ...result,
      averageAccuracy: Math.round(result.averageAccuracy * 100) / 100,
    };
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

    const update = {
      $inc: {
        totalSessions: 1,
        totalCardsStudied: sessionData.cardsStudied,
        totalCorrectAnswers: sessionData.correctAnswers,
        totalTimeSpent: sessionData.totalTime,
      },
      $set: {
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
