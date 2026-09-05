import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';

export function validatePayoutDestination(provider: string, identifier: string, metadata?: Record<string, any>): { valid: boolean; message?: string } {
  const p = provider.toLowerCase();

  if (p === 'bkash' || p === 'nagad') {
    if (!/^01[3-9]\d{8}$/.test(identifier.trim())) {
      return { valid: false, message: `Invalid Bangladeshi mobile number format for ${provider}. Must be 11 digits starting with 01.` };
    }
  } else if (p === 'rocket') {
    if (!/^01[3-9]\d{9}$/.test(identifier.trim())) {
      return { valid: false, message: 'Invalid Rocket mobile wallet number. Must be 12 digits.' };
    }
  } else if (p === 'bank') {
    if (!identifier || identifier.trim().length < 5) {
      return { valid: false, message: 'Invalid bank account number.' };
    }
  } else if (p === 'binance') {
    const type = metadata?.type || 'uid';
    if (type === 'uid') {
      if (!/^\d{8,12}$/.test(identifier.trim())) {
        return { valid: false, message: 'Invalid Binance UID. Must be an 8 to 12 digit numeric ID.' };
      }
    } else if (type === 'wallet') {
      const network = metadata?.network || 'TRC20';
      if (network === 'TRC20' && !/^T[a-zA-Z0-9]{33}$/.test(identifier.trim())) {
        return { valid: false, message: 'Invalid TRC20 wallet address. TRC20 addresses start with T and are 34 characters.' };
      }
      if ((network === 'ERC20' || network === 'BEP20') && !/^0x[a-fA-F0-9]{40}$/.test(identifier.trim())) {
        return { valid: false, message: `Invalid ${network} EVM wallet address.` };
      }
    }
  }

  return { valid: true };
}

export async function getMinimumPayoutThreshold(): Promise<number> {
  const setting = await prisma.platformSetting.findUnique({
    where: { key: 'MINIMUM_WITHDRAWAL_THRESHOLD' },
  });
  if (setting && setting.value) {
    const parsed = parseFloat(setting.value);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return 100.0; // Default equivalent to ৳10,000 / $100
}

export async function requestWithdrawal(params: {
  userId: string;
  withdrawalMethodId: string;
  amount: number;
  idempotencyKey: string;
}) {
  const { userId, withdrawalMethodId, amount, idempotencyKey } = params;

  // Check idempotency
  const existing = await prisma.withdrawalRequest.findUnique({
    where: { idempotencyKey },
  });
  if (existing) {
    return { success: true, request: existing, duplicate: true };
  }

  const minThreshold = await getMinimumPayoutThreshold();
  if (amount < minThreshold) {
    throw new Error(`Amount ৳${amount} is below the minimum payout threshold of ৳${minThreshold.toLocaleString()}`);
  }

  const method = await prisma.withdrawalMethod.findFirst({
    where: { id: withdrawalMethodId, userId },
  });
  if (!method) {
    throw new Error('Payout method not found or unauthorized');
  }

  return prisma.$transaction(async (tx) => {
    const wallet = await FinancialLedgerService.getOrCreateWallet(userId, tx);
    if (wallet.isFrozen) {
      throw new Error('Wallet is frozen. Cannot request payout.');
    }
    if (wallet.availableBalance < amount) {
      throw new Error(`Insufficient available balance (available: ৳${wallet.availableBalance}, requested: ৳${amount})`);
    }

    const fee = 0.0; // Configurable payout fee
    const netAmount = amount - fee;

    // Deduct available balance
    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        availableBalance: wallet.availableBalance - amount,
      },
    });

    // Record ledger transaction
    await FinancialLedgerService.recordTransaction({
      userId,
      type: 'withdrawal',
      amount,
      currency: wallet.currency,
      referenceType: 'withdrawal_request',
      referenceId: idempotencyKey,
      idempotencyKey: `w_reserve_${idempotencyKey}`,
      description: `Reserved funds for ${method.provider} payout`,
    });

    const request = await tx.withdrawalRequest.create({
      data: {
        userId,
        walletId: wallet.id,
        withdrawalMethodId: method.id,
        amount,
        fee,
        netAmount,
        currency: wallet.currency,
        status: 'requested',
        idempotencyKey,
      },
    });

    return { success: true, request, duplicate: false };
  });
}
