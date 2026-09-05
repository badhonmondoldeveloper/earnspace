import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'earnspace-admin-super-secret-key-2026';
const ADMIN_TOKEN_NAME = 'earnspace_admin_session';

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  fullName: string;
  role: string;
}

export const ADMIN_ROLE_PERMISSIONS: Record<string, string[]> = {
  'Super Admin': ['*'],
  'Admin': ['users.*', 'content.*', 'finance.view', 'withdrawals.*', 'campaigns.*', 'ads.*', 'settings.*', 'audit_logs.view'],
  'Finance Manager': ['finance.*', 'withdrawals.*', 'wallets.*', 'earnings.*', 'audit_logs.view'],
  'Moderator': ['content.*', 'reports.*', 'users.view', 'users.suspend'],
  'Support Agent': ['users.view', 'content.view', 'reports.view'],
  'Ad Manager': ['ads.*', 'advertisers.*', 'campaigns.*'],
  'Content Manager': ['content.*', 'blogs.*', 'stories.*'],
  'Analytics Manager': ['analytics.*', 'finance.view'],
};

export function generateAdminToken(payload: AdminSessionPayload): string {
  return jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: '1d' });
}

export function verifyAdminToken(token: string): AdminSessionPayload | null {
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET) as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export function setAdminSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(ADMIN_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });
}

export function clearAdminSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(ADMIN_TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

export function hasAdminPermission(role: string, requiredPermission: string): boolean {
  if (!role) return false;
  
  // Normalize role string key (e.g. 'super_admin' -> 'Super Admin')
  let roleKey = role;
  if (role === 'super_admin' || role === 'superadmin') roleKey = 'Super Admin';
  else if (role === 'admin') roleKey = 'Admin';
  else if (role === 'finance_admin' || role === 'finance_manager') roleKey = 'Finance Manager';
  else if (role === 'moderator') roleKey = 'Moderator';
  else if (role === 'support_agent' || role === 'support') roleKey = 'Support Agent';
  else if (role === 'ad_manager') roleKey = 'Ad Manager';
  else if (role === 'content_manager') roleKey = 'Content Manager';
  else if (role === 'analytics_manager') roleKey = 'Analytics Manager';

  const permissions = ADMIN_ROLE_PERMISSIONS[roleKey] || ADMIN_ROLE_PERMISSIONS[role] || [];
  if (permissions.includes('*')) return true;

  const [domain] = requiredPermission.split('.');
  if (permissions.includes(`${domain}.*`)) return true;

  return permissions.includes(requiredPermission);
}

