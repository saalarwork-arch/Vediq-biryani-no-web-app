import { NextRequest, NextResponse } from 'next/server';
import {
  getOrderNotificationPreference,
  setOrderNotificationPreference,
} from '@/lib/notificationsStorage';
import { supabaseServer, isSupabaseServerConfigured } from '@/lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { normalizeTrackingCode } from '@/lib/tracking';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawCode =
    searchParams.get('code') ||
    searchParams.get('order_number') ||
    searchParams.get('tracking_code') ||
    '';
  const orderNumber = normalizeTrackingCode(rawCode);

  if (!orderNumber) {
    return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
  }

  const existingPref = getOrderNotificationPreference(orderNumber);

  // If already in storage, return it
  if (existingPref) {
    return NextResponse.json({
      success: true,
      notify_email: existingPref.notify_email,
      email: existingPref.email,
      history: existingPref.history || [],
      updated_at: existingPref.updated_at,
    });
  }

  // Otherwise, inspect DB to see if the order has an email on file
  let dbEmail = '';
  try {
    const client = isSupabaseServerConfigured() ? supabaseServer : supabase;
    const { data } = await client
      .from('orders')
      .select('email, customer_name')
      .ilike('order_number', orderNumber)
      .maybeSingle();

    if (data?.email) {
      dbEmail = data.email;
    }
  } catch {}

  return NextResponse.json({
    success: true,
    notify_email: Boolean(dbEmail), // default to true if order has email
    email: dbEmail,
    history: [],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawCode = body.code || body.order_number || body.tracking_code || '';
    const orderNumber = normalizeTrackingCode(rawCode);
    const notifyEmail = Boolean(body.notify_email);
    const email = (body.email || '').trim();

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
    }

    if (notifyEmail && !email) {
      return NextResponse.json(
        { error: 'A valid email address is required to enable email notifications.' },
        { status: 400 }
      );
    }

    if (notifyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email format (e.g. name@example.com).' },
        { status: 400 }
      );
    }

    // Save in persistent storage
    const record = setOrderNotificationPreference(
      orderNumber,
      notifyEmail,
      email,
      body.customer_name
    );

    // If email is provided, also try updating the order in Supabase
    if (email) {
      try {
        const client = isSupabaseServerConfigured() ? supabaseServer : supabase;
        await client
          .from('orders')
          .update({
            email: email,
            updated_at: new Date().toISOString(),
          })
          .ilike('order_number', orderNumber);
      } catch (dbErr) {
        console.warn('[NotificationPreference] DB update warning:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      order_number: orderNumber,
      notify_email: record.notify_email,
      email: record.email,
      message: notifyEmail
        ? `Email notifications enabled for ${record.email}`
        : 'Email notifications turned off',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to update notification preference' },
      { status: 500 }
    );
  }
}
