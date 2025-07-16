import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // First, sign in the user to verify their password
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error('Supabase Sign In Error:', signInError);
      return NextResponse.json({ error: signInError.message || 'Invalid credentials' }, { status: 401 });
    }

    if (!signInData.user) {
        return NextResponse.json({ error: 'User not found after sign in' }, { status: 401 });
    }

    // Then, check if the user is an admin in the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_type, is_super_admin')
      .eq('id', signInData.user.id)
      .single();

    if (profileError) {
      console.error('Profile Fetch Error:', profileError);
      await supabase.auth.signOut(); // Sign out if profile fetch fails
      return NextResponse.json({ error: profileError.message || 'Failed to retrieve user profile.' }, { status: 500 });
    }

    if (!profile || (profile.user_type !== 'admin' && !profile.is_super_admin)) {
      // Sign out the user if they are not an admin or super admin
      await supabase.auth.signOut();
      return NextResponse.json({ error: 'Access denied. Not an admin.' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Admin login successful', user: signInData.user, session: signInData.session });

  } catch (error) {
    console.error('Admin Login API Catch Error:', error);
    return NextResponse.json({ error: 'An unexpected internal server error occurred during admin login.' }, { status: 500 });
  }
}
