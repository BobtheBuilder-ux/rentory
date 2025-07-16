import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token is missing' }, { status: 400 });
    }

    // Set session expiration to 5 days. The maximum duration for a session cookie is 2 weeks.
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    // Create the session cookie. This will also verify the ID token in the process.
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    // Define cookie options
    const options = {
      name: '__session',
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      path: '/',
      sameSite: 'lax', // Or 'strict' depending on your needs
    };

    const response = NextResponse.json({ success: true });
    response.cookies.set(options);
    return response;

  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Failed to create session cookie' }, { status: 500 });
  }
}
