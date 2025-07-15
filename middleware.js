import { NextResponse } from 'next/server'
import { auth } from '@/lib/firebase-admin'

export async function middleware(req) {
  const token = req.cookies.get('__session')?.value || ''
  let user = null

  try {
    if (token) {
      const decodedToken = await auth.verifyIdToken(token)
      user = await auth.getUser(decodedToken.uid)
    }
  } catch (error) {
    console.error('Auth error:', error)
  }

  // Handle protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    // Check admin role in Firestore
    const userDoc = await db.collection('profiles').doc(user.uid).get()
    if (!userDoc.exists || userDoc.data().user_type !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith('/agent')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    const userDoc = await db.collection('profiles').doc(user.uid).get()
    if (!userDoc.exists || userDoc.data().user_type !== 'agent') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith('/landlord')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    const userDoc = await db.collection('profiles').doc(user.uid).get()
    if (!userDoc.exists || userDoc.data().user_type !== 'landlord') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/agent/:path*',
    '/landlord/:path*',
  ],
}
