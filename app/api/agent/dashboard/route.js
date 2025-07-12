import { NextResponse } from 'next/server';
import { agentDb } from '@/lib/admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');

    const { data, error } = await agentDb.getDashboard(agentId);

    if (error) {
      console.error('Error fetching agent dashboard:', error);
      return NextResponse.json(
        { error: 'Failed to fetch agent dashboard' },
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