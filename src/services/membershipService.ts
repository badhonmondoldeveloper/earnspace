import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';

export interface CreateTierInput {
  creatorId: string;
  name: string;
  price: number;
  currency?: string;
  perks?: string[];
}

export class MembershipService {
  static async getCreatorTiers(creatorId: string) {
    let tiers = await prisma.creatorMembershipTier.findMany({
      where: { creatorId, status: 'active' },
      orderBy: { price: 'asc' },
    });

    // If no custom tiers exist yet, populate default tiers for the creator
    if (tiers.length === 0) {
      const defaultTiers = [
        { name: 'Supporter', price: 99, perks: JSON.stringify(['Supporter Badge', 'Exclusive Posts']) },
        { name: 'VIP Member', price: 299, perks: JSON.stringify(['Supporter Badge', 'Exclusive Posts', 'Direct Messaging', 'Early Access Videos']) },
        { name: 'Elite Club', price: 599, perks: JSON.stringify(['VIP Access', '1-on-1 Monthly Q&A', 'Custom Digital Downloads', 'Private Community']) },
      ];

      for (const t of defaultTiers) {
        await prisma.creatorMembershipTier.create({
          data: {
            creatorId,
            name: t.name,
            price: t.price,
            currency: 'BDT',
            perks: t.perks,
            status: 'active',
          },
        });
      }

      tiers = await prisma.creatorMembershipTier.findMany({
        where: { creatorId, status: 'active' },
        orderBy: { price: 'asc' },
      });
    }

    return tiers;
  }

  static async createTier(input: CreateTierInput) {
    if (input.price <= 0) {
      throw new Error('Membership price must be greater than zero');
    }

    return prisma.creatorMembershipTier.create({
      data: {
        creatorId: input.creatorId,
        name: input.name,
        price: input.price,
        currency: input.currency || 'BDT',
        perks: JSON.stringify(input.perks || []),
        status: 'active',
      },
    });
  }

  static async subscribeToTier(subscriberId: string, creatorId: string, tierId: string) {
    return prisma.$transaction(async (tx) => {
      const tier = await tx.creatorMembershipTier.findUnique({
        where: { id: tierId },
      });

      if (!tier || tier.status !== 'active') {
        throw new Error('Membership tier not found or inactive');
      }

      if (subscriberId === creatorId) {
        throw new Error('You cannot subscribe to your own membership tier');
      }

      const currentPeriodEnd = new Date();
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);

      // Upsert fan subscription
      const subscription = await tx.fanSubscription.upsert({
        where: {
          subscriberId_creatorId: {
            subscriberId,
            creatorId,
          },
        },
        update: {
          tierName: tier.name,
          price: tier.price,
          currency: tier.currency,
          status: 'active',
          currentPeriodEnd,
        },
        create: {
          subscriberId,
          creatorId,
          tierName: tier.name,
          price: tier.price,
          currency: tier.currency,
          status: 'active',
          currentPeriodEnd,
        },
      });

      // Credit Creator (85% creator share, 15% platform share)
      const platformFeeRate = 0.15;
      const creatorShare = Math.round(tier.price * (1 - platformFeeRate) * 100) / 100;

      const wallet = await FinancialLedgerService.getOrCreateWallet(creatorId, tx);
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          availableBalance: wallet.availableBalance + creatorShare,
          lifetimeEarned: wallet.lifetimeEarned + creatorShare,
        },
      });

      await FinancialLedgerService.recordTransaction({
        userId: creatorId,
        type: 'fan_subscription',
        amount: creatorShare,
        currency: tier.currency,
        referenceType: 'subscription_id',
        referenceId: subscription.id,
        idempotencyKey: `sub_${subscription.id}_${Date.now()}`,
        description: `Fan membership subscription: ${tier.name}`,
      });

      return subscription;
    });
  }
}
