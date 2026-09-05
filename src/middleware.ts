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

const authPaths = ['/login', '/register'];

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

  // Redirect authenticated users away from auth pages
  const isAuthPage = authPaths.some((p) => pathname === p);
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|robots.txt|sitemap.xml|api).*)',
  ],
};
