import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const { sessionCookie } = await request.json();

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Session cookie is missing' }, { status: 400 });
    }

    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true); // Check for revoked tokens
    return NextResponse.json({ user: decodedClaims }, { status: 200 });

  } catch (error) {
    console.error('Error verifying session cookie:', error);
    return NextResponse.json({ error: 'Invalid or expired session cookie' }, { status: 401 });
  }
}
