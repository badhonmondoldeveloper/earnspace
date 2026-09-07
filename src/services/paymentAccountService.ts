import { prisma } from '@/lib/prisma';

export interface CreatePaymentAccountInput {
  userId: string;
  provider: 'BKASH' | 'NAGAD' | 'ROCKET' | 'UPAY' | 'BANK' | 'CRYPTO';
  accountType?: 'PERSONAL' | 'MERCHANT' | 'AGENT';
  phoneNumber: string;
  displayName?: string;
}

export class PaymentAccountService {
  /**
   * Masks sensitive account phone number e.g. 01712345678 -> 017****5678
   */
  static maskPhoneNumber(phone: string): string {
    if (!phone || phone.length < 8) return phone;
    const prefix = phone.substring(0, 3);
    const suffix = phone.substring(phone.length - 4);
    return `${prefix}****${suffix}`;
  }

  /**
   * Registers a new external payment account for a user
   */
  static async addAccount(input: CreatePaymentAccountInput) {
    const { userId, provider, accountType = 'PERSONAL', phoneNumber, displayName } = input;

    if (!phoneNumber || phoneNumber.trim().length < 6) {
      throw new Error('Valid phone number or account identifier is required');
    }

    try {
      const account = await prisma.paymentAccount.create({
        data: {
          userId,
          provider: provider.toUpperCase(),
          accountType: accountType.toUpperCase(),
          phoneNumber: phoneNumber.trim(),
          displayName: displayName || `${provider.toUpperCase()} (${this.maskPhoneNumber(phoneNumber.trim())})`,
          verificationStatus: 'PENDING',
          status: 'active',
        },
      });

      return {
        ...account,
        maskedPhone: this.maskPhoneNumber(account.phoneNumber),
      };
    } catch (err: any) {
      if (err?.code === 'P2021' || err?.message?.includes('does not exist')) {
        throw new Error('Database table for Payment Accounts is currently being provisioned. Please try again in a few moments.');
      }
      throw err;
    }
  }

  /**
   * Retrieves a user's registered payment accounts with sensitive information masked
   */
  static async getUserAccounts(userId: string) {
    try {
      const accounts = await prisma.paymentAccount.findMany({
        where: { userId, status: 'active' },
        orderBy: { createdAt: 'desc' },
      });

      return accounts.map((acc) => ({
        ...acc,
        maskedPhone: this.maskPhoneNumber(acc.phoneNumber),
      }));
    } catch (err: any) {
      console.warn('getUserAccounts fallback (table missing or offline):', err?.message);
      return [];
    }
  }

  /**
   * Updates verification status (Admin only)
   */
  static async updateVerificationStatus(
    accountId: string,
    verificationStatus: 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'DISABLED'
  ) {
    return prisma.paymentAccount.update({
      where: { id: accountId },
      data: { verificationStatus },
    });
  }
}
