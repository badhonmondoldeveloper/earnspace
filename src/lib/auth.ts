import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { UserSessionPayload } from '@/types';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_NAME = 'earnspace_session';

function getJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return JWT_SECRET;
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: UserSessionPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSessionPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<UserSessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload?.sessionId) return null;

  const storedSession = await prisma.userSession.findFirst({
    where: {
      id: payload.sessionId,
      userId: payload.userId,
      token: hashToken(token),
      expiresAt: { gt: new Date() },
      user: { status: 'active' },
    },
  });

  return storedSession ? payload : null;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      accountType: true,
      isEmailVerified: true,
      profile: { select: { fullName: true, avatar: true, category: true } },
    },
  });
}

export async function createUserSession(
  payload: Omit<UserSessionPayload, 'sessionId'>,
  metadata: { ipAddress?: string; userAgent?: string } = {}
): Promise<string> {
  const sessionId = crypto.randomUUID();
  const token = generateToken({ ...payload, sessionId });

  await prisma.userSession.create({
    data: {
      id: sessionId,
      userId: payload.userId,
      token: hashToken(token),
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return token;
}

export async function deleteCurrentSession(): Promise<void> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (token) {
    await prisma.userSession.deleteMany({ where: { token: hashToken(token) } });
  }
}

export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export const RESERVED_USERNAMES = [
  'admin', 'administrator', 'earnspace', 'support', 'help', 'api', 'dashboard',
  'settings', 'explore', 'stories', 'blog', 'blogging', 'privacy', 'terms', 'auth',
  'login', 'register', 'messages', 'notifications', 'creator', 'pricing', 'features',
  'search', 'about', 'contact', 'faq', 'community-guidelines', 'root', 'user', 'official'
];

