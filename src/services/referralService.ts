import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';

export class ReferralService {
  /**
   * Generates or retrieves unique referral code for a user
   */
  static async getOrCreateReferralCode(userId: string) {
    let referral = await prisma.referral.findUnique({
      where: { userId },
    });

    if (!referral) {
      const code = `REF_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      referral = await prisma.referral.create({
        data: {
          userId,
          referralCode: code,
        },
      });
    }

    return referral;
  }

  /**
   * Registers a new referred user under a referrer, enforcing anti-self-referral checks
   */
  static async registerReferral(referrerUserId: string, referredUserId: string) {
    if (referrerUserId === referredUserId) {
      return { success: false, error: 'Self-referral is strictly prohibited' };
    }

    let referral = await prisma.referral.findUnique({
      where: { userId: referrerUserId },
    });

    if (!referral) {
      referral = await this.getOrCreateReferralCode(referrerUserId);
    }

    const referralEvent = await prisma.referralEvent.create({
      data: {
        referralId: referral.id,
        referredUserId,
        qualificationStatus: 'pending',
      },
    });

    return { success: true, referralEvent };
  }

  /**
   * Process a referral reward upon user qualification event
   */
  static async qualifyReferral(referredUserId: string) {
    const referralEvent = await prisma.referralEvent.findFirst({
      where: { referredUserId, qualificationStatus: 'pending' },
      include: { parent: true },
    });

    if (!referralEvent) return { success: false, message: 'No pending referral event' };

    const rewardAmount = 5.0; // $5 referral bonus reward

    return prisma.$transaction(async (tx) => {
      await tx.referralEvent.update({
        where: { id: referralEvent.id },
        data: {
          qualificationStatus: 'qualified',
          rewardAmount,
          rewardedAt: new Date(),
        },
      });

      await tx.referral.update({
        where: { id: referralEvent.parent.id },
        data: { totalReferrals: { increment: 1 } },
      });

      // Credit reward to referrer wallet via ledger
      await FinancialLedgerService.recordTransaction({
        userId: referralEvent.parent.userId,
        type: 'referral',
        amount: rewardAmount,
        currency: 'USD',
        referenceType: 'referral_event',
        referenceId: referralEvent.id,
        idempotencyKey: `ref_reward_${referralEvent.id}`,
        description: `Qualified referral reward bonus`,
      });

      return { success: true, rewardAmount };
    });
  }
}

