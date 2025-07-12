import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/admin';

export async function POST(request) {
  try {
    const body = await request.json();
    const { agentId, landlordId, assignmentType, permissions } = body;

    // Validate required fields
    if (!agentId || !landlordId) {
      return NextResponse.json(
        { error: 'Agent ID and Landlord ID are required' },
        { status: 400 }
      );
    }

    const { data, error } = await adminDb.assignAgentToLandlord(
      agentId, 
      landlordId, 
      assignmentType, 
      permissions
    );

    if (error) {
      console.error('Error assigning agent:', error);
      return NextResponse.json(
        { error: 'Failed to assign agent' },
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

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const landlordId = searchParams.get('landlordId');

    if (!agentId || !landlordId) {
      return NextResponse.json(
        { error: 'Agent ID and Landlord ID are required' },
        { status: 400 }
      );
    }

    const { error } = await adminDb.removeAgentAssignment(agentId, landlordId);

    if (error) {
      console.error('Error removing agent assignment:', error);
      return NextResponse.json(
        { error: 'Failed to remove agent assignment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}