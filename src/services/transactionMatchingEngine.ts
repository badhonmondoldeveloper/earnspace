import { prisma } from '@/lib/prisma';
import { ParsedTransaction } from './providerAdapters/BkashAdapter';

export interface MatchResult {
  status: 'MATCHED' | 'AMOUNT_MISMATCH' | 'REVIEW' | 'UNMATCHED';
  matchedIntent?: any;
  reason: string;
}

export class TransactionMatchingEngine {
  /**
   * Matches an incoming transaction against pending payment intents
   */
  static async matchTransaction(txData: {
    userId: string;
    amount: number;
    reference?: string;
    paymentAccountId?: string;
  }): Promise<MatchResult> {
    const { userId, amount, reference, paymentAccountId } = txData;

    // 1. Match by Intent Reference (e.g. ES-P8K29)
    if (reference) {
      const intentByRef = await prisma.paymentIntent.findFirst({
        where: {
          reference,
          status: 'PENDING',
          expiresAt: { gte: new Date() },
        },
        include: { paymentAccount: true },
      });

      if (intentByRef) {
        if (Math.abs(intentByRef.amount - amount) < 0.01) {
          return {
            status: 'MATCHED',
            matchedIntent: intentByRef,
            reason: 'Matched exactly by Payment Intent reference code and amount',
          };
        } else {
          return {
            status: 'AMOUNT_MISMATCH',
            matchedIntent: intentByRef,
            reason: `Reference matched intent ${intentByRef.reference}, but amount mismatched (Expected ৳${intentByRef.amount}, Received ৳${amount})`,
          };
        }
      }
    }

    // 2. Query potential pending intents for this user by account or amount within valid time window
    const candidates = await prisma.paymentIntent.findMany({
      where: {
        userId,
        status: 'PENDING',
        expiresAt: { gte: new Date() },
        ...(paymentAccountId ? { paymentAccountId } : {}),
      },
      include: { paymentAccount: true },
    });

    if (candidates.length === 0) {
      return {
        status: 'UNMATCHED',
        reason: 'No active pending payment intents found matching user or account',
      };
    }

    // Filter by exact amount
    const amountMatches = candidates.filter((c) => Math.abs(c.amount - amount) < 0.01);

    if (amountMatches.length === 1) {
      return {
        status: 'MATCHED',
        matchedIntent: amountMatches[0],
        reason: 'Matched single candidate by account and exact amount within active time window',
      };
    }

    if (amountMatches.length > 1) {
      return {
        status: 'REVIEW',
        reason: `Ambiguous match: Found ${amountMatches.length} pending intents with identical amount ৳${amount}. Manual review required.`,
      };
    }

    return {
      status: 'UNMATCHED',
      reason: 'Transaction does not match any active payment intent parameters',
    };
  }
}
