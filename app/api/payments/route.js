import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase'; // Assuming you have a Supabase client setup

export async function POST(request) {
  const supabase = createClient();
  try {
    const { amount, email, currency, reference, userId, propertyId, type } = await request.json();

    // Record payment attempt in Supabase
    const { data: paymentRecord, error: insertError } = await supabase
      .from('payments') // Assuming a 'payments' table exists
      .insert([
        {
          user_id: userId,
          property_id: propertyId,
          amount,
          currency,
          reference,
          status: 'pending', // Initial status
          payment_type: type, // e.g., 'rent', 'deposit', 'subscription'
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json({ status: 'error', message: insertError.message }, { status: 500 });
    }

    // Integrate with Paystack or Flutterwave
    // Example for Paystack:
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // amount in kobo
        email,
        currency,
        reference: paymentRecord.reference, // Use the generated reference from Supabase
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify`, // Your verification endpoint
      }),
    });
    const data = await paystackResponse.json();

    if (!paystackResponse.ok || data.status !== true) {
      // Update payment record status to failed if initiation fails
      await supabase
        .from('payments')
        .update({ status: 'failed', gateway_response: data })
        .eq('id', paymentRecord.id);
      return NextResponse.json({ status: 'error', message: data.message || 'Payment initiation failed' }, { status: paystackResponse.status });
    }

    // Update payment record with authorization URL
    await supabase
      .from('payments')
      .update({ authorization_url: data.data.authorization_url, gateway_response: data })
      .eq('id', paymentRecord.id);

    return NextResponse.json({ status: 'success', message: 'Payment initiation successful', data: data.data });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
