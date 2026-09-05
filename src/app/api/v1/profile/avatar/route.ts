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

    const { avatarUrl } = await req.json();
    if (!avatarUrl || typeof avatarUrl !== 'string') {
      return errorResponse('Valid avatar URL is required', 400);
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: session.userId },
      data: { avatar: avatarUrl },
    });

    return successResponse(updatedProfile, 'Avatar updated successfully');
  } catch (error) {
    console.error('Update avatar error:', error);
    return errorResponse('Internal server error', 500);
  }
}
