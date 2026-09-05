import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const { coverUrl } = await req.json();
    if (!coverUrl || typeof coverUrl !== 'string') {
      return errorResponse('Valid cover image URL is required', 400);
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: session.userId },
      data: { cover: coverUrl },
    });

    return successResponse(updatedProfile, 'Cover image updated successfully');
  } catch (error) {
    console.error('Update cover error:', error);
    return errorResponse('Internal server error', 500);
  }
}
