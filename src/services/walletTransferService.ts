import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';
import { WalletCoreService } from './walletCoreService';

export interface ExecuteTransferInput {
  senderId: string;
  recipientUsernameOrEmail: string;
  amount: number;
  currency?: string;
  idempotencyKey: string;
  note?: string;
}

export class WalletTransferService {
  /**
   * Executes atomic wallet-to-wallet transfer between EarnSpace users
   */
  static async executeTransfer(input: ExecuteTransferInput) {
    const { senderId, recipientUsernameOrEmail, amount, currency = 'BDT', idempotencyKey, note } = input;

    if (amount <= 0) {
      throw new Error('Transfer amount must be greater than zero');
    }

    // Check sender wallet status
    await WalletCoreService.checkWalletActive(senderId);

    // Check idempotency first
    const existingTransfer = await prisma.walletTransfer.findUnique({
      where: { idempotencyKey },
    });

    if (existingTransfer) {
      return { success: true, transfer: existingTransfer, duplicate: true };
    }

    // Find recipient user
    const recipient = await prisma.user.findFirst({
      where: {
        OR: [
          { username: recipientUsernameOrEmail.toLowerCase().trim() },
          { email: recipientUsernameOrEmail.toLowerCase().trim() },
        ],
      },
    });

    if (!recipient) {
      throw new Error(`Recipient '${recipientUsernameOrEmail}' not found`);
    }

    if (recipient.id === senderId) {
      throw new Error('You cannot transfer money to your own wallet');
    }

    // Check recipient wallet status
    await WalletCoreService.checkWalletActive(recipient.id);

    return prisma.$transaction(async (tx) => {
      // 1. Get Sender Wallet & verify available balance
      const senderWallet = await FinancialLedgerService.getOrCreateWallet(senderId, tx);
      if (senderWallet.availableBalance < amount) {
        throw new Error(`Insufficient available balance. Required: ৳${amount}, Available: ৳${senderWallet.availableBalance}`);
      }

      const recipientWallet = await FinancialLedgerService.getOrCreateWallet(recipient.id, tx);

      // 2. Create WalletTransfer record
      const transfer = await tx.walletTransfer.create({
        data: {
          senderId,
          recipientId: recipient.id,
          amount,
          currency,
          fee: 0.0,
          netAmount: amount,
          status: 'COMPLETED',
          idempotencyKey,
          note,
        },
      });

      // 3. Deduct from Sender
      await tx.wallet.update({
        where: { id: senderWallet.id },
        data: { availableBalance: senderWallet.availableBalance - amount },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: senderWallet.id,
          type: 'TRANSFER_OUT',
          amount,
          currency,
          referenceType: 'transfer_id',
          referenceId: transfer.id,
          idempotencyKey: `trf_out_${transfer.id}`,
          description: `Transfer sent to @${recipient.username} ${note ? `(${note})` : ''}`,
          balanceBefore: senderWallet.availableBalance,
          balanceAfter: senderWallet.availableBalance - amount,
        },
      });

      // 4. Credit Recipient
      await tx.wallet.update({
        where: { id: recipientWallet.id },
        data: {
          availableBalance: recipientWallet.availableBalance + amount,
          lifetimeEarned: recipientWallet.lifetimeEarned + amount,
        },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: recipientWallet.id,
          type: 'TRANSFER_IN',
          amount,
          currency,
          referenceType: 'transfer_id',
          referenceId: transfer.id,
          idempotencyKey: `trf_in_${transfer.id}`,
          description: `Transfer received from user ${note ? `(${note})` : ''}`,
          balanceBefore: recipientWallet.availableBalance,
          balanceAfter: recipientWallet.availableBalance + amount,
        },
      });

      return { success: true, transfer, recipientUsername: recipient.username, duplicate: false };
    });
  }
}
