import { NextRequest } from 'next/server';
import { clearSessionCookie, deleteCurrentSession } from '@/lib/auth';
import { successResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    await deleteCurrentSession();
    clearSessionCookie();
    return successResponse(null, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    clearSessionCookie();
    return successResponse(null, 'Logged out successfully');
  }
}

