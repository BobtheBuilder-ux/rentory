import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase-admin'; // Import auth and db from firebase-admin

export async function GET(request) {
  try {
    const sessionCookie = request.cookies.get('__session')?.value || '';

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true); // Check for revoked tokens

    // Fetch user profile from Firestore
    const profileRef = db.collection('profiles').doc(decodedClaims.uid);
    const profileSnap = await profileRef.get();

    if (!profileSnap.exists) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    const profileData = profileSnap.data();

    // For admin/agent/landlord roles, check if the user's UID exists in the respective collections
    // This assumes admin_users, agents, landlords are collections where user UIDs are document IDs
    // Or, if they are arrays of UIDs within the profile, the logic needs to be adjusted.
    // Based on app/auth/login/page.jsx, it expects admin_users and agents to be arrays.
    // Let's assume for now that these are fields in the user's profile document.

    // If profileData contains specific role arrays (e.g., admin_users, agents)
    // and user_type, we can return them directly.
    // The login page expects `admin_users` and `agents` to be arrays, and `user_type` string.
    // If these are not directly in the profile, they need to be fetched or derived.
    // For simplicity, let's assume they are part of the profile data.

    return NextResponse.json(profileData);

  } catch (error) {
    console.error('API Error:', error);
    // Handle specific Firebase Admin errors if needed
    if (error.code === 'auth/session-cookie-expired') {
      return NextResponse.json(
        { error: 'Session expired', code: 'auth/session-cookie-expired' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
