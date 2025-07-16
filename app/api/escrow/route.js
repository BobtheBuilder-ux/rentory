import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase'; // Assuming you have a Supabase client setup

export async function POST(request) {
  const supabase = createClient();
  try {
    const { amount, senderId, receiverId, propertyId, purpose } = await request.json();

    const { data: newEscrow, error: insertError } = await supabase
      .from('escrow_transactions') // Assuming an 'escrow_transactions' table exists
      .insert([
        {
          amount,
          sender_id: senderId,
          receiver_id: receiverId,
          property_id: propertyId,
          purpose,
          status: 'held',
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({ status: 'error', message: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', message: 'Escrow created successfully', data: newEscrow });
  } catch (error) {
    console.error('Escrow creation error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const supabase = createClient();
  try {
    const { escrowId, action } = await request.json(); // action: 'release' or 'refund'

    let updatedStatus = '';
    let message = '';

    if (action === 'release') {
      updatedStatus = 'released';
      message = 'Escrow funds released successfully';
    } else if (action === 'refund') {
      updatedStatus = 'refunded';
      message = 'Escrow funds refunded successfully';
    } else {
      return NextResponse.json({ status: 'error', message: 'Invalid escrow action' }, { status: 400 });
    }

    const { data: updatedEscrow, error: updateError } = await supabase
      .from('escrow_transactions')
      .update({ status: updatedStatus, updated_at: new Date().toISOString() })
      .eq('id', escrowId)
      .select()
      .single();

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return NextResponse.json({ status: 'error', message: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', message, data: updatedEscrow });
  } catch (error) {
    console.error('Escrow update error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  const supabase = createClient();
  try {
    const { searchParams } = new URL(request.url);
    const escrowId = searchParams.get('escrowId');
    const propertyId = searchParams.get('propertyId');

    let query = supabase.from('escrow_transactions').select('*');

    if (escrowId) {
      query = query.eq('id', escrowId);
    }
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    const { data: escrows, error: fetchError } = await query;

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError);
      return NextResponse.json({ status: 'error', message: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({ status: 'success', data: escrows });
  } catch (error) {
    console.error('Escrow retrieval error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
