import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';

export interface IngestRevenueEventParams {
  sourceType: string;
  externalReference: string;
  grossAmount: number;
  fees?: number;
  currency?: string;
  eventType?: string;
  metadata?: Record<string, any>;
  userId: string;
  campaignId?: string;
}

export class MonetizationEngine {
  /**
   * Calculates decimal-safe revenue split between User and Platform
   */
  static calculateSplit(
    grossAmount: number,
    fees: number,
    rule: { userSharePercent: number; platformSharePercent: number }
  ) {
    const netEligibleAmount = Math.max(0, grossAmount - fees);
    const userShare = Math.round((netEligibleAmount * (rule.userSharePercent / 100)) * 10000) / 10000;
    const platformShare = Math.round((netEligibleAmount * (rule.platformSharePercent / 100)) * 10000) / 10000;

    return {
      netEligibleAmount,
      userShare,
      platformShare,
    };
  }

  /**
   * Processes an incoming verified business revenue event
   */
  static async ingestRevenueEvent(params: IngestRevenueEventParams) {
    const {
      sourceType,
      externalReference,
      grossAmount,
      fees = 0.0,
      currency = 'USD',
      eventType = 'conversion',
      metadata = {},
      userId,
      campaignId,
    } = params;

    // Check duplicate revenue event by externalReference
    const existingEvent = await prisma.revenueEvent.findUnique({
      where: { externalReference },
    });
    if (existingEvent) {
      return { success: true, revenueEvent: existingEvent, duplicate: true };
    }

    const netAmount = Math.max(0, grossAmount - fees);

    return prisma.$transaction(async (tx) => {
      // 1. Get or create revenue source
      let source = await tx.revenueSource.findFirst({
        where: { type: sourceType },
      });
      if (!source) {
        source = await tx.revenueSource.create({
          data: {
            name: `${sourceType.replace('_', ' ').toUpperCase()} Source`,
            type: sourceType,
            description: `Automated revenue channel for ${sourceType}`,
          },
        });
      }

      // 2. Create revenue event record
      const revenueEvent = await tx.revenueEvent.create({
        data: {
          sourceId: source.id,
          campaignId,
          externalReference,
          grossAmount,
          fees,
          netAmount,
          currency,
          verificationStatus: 'verified',
          eventType,
          metadata: JSON.stringify(metadata),
          verifiedAt: new Date(),
        },
      });

      // 3. Find active revenue rule for this source
      let rule = await tx.revenueRule.findFirst({
        where: { sourceType, status: 'active' },
        orderBy: { ruleVersion: 'desc' },
      });

      if (!rule) {
        // Default rule: 50% user share, 50% platform share
        rule = await tx.revenueRule.create({
          data: {
            name: `Default ${sourceType} Rule`,
            sourceType,
            userSharePercent: 50.0,
            platformSharePercent: 50.0,
            pendingDays: 7,
            ruleVersion: 1,
            status: 'active',
          },
        });
      }

      const userShare = Math.round((netAmount * (rule.userSharePercent / 100)) * 10000) / 10000;
      const platformShare = Math.round((netAmount * (rule.platformSharePercent / 100)) * 10000) / 10000;

      const pendingUntil = new Date();
      pendingUntil.setDate(pendingUntil.getDate() + rule.pendingDays);

      // 4. Create creator earning record
      const creatorEarning = await tx.creatorEarning.create({
        data: {
          userId,
          revenueEventId: revenueEvent.id,
          sourceId: source.id,
          campaignId,
          grossAmount,
          fees,
          netEligibleAmount: netAmount,
          userShare,
          platformShare,
          currency,
          status: 'pending',
          ruleId: rule.id,
          ruleVersion: rule.ruleVersion,
          pendingUntil,
        },
      });

      // 5. Record pending balance in wallet ledger
      await FinancialLedgerService.recordTransaction({
        userId,
        type: 'earning',
        amount: userShare,
        currency,
        referenceType: 'earning_id',
        referenceId: creatorEarning.id,
        idempotencyKey: `earning_${creatorEarning.id}`,
        description: `Pending earning from ${source.name}`,
        isPendingCredit: true,
      });

      return { success: true, revenueEvent, creatorEarning, duplicate: false };
    });
  }

  /**
   * Approves a pending earning and moves funds to available balance
   */
  static async approveEarning(earningId: string) {
    const earning = await prisma.creatorEarning.findUnique({
      where: { id: earningId },
    });

    if (!earning || earning.status !== 'pending') {
      return { success: false, message: 'Earning not found or already processed' };
    }

    return prisma.$transaction(async (tx) => {
      // Update earning status to approved
      await tx.creatorEarning.update({
        where: { id: earningId },
        data: { status: 'approved', approvedAt: new Date() },
      });

      // Deduct pending balance & credit available balance in wallet ledger
      const wallet = await FinancialLedgerService.getOrCreateWallet(earning.userId, tx);
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          pendingBalance: Math.max(0, wallet.pendingBalance - earning.userShare),
        },
      });

      await FinancialLedgerService.recordTransaction({
        userId: earning.userId,
        type: 'earning',
        amount: earning.userShare,
        currency: earning.currency,
        referenceType: 'earning_approved',
        referenceId: earning.id,
        idempotencyKey: `earning_approve_${earning.id}`,
        description: `Approved earning settlement`,
        isPendingCredit: false,
      });

      return { success: true, message: 'Earning approved successfully' };
    });
  }
}

