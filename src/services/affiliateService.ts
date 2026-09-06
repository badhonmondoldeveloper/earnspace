import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';

export interface CreateAffiliateLinkInput {
  userId: string;
  title: string;
  targetUrl: string;
  commissionRate?: number;
}

export class AffiliateService {
  static async createLink(input: CreateAffiliateLinkInput) {
    const slug = `aff-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    return prisma.affiliateLink.create({
      data: {
        userId: input.userId,
        title: input.title,
        targetUrl: input.targetUrl,
        slug,
        commissionRate: input.commissionRate || 5.0,
      },
    });
  }

  static async getUserLinks(userId: string) {
    return prisma.affiliateLink.findMany({
      where: { userId },
      include: {
        conversions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async trackClick(slug: string, ipAddress?: string, userAgent?: string, referrer?: string) {
    const link = await prisma.affiliateLink.findUnique({
      where: { slug },
    });

    if (!link || link.status !== 'active') {
      return null;
    }

    await prisma.$transaction([
      prisma.affiliateClick.create({
        data: {
          linkId: link.id,
          ipAddress,
          userAgent,
          referrer,
        },
      }),
      prisma.affiliateLink.update({
        where: { id: link.id },
        data: { clicksCount: { increment: 1 } },
      }),
    ]);

    return link;
  }

  static async recordConversion(slug: string, orderAmount: number, orderId?: string) {
    return prisma.$transaction(async (tx) => {
      const link = await tx.affiliateLink.findUnique({
        where: { slug },
      });

      if (!link || link.status !== 'active') {
        throw new Error('Affiliate link not found or inactive');
      }

      const commission = Math.round(orderAmount * (link.commissionRate / 100) * 100) / 100;

      const conversion = await tx.affiliateConversion.create({
        data: {
          linkId: link.id,
          orderId,
          amount: orderAmount,
          commission,
          status: 'approved',
        },
      });

      // Update link aggregate counts
      await tx.affiliateLink.update({
        where: { id: link.id },
        data: {
          conversionsCount: { increment: 1 },
          totalEarned: { increment: commission },
        },
      });

      // Credit Affiliate User Wallet
      const wallet = await FinancialLedgerService.getOrCreateWallet(link.userId, tx);
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          availableBalance: wallet.availableBalance + commission,
          lifetimeEarned: wallet.lifetimeEarned + commission,
        },
      });

      await FinancialLedgerService.recordTransaction({
        userId: link.userId,
        type: 'affiliate_commission',
        amount: commission,
        currency: 'BDT',
        referenceType: 'conversion_id',
        referenceId: conversion.id,
        idempotencyKey: `aff_comm_${conversion.id}`,
        description: `Affiliate commission for ${link.title}`,
      });

      return conversion;
    });
  }
}
