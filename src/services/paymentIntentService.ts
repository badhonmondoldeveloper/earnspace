import { prisma } from '@/lib/prisma';

export interface CreatePaymentIntentInput {
  userId: string;
  amount: number;
  currency?: string;
  paymentAccountId?: string;
  description?: string;
  expiresInMinutes?: number;
}

export class PaymentIntentService {
  /**
   * Generates a unique readable reference code e.g. ES-P8K29
   */
  static generateReferenceCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'ES-P';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Creates a new PaymentIntent for receiving funds
   */
  static async createIntent(input: CreatePaymentIntentInput) {
    const { userId, amount, currency = 'BDT', paymentAccountId, description, expiresInMinutes = 30 } = input;

    if (amount <= 0) {
      throw new Error('Payment intent amount must be positive');
    }

    let reference = this.generateReferenceCode();
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const existing = await prisma.paymentIntent.findUnique({
        where: { reference },
      });
      if (!existing) {
        isUnique = true;
      } else {
        reference = this.generateReferenceCode();
        attempts++;
      }
    }

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiresInMinutes);

    return prisma.paymentIntent.create({
      data: {
        userId,
        amount,
        currency,
        paymentAccountId,
        reference,
        description,
        status: 'PENDING',
        expiresAt,
      },
      include: {
        paymentAccount: true,
      },
    });
  }

  /**
   * Fetches payment intent by reference code or ID
   */
  static async getIntentByReference(reference: string) {
    return prisma.paymentIntent.findUnique({
      where: { reference },
      include: {
        paymentAccount: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  /**
   * Updates payment intent status
   */
  static async updateStatus(intentId: string, status: 'PENDING' | 'MATCHED' | 'EXPIRED' | 'CANCELLED' | 'COMPLETED', tx?: any) {
    const db = tx || prisma;
    return db.paymentIntent.update({
      where: { id: intentId },
      data: { status },
    });
  }
}
