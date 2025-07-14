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
      return NextResponse.json({ error: signInError.message }, { status: 401 });
    }

    if (!signInData.user) {
        return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Then, check if the user is an admin
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', signInData.user.id)
      .single();

    if (adminError || !adminUser) {
      // Sign out the user if they are not an admin to prevent a regular user session
      await supabase.auth.signOut();
      return NextResponse.json({ error: 'Access denied. Not an admin.' }, { status: 403 });
    }

    return NextResponse.json({ message: 'Admin login successful', user: signInData.user });

  } catch (error) {
    console.error('Admin Login API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
