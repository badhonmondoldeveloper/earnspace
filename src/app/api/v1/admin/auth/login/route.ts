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

    const lowerEmail = email.toLowerCase();
    let admin = await prisma.adminUser.findFirst({
      where: { email: lowerEmail },
    });

    // Seed initial Super Admin for requested admin email or default admin
    if (!admin && (lowerEmail === 'badhonmondoldeveloper@gmail.com' || lowerEmail === 'admin@earnspace.com')) {
      const passwordHash = await hashPassword(password);
      admin = await prisma.adminUser.create({
        data: {
          email: lowerEmail,
          fullName: lowerEmail === 'badhonmondoldeveloper@gmail.com' ? 'Badhon Mondol' : 'Super Administrator',
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

    // Non-blocking timestamp update
    prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    }).catch((e) => console.error('Last login timestamp update error:', e));

    const token = generateAdminToken({
      adminId: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
    });
    setAdminSessionCookie(token);

    // Non-blocking Audit Logging
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    AdminAuditService.logAction({
      adminUserId: admin.id,
      action: 'admin.login',
      targetType: 'admin_user',
      targetId: admin.id,
      reason: 'Admin authentication login',
      ipAddress: ip,
    }).catch((e) => console.error('Non-blocking audit log error:', e));

    return successResponse({
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
    }, 'Admin login successful');
  } catch (error: any) {
    console.error('Admin Login error:', error);
    return errorResponse(error?.message || String(error) || 'Internal server error', 500);
  }
}
