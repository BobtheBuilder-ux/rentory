import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data: alerts, error } = await supabase
      .from('search_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Error in alerts GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    const {
      user_id,
      name,
      location,
      propertyType,
      min_price,
      max_price,
      bedrooms,
      bathrooms,
      keywords,
      emailNotifications,
      pushNotifications,
      frequency,
      is_active = true
    } = body;

    if (!user_id || !name) {
      return NextResponse.json({ error: 'User ID and name are required' }, { status: 400 });
    }

    const alertData = {
      user_id,
      name,
      location: location || null,
      property_type: propertyType || null,
      min_price: min_price || 0,
      max_price: max_price || 50000000,
      bedrooms: bedrooms || null,
      bathrooms: bathrooms || null,
      keywords: keywords || null,
      email_notifications: emailNotifications !== false,
      push_notifications: pushNotifications !== false,
      frequency: frequency || 'immediate',
      is_active,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: alert, error } = await supabase
      .from('search_alerts')
      .insert([alertData])
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
    }

    return NextResponse.json(alert, { status: 201 });
  } catch (error) {
    console.error('Error in alerts POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
