import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { RESERVED_USERNAMES } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = (searchParams.get('username') || '').toLowerCase().trim();

    if (!username) {
      return errorResponse('Username parameter is required', 400);
    }

    if (username.length < 3) {
      return successResponse({ available: false, reason: 'Username must be at least 3 characters long' });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return successResponse({ available: false, reason: 'Username can only contain letters, numbers, and underscores' });
    }

    if (RESERVED_USERNAMES.includes(username)) {
      return successResponse({ available: false, reason: 'This username is reserved by the platform' });
    }

    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return successResponse({ available: false, reason: 'This username is already taken' });
    }

    return successResponse({ available: true, username });
  } catch (error: any) {
    console.error('Check username error:', error);
    return errorResponse('Failed to check username availability', 500);
  }
}
