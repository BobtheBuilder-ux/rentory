import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await db.getSavedProperties(userId);

    if (error) {
      console.error('Error fetching saved properties:', error);
      return NextResponse.json(
        { error: 'Failed to fetch saved properties' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, property_id } = body;

    if (!user_id || !property_id) {
      return NextResponse.json(
        { error: 'User ID and Property ID are required' },
        { status: 400 }
      );
    }

    const { data, error } = await db.saveProperty(user_id, property_id);

    if (error) {
      console.error('Error saving property:', error);
      return NextResponse.json(
        { error: 'Failed to save property' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}