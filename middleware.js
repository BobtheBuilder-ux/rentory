import { NextResponse } from 'next/server';

export async function middleware(req) {
  const sessionCookie = req.cookies.get('__session')?.value;
  const currentPath = req.nextUrl.pathname;

  // Define public paths that don't require authentication
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/password-reset-confirm',
    '/auth/reset-password',
    '/auth/verify-email',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/reset-password-request',
    '/api/auth/reset-password',
    '/api/auth/session-login',
    '/api/auth/session-logout',
    '/api/auth/verify-session',
    '/api/auth/profile', // Profile can be accessed to check session status
    '/about',
    '/blog',
    '/contact',
    '/how-it-works',
    '/pricing',
    '/resources',
    '/search',
    '/success-stories',
    '/property/:path*', // Property details can be public
  ];

  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path => {
    if (path.endsWith(':path*')) {
      const base = path.replace(':path*', '');
      return currentPath.startsWith(base);
    }
    return currentPath === path;
  });

  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For protected paths, verify the session cookie
  if (!sessionCookie) {
    // If no session cookie, redirect to login
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try {
    // Call the internal API route to verify the session cookie
    const verifyResponse = await fetch(new URL('/api/auth/verify-session', req.url), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionCookie }),
    });

    if (!verifyResponse.ok) {
      // If verification fails, redirect to login and clear cookie
      const response = NextResponse.redirect(new URL('/auth/login', req.url));
      response.cookies.delete('__session');
      return response;
    }

    // Session is valid, proceed
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware session verification error:', error);
    // On error, redirect to login and clear cookie
    const response = NextResponse.redirect(new URL('/auth/login', req.url));
    response.cookies.delete('__session');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any files in the public folder (e.g., /public/icons)
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)',
  ],
};
