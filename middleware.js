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
          res.cookies.set(name, value, options)
        },
        remove(name, options) {
          res.cookies.delete(name, options)
        },
      },
    }
  )
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', session.user.id)
      .single()
    if (profile?.user_type !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith('/agent')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', session.user.id)
      .single()
    if (profile?.user_type !== 'agent') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith('/landlord')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', session.user.id)
      .single()
    if (profile?.user_type !== 'landlord') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/agent/:path*', '/landlord/:path*'],
}
