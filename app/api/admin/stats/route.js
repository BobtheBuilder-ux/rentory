import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/admin';

export async function GET(request) {
  try {
    const { data, error } = await adminDb.getAdminStats();

    if (error) {
      console.error('Error fetching admin stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch admin stats' },
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