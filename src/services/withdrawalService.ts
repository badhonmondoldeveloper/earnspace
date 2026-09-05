import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';

export interface RequestWithdrawalParams {
  userId: string;
  withdrawalMethodId: string;
  amount: number;
  currency?: string;
  idempotencyKey: string;
}

export class WithdrawalService {
  /**
   * Submits a withdrawal request with atomic fund reservation
   */
  static async requestWithdrawal(params: RequestWithdrawalParams) {
    const { userId, withdrawalMethodId, amount, currency = 'USD', idempotencyKey } = params;

    // Minimum & maximum withdrawal limit checks
    if (amount < 10) {
      return { success: false, message: 'Minimum withdrawal amount is $10.00' };
    }
    if (amount > 5000) {
      return { success: false, message: 'Maximum single withdrawal limit is $5,000.00' };
    }

    const existingRequest = await prisma.withdrawalRequest.findUnique({
      where: { idempotencyKey },
    });
    if (existingRequest) {
      return { success: true, withdrawalRequest: existingRequest, duplicate: true };
    }

    const method = await prisma.withdrawalMethod.findFirst({
      where: { id: withdrawalMethodId, userId },
    });
    if (!method) {
      return { success: false, message: 'Invalid withdrawal payout destination' };
    }

    return prisma.$transaction(async (tx) => {
      const wallet = await FinancialLedgerService.getOrCreateWallet(userId, tx);
      if (wallet.availableBalance < amount) {
        return { success: false, message: `Insufficient balance. Available: $${wallet.availableBalance.toFixed(2)}` };
      }

      const fee = 0.0; // standard fee
      const netAmount = amount - fee;

      // 1. Create withdrawal request record
      const withdrawalRequest = await tx.withdrawalRequest.create({
        data: {
          userId,
          walletId: wallet.id,
          withdrawalMethodId: method.id,
          amount,
          fee,
          netAmount,
          currency,
          status: 'under_review',
          idempotencyKey,
        },
      });

      // 2. Reserve/deduct funds from wallet via ledger transaction
      await FinancialLedgerService.recordTransaction({
        userId,
        type: 'withdrawal',
        amount,
        currency,
        referenceType: 'withdrawal_request',
        referenceId: withdrawalRequest.id,
        idempotencyKey: `wd_reserve_${withdrawalRequest.id}`,
        description: `Withdrawal request reserve via ${method.provider.toUpperCase()} (${method.accountIdentifier})`,
      });

      return { success: true, withdrawalRequest, duplicate: false };
    });
  }

  /**
   * Handles admin rejection or failure of a withdrawal request with automated fund reversal
   */
  static async rejectWithdrawal(withdrawalRequestId: string, reason: string) {
    const request = await prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalRequestId },
    });

    if (!request || request.status === 'rejected' || request.status === 'paid') {
      return { success: false, message: 'Invalid or already finalized request' };
    }

    return prisma.$transaction(async (tx) => {
      // 1. Update status to rejected
      await tx.withdrawalRequest.update({
        where: { id: withdrawalRequestId },
        data: {
          status: 'rejected',
          rejectionReason: reason,
          reviewedAt: new Date(),
        },
      });

      // 2. Reverse reserved funds back into available balance
      await FinancialLedgerService.recordTransaction({
        userId: request.userId,
        type: 'reversal',
        amount: request.amount,
        currency: request.currency,
        referenceType: 'withdrawal_reversal',
        referenceId: request.id,
        idempotencyKey: `wd_reversal_${request.id}`,
        description: `Reversal of rejected withdrawal request #${request.id}`,
      });

      return { success: true, message: 'Withdrawal request rejected and funds reversed' };
    });
  }

  static async approveWithdrawal(withdrawalRequestId: string, adminId: string, adminNote?: string) {
    const request = await prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalRequestId },
    });

    if (!request || request.status !== 'requested' && request.status !== 'under_review') {
      return { success: false, message: 'Invalid or non-approvable request' };
    }

    const updated = await prisma.withdrawalRequest.update({
      where: { id: withdrawalRequestId },
      data: {
        status: 'approved',
        reviewedAt: new Date(),
        adminNote,
      },
    });

    return { success: true, request: updated };
  }

  static async markAsPaid(withdrawalRequestId: string, adminId: string, adminNote?: string) {
    const request = await prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalRequestId },
    });

    if (!request || request.status === 'paid') {
      return { success: false, message: 'Invalid or already paid request' };
    }

    const updated = await prisma.withdrawalRequest.update({
      where: { id: withdrawalRequestId },
      data: {
        status: 'paid',
        processedAt: new Date(),
        adminNote,
      },
    });

    // Update wallet lifetimeWithdrawn amount
    await prisma.wallet.update({
      where: { id: request.walletId },
      data: {
        lifetimeWithdrawn: { increment: request.amount },
      },
    });

    return { success: true, request: updated };
  }
}

