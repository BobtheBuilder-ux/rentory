import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function POST(request) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token is missing' }, { status: 400 });
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      return NextResponse.json({ error: 'Invalid or expired access token' }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Error verifying session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
