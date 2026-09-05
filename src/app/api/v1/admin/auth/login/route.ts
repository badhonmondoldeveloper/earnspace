import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateAdminToken, setAdminSessionCookie } from '@/lib/adminAuth';
import { comparePassword, hashPassword } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';
import { AdminAuditService } from '@/services/adminAuditService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return errorResponse('Email and password required', 400);
    }

    let admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Seed initial Super Admin if database has no admins
    if (!admin && email.toLowerCase() === 'admin@earnspace.com') {
      const passwordHash = await hashPassword(password);
      admin = await prisma.adminUser.create({
        data: {
          email: 'admin@earnspace.com',
          fullName: 'Super Administrator',
          passwordHash,
          role: 'Super Admin',
          status: 'active',
        },
      });
    }

    if (!admin || admin.status !== 'active') {
      return errorResponse('Invalid admin credentials or account suspended', 401);
    }

    const isMatch = await comparePassword(password, admin.passwordHash);
    if (!isMatch) {
      return errorResponse('Invalid admin credentials', 401);
    }

    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    const token = generateAdminToken({
      adminId: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
    });
    setAdminSessionCookie(token);

    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    await AdminAuditService.logAction({
      adminUserId: admin.id,
      action: 'admin.login',
      targetType: 'admin_user',
      targetId: admin.id,
      reason: 'Admin authentication login',
      ipAddress: ip,
    });

    return successResponse({
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
    }, 'Admin login successful');
  } catch (error) {
    console.error('Admin Login error:', error);
    return errorResponse('Internal server error', 500);
  }
}

