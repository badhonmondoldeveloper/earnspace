import { prisma } from '@/lib/prisma';
import { FinancialLedgerService } from './financialLedgerService';
import { PaymentIntentService } from './paymentIntentService';

export type PaymentState =
  | 'DETECTED'
  | 'PENDING'
  | 'MATCHED'
  | 'VERIFYING'
  | 'VERIFIED'
  | 'AVAILABLE'
  | 'REVIEW'
  | 'REJECTED'
  | 'FAILED'
  | 'REVERSED'
  | 'DUPLICATE';

export class PaymentStateEngine {
  /**
   * Validates if a state transition is permitted by rule
   */
  static isValidTransition(current: PaymentState, target: PaymentState): boolean {
    const allowedTransitions: Record<PaymentState, PaymentState[]> = {
      DETECTED: ['PENDING', 'MATCHED', 'REVIEW', 'DUPLICATE', 'FAILED'],
      PENDING: ['MATCHED', 'REVIEW', 'FAILED'],
      MATCHED: ['VERIFYING', 'REVIEW', 'FAILED'],
      VERIFYING: ['VERIFIED', 'REVIEW', 'REJECTED', 'FAILED'],
      VERIFIED: ['AVAILABLE', 'REVERSED'],
      AVAILABLE: ['REVERSED'],
      REVIEW: ['VERIFYING', 'VERIFIED', 'REJECTED', 'FAILED'],
      REJECTED: [],
      FAILED: [],
      REVERSED: [],
      DUPLICATE: [],
    };

    return allowedTransitions[current]?.includes(target) ?? false;
  }

  /**
   * Transitions a payment transaction through the state machine
   */
  static async transitionState(
    transactionId: string,
    targetState: PaymentState,
    reason?: string
  ) {
    return prisma.$transaction(async (tx) => {
      const paymentTx = await tx.paymentTransaction.findUnique({
        where: { id: transactionId },
      });

      if (!paymentTx) {
        throw new Error(`Payment transaction ${transactionId} not found`);
      }

      const currentState = paymentTx.status as PaymentState;

      if (currentState === targetState) {
        return paymentTx;
      }

      if (!this.isValidTransition(currentState, targetState)) {
        throw new Error(`Illegal state transition from ${currentState} to ${targetState}`);
      }

      // Update state
      const updatedTx = await tx.paymentTransaction.update({
        where: { id: transactionId },
        data: {
          status: targetState,
        },
      });

      // If transition is to AVAILABLE, credit user's available balance via FinancialLedgerService
      if (targetState === 'AVAILABLE' && currentState !== 'AVAILABLE') {
        const wallet = await FinancialLedgerService.getOrCreateWallet(paymentTx.userId, tx);
        
        await tx.wallet.update({
          where: { id: wallet.id },
          data: {
            availableBalance: wallet.availableBalance + paymentTx.amount,
            lifetimeEarned: wallet.lifetimeEarned + paymentTx.amount,
          },
        });

        await FinancialLedgerService.recordTransaction({
          userId: paymentTx.userId,
          type: 'PAYMENT_RECEIVED' as any,
          amount: paymentTx.amount,
          currency: 'BDT',
          referenceType: 'payment_transaction_id',
          referenceId: paymentTx.id,
          idempotencyKey: `pay_credit_${paymentTx.id}`,
          description: `Payment received via ${paymentTx.provider} (${paymentTx.transactionId})`,
        });

        // Mark matched intent as COMPLETED
        if (paymentTx.matchedPaymentIntentId) {
          await PaymentIntentService.updateStatus(paymentTx.matchedPaymentIntentId, 'COMPLETED', tx);
        }
      }

      return updatedTx;
    });
  }
}
