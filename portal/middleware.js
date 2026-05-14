import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'codtechintern-secret-key-2024';
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('session')?.value;

  // Paths that require authentication
  const protectedPaths = ['/dashboard', '/admin', '/resume'];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    if (!session) {
      // Redirect to login with a clear reason
      return NextResponse.redirect(new URL('/login?error=session_expired', request.url));
    }

    try {
      // Verify token is still valid
      await jwtVerify(session, key);
      return NextResponse.next();
    } catch (err) {
      // Token expired or invalid
      const response = NextResponse.redirect(new URL('/login?error=session_expired', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/resume/:path*'],
};
