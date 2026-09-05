import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = [
  '/dashboard',
  '/settings',
  '/creator',
  '/wallet',
  '/messages',
  '/notifications',
  '/withdrawals',
  '/referrals',
  '/support',
  '/onboarding',
];

const adminPublicPaths = ['/admin/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('earnspace_session')?.value;
  const adminToken = request.cookies.get('earnspace_admin_session')?.value;

  // Protect admin routes
  if (pathname.startsWith('/admin') && !adminPublicPaths.includes(pathname)) {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect authenticated routes
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (isProtected && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|robots.txt|sitemap.xml|api).*)',
  ],
};
