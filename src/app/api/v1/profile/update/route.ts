import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await req.json();
    const { fullName, bio, location, website, category, pronouns, socialLinks } = body;

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: session.userId },
      create: {
        userId: session.userId,
        fullName: fullName || session.username,
        bio: bio || null,
        location: location || null,
        website: website || null,
        category: category || 'General',
        pronouns: pronouns || null,
        socialLinks: typeof socialLinks === 'string' ? socialLinks : JSON.stringify(socialLinks || {}),
      },
      update: {
        ...(fullName && { fullName }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(website !== undefined && { website }),
        ...(category !== undefined && { category }),
        ...(pronouns !== undefined && { pronouns }),
        ...(socialLinks !== undefined && {
          socialLinks: typeof socialLinks === 'string' ? socialLinks : JSON.stringify(socialLinks || {}),
        }),
      },
    });

    return successResponse(updatedProfile, 'Profile updated successfully');
  } catch (error) {
    console.error('Profile update error:', error);
    return errorResponse('Failed to update profile', 500);
  }
}

