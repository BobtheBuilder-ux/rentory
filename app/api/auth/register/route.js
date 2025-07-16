import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName, userType, phone } = body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !userType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate user type
    if (!['renter', 'landlord', 'agent'].includes(userType)) {
      return NextResponse.json(
        { error: 'Invalid user type' },
        { status: 400 }
      );
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      phoneNumber: phone,
    });

    await auth.setCustomUserClaims(userRecord.uid, { role: userType });

    await db.collection('profiles').doc(userRecord.uid).set({
      first_name: firstName,
      last_name: lastName,
      user_type: userType,
      phone: phone || null,
      email: email,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      message: 'Registration successful.',
      user: userRecord,
    }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    // Firebase Auth errors can be more specific
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'Email already registered. Please use a different email or log in.' },
        { status: 409 }
      );
    } else if (error.code === 'auth/invalid-password') {
      return NextResponse.json(
        { error: 'Password is too weak. Please use a stronger password.' },
        { status: 400 }
      );
    } else if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { error: 'Invalid email address format.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
