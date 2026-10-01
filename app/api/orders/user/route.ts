import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer, isSupabaseServerConfigured } from '@/lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { CustomerOrder } from '@/types/supabase';
import { buildOrderTimeline } from '@/lib/tracking';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  return handleFetchUserOrders(email, phone, token);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email || '';
    const phone = body.phone || '';
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || body.token;

    return handleFetchUserOrders(email, phone, token);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Invalid request' },
      { status: 400 }
    );
  }
}

async function handleFetchUserOrders(rawEmail: string, rawPhone: string, token?: string) {
  let email = rawEmail.trim().toLowerCase();
  let phone = rawPhone.replace(/\D/g, '');

  const client = isSupabaseServerConfigured() ? supabaseServer : supabase;

  // If a JWT token was provided, verify with Supabase Auth
  if (token) {
    try {
      const { data: { user }, error: authErr } = await client.auth.getUser(token);
      if (user && !authErr) {
        if (!email && user.email) {
          email = user.email.toLowerCase();
        }
        if (!phone && user.phone) {
          phone = user.phone.replace(/\D/g, '');
        }
      }
    } catch (e) {
      console.warn('[User Orders API] Auth token check:', e);
    }
  }

  if (!email && !phone) {
    return NextResponse.json(
      { error: 'Email or phone number is required to view order history.' },
      { status: 400 }
    );
  }

  if (!isSupabaseServerConfigured() && !isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database is temporarily unavailable' },
      { status: 503 }
    );
  }

  try {
    let query = client.from('orders').select('*');

    if (email && phone) {
      query = query.or(`email.ilike.${email},phone.ilike.%${phone}%`);
    } else if (email) {
      query = query.ilike('email', email);
    } else if (phone) {
      query = query.ilike('phone', `%${phone}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('[User Orders API] DB query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const orders = (data || []).map((ord: CustomerOrder) => ({
      ...ord,
      tracking_code: ord.tracking_code || ord.order_number,
      timeline: buildOrderTimeline(ord),
    }));

    return NextResponse.json({
      success: true,
      orders,
      count: orders.length,
    });
  } catch (err: any) {
    console.error('[User Orders API] Server error:', err);
    return NextResponse.json(
      { error: err?.message || 'Server error fetching order history' },
      { status: 500 }
    );
  }
}
