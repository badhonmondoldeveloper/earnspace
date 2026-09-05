import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { UserSessionPayload } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'earnspace-fallback-secret-2026';
const TOKEN_NAME = 'earnspace_session';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: UserSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getSession(): Promise<UserSessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
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
  'login', 'register', 'messages', 'notifications', 'root', 'user', 'official'
];

