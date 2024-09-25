import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;

  // Redirect authenticated users away from auth pages
  if (token && (
    url.pathname === '/' ||
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify")
  )) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users trying to access protected routes
  else if (!token && (
    url.pathname === '/' || 
    url.pathname.startsWith("/dashboard")
  )) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  return NextResponse.next(); // Continue with the request
}

// Update config to match the root path and relevant routes
export const config = {
  matcher: [
    '/',
    '/sign-in',
    '/sign-up',
    '/dashboard/:path*',
  ]
};
