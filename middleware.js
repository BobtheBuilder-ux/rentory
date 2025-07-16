import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name, options) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profileData } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user?.id)
    .single();

  const isAdmin = profileData?.user_type === 'admin';

  const { pathname } = req.nextUrl;

  // Allow access to auth pages and API routes
  if (pathname.startsWith('/auth') || pathname.startsWith('/api/auth')) {
    return res;
  }

  // Redirect authenticated non-admin users from admin pages
  if (pathname.startsWith('/admin') && user && !isAdmin) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login'; // Redirect to regular login
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect unauthenticated users from protected pages
  if (!user && !pathname.startsWith('/auth') && !pathname.startsWith('/api')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth/login';
    return NextResponse.redirect(redirectUrl);
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
