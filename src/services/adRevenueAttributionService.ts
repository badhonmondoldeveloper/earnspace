import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';

export interface RecordAdRevenueRequest {
  eventId?: string;
  providerKey: string;
  placementSlot: string;
  campaignId?: string;
  contentId?: string;
  contentType?: string; // post, video, reel, blog, space
  creatorId?: string;
  estimatedRevenue: number;
  reportedRevenue?: number;
  ruleVersion?: number;
}

export class AdRevenueAttributionService {
  /**
   * Record estimated ad revenue event from ad network / campaign
   */
  static async recordEstimatedRevenue(req: RecordAdRevenueRequest) {
    const {
      eventId,
      providerKey,
      placementSlot,
      campaignId,
      contentId,
      contentType,
      creatorId,
      estimatedRevenue,
      reportedRevenue = estimatedRevenue,
      ruleVersion = 1,
    } = req;

    // Fetch active revenue rule or default 50/50 split
    let creatorSharePercent = 50.0;
    let platformSharePercent = 50.0;

    const activeRule = await prisma.revenueRule.findFirst({
      where: { status: 'active', sourceType: 'ad_revenue' },
      orderBy: { ruleVersion: 'desc' },
    });

    if (activeRule) {
      creatorSharePercent = activeRule.userSharePercent;
      platformSharePercent = activeRule.platformSharePercent;
    }

    const creatorShare = Math.round((estimatedRevenue * (creatorSharePercent / 100)) * 100) / 100;
    const platformShare = Math.round((estimatedRevenue * (platformSharePercent / 100)) * 100) / 100;

    return prisma.adRevenueAttribution.create({
      data: {
        eventId: eventId || `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        providerKey,
        placementSlot,
        campaignId: campaignId || null,
        contentId: contentId || null,
        contentType: contentType || null,
        creatorId: creatorId || null,
        estimatedRevenue,
        reportedRevenue,
        verifiedRevenue: 0.0,
        creatorShare,
        platformShare,
        status: 'estimated',
        ruleVersion: activeRule ? activeRule.ruleVersion : ruleVersion,
      },
    });
  }

  /**
   * Verify ad revenue & transition from estimated -> verified -> wallet credit
   */
  static async verifyAndCreditRevenue(attributionId: string, verifiedRevenue: number) {
    return prisma.$transaction(async (tx) => {
      const attribution = await tx.adRevenueAttribution.findUnique({
        where: { id: attributionId },
      });

      if (!attribution) throw new Error('Attribution record not found');
      if (attribution.status === 'verified') throw new Error('Attribution already verified');

      const creatorShare = Math.round((verifiedRevenue * (attribution.creatorShare / (attribution.estimatedRevenue || 1))) * 100) / 100;
      const platformShare = Math.round((verifiedRevenue - creatorShare) * 100) / 100;

      const updated = await tx.adRevenueAttribution.update({
        where: { id: attributionId },
        data: {
          verifiedRevenue,
          creatorShare,
          platformShare,
          status: 'verified',
        },
      });

      // If attributed to a creator, credit their ledger wallet
      if (attribution.creatorId && creatorShare > 0) {
        await FinancialLedgerService.recordTransaction({
          userId: attribution.creatorId,
          amount: creatorShare,
          type: 'earning',
          description: `Ad Revenue payout for placement [${attribution.placementSlot}]`,
          idempotencyKey: `ad_attr_credit_${attribution.id}`,
        });
      }

      return updated;
    });
  }

  /**
   * Reverse ad revenue in case of fraud or advertiser clawback
   */
  static async reverseRevenue(attributionId: string, reason: string) {
    return prisma.$transaction(async (tx) => {
      const attribution = await tx.adRevenueAttribution.findUnique({
        where: { id: attributionId },
      });

      if (!attribution) throw new Error('Attribution record not found');
      if (attribution.status === 'reversed') return attribution;

      // If it was previously verified and credited to creator, issue a wallet debit reversal
      if (attribution.status === 'verified' && attribution.creatorId && attribution.creatorShare > 0) {
        await FinancialLedgerService.recordTransaction({
          userId: attribution.creatorId,
          amount: attribution.creatorShare,
          type: 'reversal',
          description: `Ad Revenue Reversal: ${reason}`,
          idempotencyKey: `ad_attr_reversal_${attribution.id}`,
        });
      }

      return tx.adRevenueAttribution.update({
        where: { id: attributionId },
        data: {
          status: 'reversed',
          reversalReason: reason,
        },
      });
    });
  }
}
