import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';
import { validatePayoutDestination } from '@/services/payoutService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const methods = await prisma.withdrawalMethod.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    });

    // Mask sensitive details in client response
    const maskedMethods = methods.map((m) => {
      let masked = m.accountIdentifier;
      if (m.accountIdentifier.length > 6) {
        masked = `${m.accountIdentifier.slice(0, 2)}******${m.accountIdentifier.slice(-3)}`;
      }
      return {
        ...m,
        accountIdentifierMasked: masked,
      };
    });

    return successResponse(maskedMethods);
  } catch (error) {
    console.error('Fetch payout methods error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { provider, accountIdentifier, accountName, metadata } = body;

    if (!provider || !accountIdentifier) {
      return errorResponse('Provider and account identifier are required', 400);
    }

    const validation = validatePayoutDestination(provider, accountIdentifier, metadata);
    if (!validation.valid) {
      return errorResponse(validation.message || 'Invalid payout destination', 400);
    }

    const method = await prisma.withdrawalMethod.create({
      data: {
        userId: session.userId,
        provider,
        accountIdentifier,
        accountName,
        verificationStatus: 'verified',
      },
    });

    return successResponse(method, 'Payout method added successfully', 201);
  } catch (error) {
    console.error('Add payout method error:', error);
    return errorResponse('Internal server error', 500);
  }
}

