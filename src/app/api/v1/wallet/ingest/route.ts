import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';
import { DeviceAuthService } from '@/services/deviceAuthService';
import { BkashAdapter } from '@/services/providerAdapters/BkashAdapter';
import { NagadAdapter } from '@/services/providerAdapters/NagadAdapter';
import { RocketAdapter } from '@/services/providerAdapters/RocketAdapter';
import { UpayAdapter } from '@/services/providerAdapters/UpayAdapter';
import { TransactionMatchingEngine } from '@/services/transactionMatchingEngine';
import { PaymentRiskEngine } from '@/services/paymentRiskEngine';
import { PaymentStateEngine } from '@/services/paymentStateEngine';

export async function POST(req: NextRequest) {
  try {
    const deviceId = req.headers.get('x-device-id');
    const signature = req.headers.get('x-device-signature');
    const nonce = req.headers.get('x-device-nonce');
    const timestampStr = req.headers.get('x-device-timestamp');

    if (!deviceId || !signature || !nonce || !timestampStr) {
      return errorResponse('Missing required device HMAC security headers', 401);
    }

    const timestamp = parseInt(timestampStr);
    const bodyText = await req.text();

    // 1. HMAC Signature & Freshness & Device Verification
    const authResult = await DeviceAuthService.verifyDeviceRequest({
      deviceId,
      payload: bodyText,
      signature,
      nonce,
      timestamp,
    });

    if (!authResult.valid) {
      return errorResponse(authResult.reason || 'Device authentication failed', 403);
    }

    const device = authResult.device;
    const body = JSON.parse(bodyText);
    const { provider, smsText, rawSender } = body;

    if (!provider || !smsText) {
      return errorResponse('Provider and smsText are required', 400);
    }

    // 2. Select Provider Adapter & Parse SMS
    let parsedData = null;
    const provUpper = provider.toUpperCase();

    if (provUpper === 'BKASH') {
      parsedData = BkashAdapter.parseSMS(smsText);
    } else if (provUpper === 'NAGAD') {
      parsedData = NagadAdapter.parseSMS(smsText);
    } else if (provUpper === 'ROCKET') {
      parsedData = RocketAdapter.parseSMS(smsText);
    } else if (provUpper === 'UPAY') {
      parsedData = UpayAdapter.parseSMS(smsText);
    } else {
      parsedData = BkashAdapter.parseSMS(smsText); // fallback
    }

    if (!parsedData.parsedSuccessfully || !parsedData.transactionId) {
      return errorResponse('Failed to parse valid transaction ID or amount from SMS', 422);
    }

    // 3. Double-Spend Check: Mandatory unique constraint (provider, transactionId)
    const existingTx = await prisma.paymentTransaction.findUnique({
      where: {
        provider_transactionId: {
          provider: parsedData.provider,
          transactionId: parsedData.transactionId,
        },
      },
    });

    if (existingTx) {
      return successResponse(
        { transactionId: existingTx.id, status: 'DUPLICATE' },
        'Transaction already detected and recorded (Duplicate prevented)'
      );
    }

    // 4. Execute Transaction Matching Engine
    const matchResult = await TransactionMatchingEngine.matchTransaction({
      userId: device.userId,
      amount: parsedData.amount,
      reference: parsedData.reference,
    });

    // 5. Evaluate Risk Engine
    const riskResult = PaymentRiskEngine.evaluateRisk({
      amount: parsedData.amount,
      referenceMatched: Boolean(matchResult.matchedIntent),
      amountMatched: matchResult.status === 'MATCHED',
      deviceTrusted: true,
      parserConfidence: 0.95,
    });

    // Determine initial state
    let initialState: any = 'DETECTED';
    if (riskResult.riskLevel === 'HIGH' || matchResult.status === 'REVIEW' || matchResult.status === 'AMOUNT_MISMATCH') {
      initialState = 'REVIEW';
    } else if (matchResult.status === 'MATCHED') {
      initialState = 'MATCHED';
    }

    // 6. Create PaymentTransaction record
    const paymentTx = await prisma.paymentTransaction.create({
      data: {
        userId: device.userId,
        deviceId: device.id,
        provider: parsedData.provider,
        transactionId: parsedData.transactionId,
        amount: parsedData.amount,
        senderNumber: parsedData.senderNumber,
        reference: parsedData.reference,
        transactionType: parsedData.transactionType,
        status: initialState,
        matchedPaymentIntentId: matchResult.matchedIntent?.id || null,
        riskScore: riskResult.riskScore,
        rawSmsText: smsText,
      },
    });

    // 7. Advance state machine if matched and low risk
    if (initialState === 'MATCHED' && riskResult.riskLevel !== 'HIGH') {
      await PaymentStateEngine.transitionState(paymentTx.id, 'VERIFYING');
      await PaymentStateEngine.transitionState(paymentTx.id, 'VERIFIED');
      await PaymentStateEngine.transitionState(paymentTx.id, 'AVAILABLE');
    }

    return successResponse(
      {
        id: paymentTx.id,
        transactionId: paymentTx.transactionId,
        status: paymentTx.status,
        matchResult,
        riskResult,
      },
      'Payment transaction ingested and processed successfully',
      201
    );
  } catch (error: any) {
    console.error('POST /api/v1/wallet/ingest error:', error);
    return errorResponse(error.message || 'Payment ingestion failed', 500);
  }
}
