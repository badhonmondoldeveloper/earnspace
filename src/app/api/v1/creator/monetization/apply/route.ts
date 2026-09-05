import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { applyForProgram } from '@/services/monetizationProgramService';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const { programId } = await req.json();
    if (!programId) {
      return errorResponse('Program ID is required', 400);
    }

    const application = await applyForProgram(session.userId, programId);
    return successResponse(application, 'Application submitted successfully', 201);
  } catch (error: any) {
    console.error('Monetization apply error:', error);
    return errorResponse(error.message || 'Internal server error', 400);
  }
}

