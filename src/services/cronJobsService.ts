import { prisma } from '@/lib/prisma';
import { MonetizationEngine } from './monetizationEngine';

export class CronJobsService {
  /**
   * Cleans up expired stories past 24 hours
   */
  static async cleanupExpiredStories() {
    const now = new Date();
    const result = await prisma.story.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    return { cleanedStoriesCount: result.count };
  }

  /**
   * Auto-approves pending creator earnings past pendingUntil date
   */
  static async autoApprovePendingEarnings() {
    const now = new Date();
    const pendingEarnings = await prisma.creatorEarning.findMany({
      where: {
        status: 'pending',
        pendingUntil: { lte: now },
      },
      take: 50,
    });

    let approvedCount = 0;
    for (const earning of pendingEarnings) {
      const res = await MonetizationEngine.approveEarning(earning.id);
      if (res.success) approvedCount++;
    }

    return { processedCount: pendingEarnings.length, approvedCount };
  }

  /**
   * Executes scheduled platform maintenance cron tasks
   */
  static async runScheduledTasks() {
    const storiesResult = await this.cleanupExpiredStories();
    const earningsResult = await this.autoApprovePendingEarnings();
    return {
      timestamp: new Date().toISOString(),
      storiesResult,
      earningsResult,
    };
  }
}

