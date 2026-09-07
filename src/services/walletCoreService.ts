import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';

export class WalletCoreService {
  /**
   * Retrieves or initializes a user's isolated wallet by userId
   */
  static async getWalletByUserId(userId: string, tx?: any) {
    return FinancialLedgerService.getOrCreateWallet(userId, tx);
  }

  /**
   * Enforces wallet freeze status
   */
  static async checkWalletActive(userId: string, tx?: any) {
    const db = tx || prisma;
    const wallet = await db.wallet.findUnique({
      where: { userId },
    });

    if (wallet && wallet.isFrozen) {
      throw new Error(`Wallet for user ${userId} is currently frozen. Financial transactions are restricted.`);
    }

    return wallet;
  }

  /**
   * Freezes or unfreezes a user wallet (Admin command)
   */
  static async setWalletFreeze(userId: string, isFrozen: boolean) {
    return prisma.$transaction(async (tx) => {
      const wallet = await FinancialLedgerService.getOrCreateWallet(userId, tx);
      const updated = await tx.wallet.update({
        where: { id: wallet.id },
        data: { isFrozen },
      });

      return updated;
    });
  }

  /**
   * Retrieves full wallet overview including ledger history
   */
  static async getWalletOverview(userId: string) {
    const wallet = await this.getWalletByUserId(userId);
    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return {
      wallet,
      transactions,
    };
  }
}
