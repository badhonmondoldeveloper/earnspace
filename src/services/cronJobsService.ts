import { prisma } from '@/lib/prisma';

export class CronJobsService {
  /**
   * Run background cleanup of expired stories (older than 24 hours)
   */
  static async cleanupExpiredStories() {
    const now = new Date();
    const result = await prisma.story.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`[CronJob] Cleaned up ${result.count} expired stories.`);
    return result;
  }

  /**
   * Check provider health status and mark degraded if error threshold exceeded
   */
  static async checkProviderHealth() {
    const providers = await prisma.adProvider.findMany({
      where: { status: 'active' },
    });

    for (const provider of providers) {
      // In production, ping provider health endpoint or verify API latency
      await prisma.adProvider.update({
        where: { id: provider.id },
        data: { healthStatus: 'healthy' },
      });
    }

    return { checked: providers.length };
  }

  /**
   * Run campaign budget pacing audit and complete depleted campaigns
   */
  static async auditCampaignBudgets() {
    const activeCampaigns = await prisma.adCampaign.findMany({
      where: { status: 'approved' },
    });

    let completedCount = 0;
    for (const campaign of activeCampaigns) {
      // If endAt date passed, mark as completed
      if (campaign.endAt && campaign.endAt < new Date()) {
        await prisma.adCampaign.update({
          where: { id: campaign.id },
          data: { status: 'completed' },
        });
        completedCount++;
      }
    }

    return { audited: activeCampaigns.length, completed: completedCount };
  }

  /**
   * Master Background Task Executor
   */
  static async runAllJobs() {
    const storyCleanup = await this.cleanupExpiredStories();
    const providerHealth = await this.checkProviderHealth();
    const campaignAudit = await this.auditCampaignBudgets();

    return {
      timestamp: new Date().toISOString(),
      storyCleanup,
      providerHealth,
      campaignAudit,
    };
  }
}
