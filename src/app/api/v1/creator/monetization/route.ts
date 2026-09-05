import { NextRequest } from 'next/server';
export const dynamic = 'force-dynamic';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/response';
import { getActivePrograms, checkCreatorEligibility } from '@/services/monetizationProgramService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const programs = await getActivePrograms();
    const applications = await prisma.monetizationApplication.findMany({
      where: { userId: session.userId },
      include: { program: true },
    });

    const enrolled = await prisma.creatorMonetization.findMany({
      where: { userId: session.userId, status: 'active' },
      include: { program: true },
    });

    // Check eligibility for each program
    const programDetails = await Promise.all(
      programs.map(async (prog) => {
        const eligibility = await checkCreatorEligibility(session.userId, prog.id);
        const app = applications.find((a) => a.programId === prog.id);
        const isEnrolled = enrolled.some((e) => e.programId === prog.id);

        return {
          ...prog,
          eligibility,
          applicationStatus: app ? app.status : 'not_applied',
          rejectionReason: app?.rejectionReason || null,
          isEnrolled,
        };
      })
    );

    return successResponse({
      programs: programDetails,
      totalEnrolled: enrolled.length,
      totalApplications: applications.length,
    });
  } catch (error) {
    console.error('Creator monetization fetch error:', error);
    return errorResponse('Internal server error', 500);
  }
}
