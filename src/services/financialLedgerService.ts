import { prisma } from '@/lib/prisma';

export interface RecordTransactionParams {
  userId: string;
  type: 'earning' | 'referral' | 'bonus' | 'withdrawal' | 'reversal' | 'refund' | 'adjustment' | 'fee' | 'fan_support' | 'product_sale' | 'fan_subscription' | 'affiliate_commission' | 'deposit';
  amount: number;
  currency?: string;
  referenceType?: string;
  referenceId?: string;
  idempotencyKey: string;
  description: string;
  isPendingCredit?: boolean;
}

export class FinancialLedgerService {
  /**
   * Retrieves or initializes a user wallet transactionally
   */
  static async getOrCreateWallet(userId: string, tx?: any) {
    const db = tx || prisma;
    let wallet = await db.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      wallet = await db.wallet.create({
        data: {
          userId,
          currency: 'USD',
          availableBalance: 0.0,
          pendingBalance: 0.0,
          lifetimeEarned: 0.0,
          lifetimeWithdrawn: 0.0,
        },
      });
    }
    return wallet;
  }

  /**
   * Records an immutable financial transaction in the ledger with idempotency checks
   */
  static async recordTransaction(params: RecordTransactionParams) {
    const {
      userId,
      type,
      amount,
      currency = 'USD',
      referenceType,
      referenceId,
      idempotencyKey,
      description,
      isPendingCredit = false,
    } = params;

    // Check idempotency first
    const existingTx = await prisma.walletTransaction.findUnique({
      where: { idempotencyKey },
    });

    if (existingTx) {
      return { success: true, transaction: existingTx, duplicate: true };
    }

    return prisma.$transaction(async (tx) => {
      const wallet = await this.getOrCreateWallet(userId, tx);

      const balanceBefore = wallet.availableBalance;
      let balanceAfter = balanceBefore;
      let pendingAfter = wallet.pendingBalance;
      let lifetimeEarnedAfter = wallet.lifetimeEarned;
      let lifetimeWithdrawnAfter = wallet.lifetimeWithdrawn;

      // Handle ledger math
      if (isPendingCredit) {
        pendingAfter += amount;
      } else if (type === 'earning' || type === 'referral' || type === 'bonus' || type === 'refund' || type === 'fan_support') {
        balanceAfter += amount;
        lifetimeEarnedAfter += amount;
      } else if (type === 'withdrawal' || type === 'fee') {
        if (balanceBefore < amount) {
          throw new Error(`Insufficient available balance. Required: ${amount}, Available: ${balanceBefore}`);
        }
        balanceAfter -= amount;
        if (type === 'withdrawal') {
          lifetimeWithdrawnAfter += amount;
        }
      } else if (type === 'reversal') {
        balanceAfter -= amount;
      } else if (type === 'adjustment') {
        balanceAfter += amount;
      }

      // Round to 4 decimal places for precision
      balanceAfter = Math.round(balanceAfter * 10000) / 10000;
      pendingAfter = Math.round(pendingAfter * 10000) / 10000;
      lifetimeEarnedAfter = Math.round(lifetimeEarnedAfter * 10000) / 10000;
      lifetimeWithdrawnAfter = Math.round(lifetimeWithdrawnAfter * 10000) / 10000;

      // 1. Create append-only ledger transaction
      const transaction = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type,
          amount,
          currency,
          referenceType,
          referenceId,
          idempotencyKey,
          description,
          balanceBefore,
          balanceAfter,
        },
      });

      // 2. Update wallet balance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          availableBalance: balanceAfter,
          pendingBalance: pendingAfter,
          lifetimeEarned: lifetimeEarnedAfter,
          lifetimeWithdrawn: lifetimeWithdrawnAfter,
        },
      });

      return { success: true, transaction, duplicate: false };
    });
  }
}

