import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge-safe middleware: no Node-only JWT verification here.
 * Full token verification is done in API/server handlers.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Keep /admin as public login entrypoint.
  if (pathname === '/admin') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
