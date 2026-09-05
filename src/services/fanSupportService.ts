import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';

export async function processFanSupport(params: {
  senderId: string;
  creatorId: string;
  grossAmount: number;
  message?: string;
  paymentReference?: string;
}) {
  const { senderId, creatorId, grossAmount, message, paymentReference } = params;

  if (grossAmount <= 0) {
    throw new Error('Fan support tip amount must be positive');
  }

  const platformSharePercent = 10.0; // 10% platform fee for tips
  const fees = Math.round(grossAmount * (platformSharePercent / 100) * 100) / 100;
  const creatorShare = Math.round((grossAmount - fees) * 100) / 100;
  const platformShare = fees;

  return prisma.$transaction(async (tx) => {
    const fanSupport = await tx.fanSupport.create({
      data: {
        senderId,
        creatorId,
        grossAmount,
        fees,
        creatorShare,
        platformShare,
        currency: 'USD',
        status: 'completed',
        paymentReference: paymentReference || `tip_${Date.now()}_${senderId.slice(0, 6)}`,
        message,
      },
    });

    // Credit Creator Wallet ledger immediately
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
      type: 'fan_support',
      amount: creatorShare,
      currency: 'USD',
      referenceType: 'fan_support_id',
      referenceId: fanSupport.id,
      idempotencyKey: `tip_credit_${fanSupport.id}`,
      description: `Fan support tip from user`,
    });

    return fanSupport;
  });
}

