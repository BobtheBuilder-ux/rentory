import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = params;
    const body = await request.json();

    const updateData = {
      updated_at: new Date().toISOString()
    };

    // Handle different update scenarios
    if (body.hasOwnProperty('is_active')) {
      updateData.is_active = body.is_active;
    } else {
      // Full update
      const {
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
        frequency
      } = body;

      updateData.name = name;
      updateData.location = location || null;
      updateData.property_type = propertyType || null;
      updateData.min_price = min_price || 0;
      updateData.max_price = max_price || 50000000;
      updateData.bedrooms = bedrooms || null;
      updateData.bathrooms = bathrooms || null;
      updateData.keywords = keywords || null;
      updateData.email_notifications = emailNotifications !== false;
      updateData.push_notifications = pushNotifications !== false;
      updateData.frequency = frequency || 'immediate';
    }

    const { data: alert, error } = await supabase
      .from('search_alerts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating alert:', error);
      return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 });
    }

    return NextResponse.json(alert);
  } catch (error) {
    console.error('Error in alert PUT:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = params;

    const { error } = await supabase
      .from('search_alerts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting alert:', error);
      return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error in alert DELETE:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
