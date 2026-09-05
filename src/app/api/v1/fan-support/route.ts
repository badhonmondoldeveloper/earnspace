import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { processFanSupport } from '@/services/fanSupportService';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const { creatorId, amount, message } = await req.json();
    if (!creatorId || !amount) {
      return errorResponse('Creator ID and tip amount are required', 400);
    }

    const fanSupport = await processFanSupport({
      senderId: session.userId,
      creatorId,
      grossAmount: parseFloat(amount),
      message,
    });

    return successResponse(fanSupport, 'Fan support tip sent successfully', 201);
  } catch (error: any) {
    console.error('Fan support API error:', error);
    return errorResponse(error.message || 'Internal server error', 400);
  }
}

