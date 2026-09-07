import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { DbInitService } from '@/services/dbInitService';
import { successResponse, errorResponse } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const result = await DbInitService.initializeDatabase();
    return successResponse(result, 'Database successfully initialized and seeded with system defaults!');
  } catch (error: any) {
    console.error('Seed database API error:', error);
    return errorResponse(error.message || 'Failed to seed database', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const result = await DbInitService.initializeDatabase();
    return successResponse(result, 'Database successfully initialized and seeded with system defaults!');
  } catch (error: any) {
    console.error('Seed database API error:', error);
    return errorResponse(error.message || 'Failed to seed database', 500);
  }
}
