import { prisma } from '@/lib/prisma';

export interface CreatePaymentAccountInput {
  userId?: string;
  provider: string; // BKASH, NAGAD, ROCKET, UPAY, BANK, CRYPTO
  accountType?: string; // PERSONAL, MERCHANT, AGENT
  phoneNumber: string;
  displayName?: string;
  instructions?: string;
  verificationStatus?: string;
  status?: string;
  isDefault?: boolean;
}

export interface UpdatePaymentAccountInput {
  provider?: string;
  accountType?: string;
  phoneNumber?: string;
  displayName?: string;
  instructions?: string;
  verificationStatus?: string;
  status?: string;
  isDefault?: boolean;
}

export class PaymentAccountService {
  /**
   * List all payment accounts for admin desk
   */
  static async listAllAccounts() {
    return prisma.paymentAccount.findMany({
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      include: {
        user: { select: { id: true, username: true, email: true } },
      },
    });
  }

  /**
   * List user's payment accounts
   */
  static async getUserAccounts(userId: string) {
    return prisma.paymentAccount.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get active payment numbers for public checkout forms & manual payment submissions
   */
  static async getActiveAccounts() {
    return prisma.paymentAccount.findMany({
      where: {
        status: 'active',
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Create new payment collection number/account (alias for addAccount)
   */
  static async addAccount(input: CreatePaymentAccountInput) {
    return this.createAccount(input);
  }

  /**
   * Create new payment collection number/account
   */
  static async createAccount(input: CreatePaymentAccountInput) {
    const {
      userId,
      provider,
      accountType = 'PERSONAL',
      phoneNumber,
      displayName,
      instructions,
      verificationStatus = 'VERIFIED',
      status = 'active',
    } = input;

    // Get admin user ID if not provided
    let targetUserId = userId;
    if (!targetUserId) {
      const adminUser = await prisma.user.findFirst();
      targetUserId = adminUser ? adminUser.id : 'system-admin';
    }

    return prisma.paymentAccount.create({
      data: {
        userId: targetUserId,
        provider: provider.toUpperCase(),
        accountType,
        phoneNumber,
        displayName: displayName || `Official ${provider} Account`,
        verificationStatus,
        status,
      },
    });
  }

  /**
   * Update payment account details
   */
  static async updateAccount(id: string, input: UpdatePaymentAccountInput) {
    return prisma.paymentAccount.update({
      where: { id },
      data: {
        ...(input.provider ? { provider: input.provider.toUpperCase() } : {}),
        ...(input.accountType ? { accountType: input.accountType } : {}),
        ...(input.phoneNumber ? { phoneNumber: input.phoneNumber } : {}),
        ...(input.displayName !== undefined ? { displayName: input.displayName } : {}),
        ...(input.verificationStatus ? { verificationStatus: input.verificationStatus } : {}),
        ...(input.status ? { status: input.status } : {}),
      },
    });
  }

  /**
   * Toggle account On/Off status (active <-> inactive)
   */
  static async toggleAccountStatus(id: string) {
    const account = await prisma.paymentAccount.findUnique({ where: { id } });
    if (!account) throw new Error('Payment Account not found');
    const newStatus = account.status === 'active' ? 'inactive' : 'active';
    return prisma.paymentAccount.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  /**
   * Delete payment account number
   */
  static async deleteAccount(id: string) {
    return prisma.paymentAccount.delete({
      where: { id },
    });
  }
}
