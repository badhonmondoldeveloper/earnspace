import { NextRequest } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';
import { successResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  clearSessionCookie();
  return successResponse(null, 'Logged out successfully');
}

