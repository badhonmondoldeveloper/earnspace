import { prisma } from '@/lib/prisma';

export async function checkCreatorEligibility(userId: string, programId: string) {
  const [profile, user, program] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.monetizationProgram.findUnique({ where: { id: programId } }),
  ]);

  if (!profile || !user || !program) {
    return { isEligible: false, missingRequirements: ['Account or program not found'] };
  }

  const rules = JSON.parse(program.eligibilityRulesJson || '{}');
  const missingRequirements: string[] = [];

  const minFollowers = rules.minFollowers || 100;
  if (profile.followersCount < minFollowers) {
    missingRequirements.push(`Requires at least ${minFollowers} followers (current: ${profile.followersCount})`);
  }

  const minViews = rules.minViews || 1000;
  const totalViews = profile.profileViews; // or aggregated views
  if (totalViews < minViews) {
    missingRequirements.push(`Requires at least ${minViews} total views`);
  }

  if (user.status !== 'active') {
    missingRequirements.push('Account must be in active status with no severe policy violations');
  }

  return {
    isEligible: missingRequirements.length === 0,
    missingRequirements,
    currentFollowers: profile.followersCount,
    requiredFollowers: minFollowers,
    currentViews: totalViews,
    requiredViews: minViews,
  };
}

export async function applyForProgram(userId: string, programId: string) {
  const eligibility = await checkCreatorEligibility(userId, programId);
  if (!eligibility.isEligible) {
    throw new Error(`Ineligible for program: ${eligibility.missingRequirements.join(', ')}`);
  }

  return prisma.monetizationApplication.upsert({
    where: { userId_programId: { userId, programId } },
    create: {
      userId,
      programId,
      status: 'pending',
    },
    update: {
      status: 'pending',
      rejectionReason: null,
      appliedAt: new Date(),
    },
  });
}

export async function getActivePrograms() {
  return prisma.monetizationProgram.findMany({
    where: { status: 'active' },
    orderBy: { name: 'asc' },
  });
}

