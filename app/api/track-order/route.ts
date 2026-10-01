import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer, isSupabaseServerConfigured } from '@/lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { buildOrderTimeline, normalizeTrackingCode } from '@/lib/tracking';
import { CustomerOrder } from '@/types/supabase';
import { getOrderNotificationPreference } from '@/lib/notificationsStorage';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code') || searchParams.get('order_number') || searchParams.get('tracking_code') || '';
  const phone = searchParams.get('phone') || '';

  return handleTracking(code, phone);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const code = body.code || body.order_number || body.tracking_code || '';
    const phone = body.phone || '';

    return handleTracking(code, phone);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Invalid request' },
      { status: 400 }
    );
  }
}

async function handleTracking(rawCode: string, rawPhone: string) {
  const code = normalizeTrackingCode(rawCode);
  const cleanPhone = (rawPhone || '').replace(/\D/g, '');

  if (!code && !cleanPhone) {
    return NextResponse.json(
      { error: 'Tracking code or Order ID is required.' },
      { status: 400 }
    );
  }

  if (!isSupabaseServerConfigured() && !isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database connection is temporarily unavailable.' },
      { status: 503 }
    );
  }

  const client = isSupabaseServerConfigured() ? supabaseServer : supabase;

  try {
    let query = client.from('orders').select('*');

    // UUID detection
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(code);

    if (code) {
      if (isUUID) {
        query = query.or(`order_number.ilike.${code},id.eq.${code}`);
      } else {
        query = query.ilike('order_number', code);
      }
    }

    if (cleanPhone) {
      query = query.ilike('phone', `%${cleanPhone}%`);
    }

    // Always limit to 1 record to never expose unrelated orders
    const { data, error } = await query.order('created_at', { ascending: false }).limit(1).maybeSingle();

    if (error) {
      console.error('[Track Order API] DB Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { error: `No active or past order found matching "${code || cleanPhone}". Please check your tracking code.` },
        { status: 404 }
      );
    }

    const orderRecord = data as CustomerOrder;

    // Attach tracking_code alias for convenience
    if (!orderRecord.tracking_code) {
      orderRecord.tracking_code = orderRecord.order_number;
    }

    // Build timeline using authentic timestamps
    const timeline = buildOrderTimeline(orderRecord);

    // Attach email notification preference
    const notificationPref = getOrderNotificationPreference(orderRecord.order_number);
    const notifyEmail = notificationPref
      ? notificationPref.notify_email
      : Boolean(orderRecord.email);
    const notificationEmail = notificationPref?.email || orderRecord.email || '';

    return NextResponse.json({
      success: true,
      order: {
        ...orderRecord,
        timeline,
        notify_email: notifyEmail,
        notification_email: notificationEmail,
      },
    });
  } catch (err: any) {
    console.error('[Track Order API] Exception:', err);
    return NextResponse.json(
      { error: err?.message || 'Server error tracking order.' },
      { status: 500 }
    );
  }
}
