import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { targetType, targetId, category, description } = body;

    if (!targetType || !targetId || !category) {
      return errorResponse('Missing report parameters', 400);
    }

    const report = await prisma.report.create({
      data: {
        reporterId: session.userId,
        targetType,
        targetId,
        category,
        description,
      },
    });

    return successResponse(report, 'Report submitted for review', 201);
  } catch (error) {
    return errorResponse('Internal server error', 500);
  }
}

