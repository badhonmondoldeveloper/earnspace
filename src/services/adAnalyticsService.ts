import { prisma } from '@/lib/prisma';

export class AdAnalyticsService {
  /**
   * Fetch aggregated analytics dashboard metrics for Admin or Creator
   */
  static async getOverviewMetrics(options: {
    startDate?: Date;
    endDate?: Date;
    creatorId?: string;
  }) {
    const { startDate, endDate, creatorId } = options;

    const attributions = await prisma.adRevenueAttribution.findMany({
      where: {
        creatorId: creatorId || undefined,
        createdAt: {
          gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          lte: endDate || new Date(),
        },
      },
    });

    let totalEstimatedRevenue = 0;
    let totalVerifiedRevenue = 0;
    let totalCreatorShare = 0;
    let totalPlatformShare = 0;

    for (const attr of attributions) {
      totalEstimatedRevenue += attr.estimatedRevenue;
      totalVerifiedRevenue += attr.verifiedRevenue;
      totalCreatorShare += attr.creatorShare;
      totalPlatformShare += attr.platformShare;
    }

    const totalEvents = attributions.length;
    const estimatedRPM = totalEvents > 0 ? (totalEstimatedRevenue / (totalEvents / 1000)) : 0;

    return {
      totalEvents,
      totalEstimatedRevenue: Math.round(totalEstimatedRevenue * 100) / 100,
      totalVerifiedRevenue: Math.round(totalVerifiedRevenue * 100) / 100,
      totalCreatorShare: Math.round(totalCreatorShare * 100) / 100,
      totalPlatformShare: Math.round(totalPlatformShare * 100) / 100,
      estimatedRPM: Math.round(estimatedRPM * 100) / 100,
    };
  }
}
