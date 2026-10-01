import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer, isSupabaseServerConfigured } from '@/lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { generateTrackingCode } from '@/lib/tracking';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order } = body;

    if (!order || !order.customer_name || !order.phone) {
      return NextResponse.json(
        { error: 'Missing required order fields (customer_name, phone, delivery address)' },
        { status: 400 }
      );
    }

    // Ensure clean unguessable tracking code / order_number
    let trackingCode = order.tracking_code || order.order_number;
    if (!trackingCode || trackingCode.startsWith('order-') || trackingCode.length < 8) {
      trackingCode = generateTrackingCode();
    }

    const orderNumber = trackingCode;
    const nowIso = new Date().toISOString();

    const orderPayload: Record<string, any> = {
      order_number: orderNumber,
      customer_name: order.customer_name.trim(),
      phone: order.phone.trim(),
      email: order.email?.trim() || null,
      full_address: order.full_address.trim(),
      house_building: order.house_building || null,
      road_area_colony: order.road_area_colony || null,
      city: order.city || 'Ghaziabad',
      state: order.state || 'Uttar Pradesh',
      pincode: order.pincode || '201012',
      delivery_date: order.delivery_date || null,
      delivery_time: order.delivery_time || 'Standard (45-60 mins)',
      items: order.items || [],
      extras: order.extras || [],
      complimentary_items: order.complimentary_items || [],
      subtotal: Number(order.subtotal) || 0,
      delivery_charge: Number(order.delivery_charge) || 0,
      discount: Number(order.discount) || 0,
      total: Number(order.total) || 0,
      order_status: order.order_status || 'pending',
      payment_method: order.payment_method || 'Cash on Delivery',
      payment_status: order.payment_status || 'pending',
      customer_notes: order.customer_notes || null,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const client = isSupabaseServerConfigured() ? supabaseServer : supabase;

    if (!isSupabaseServerConfigured() && !isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        order: { ...orderPayload, id: `local-${Date.now()}` },
        tracking_code: orderNumber,
        warning: 'Supabase offline; stored locally',
      });
    }

    const { data: orderData, error: orderError } = await client
      .from('orders')
      .insert([orderPayload])
      .select()
      .single();

    if (orderError) {
      console.error('[API Orders] Error inserting order in Supabase:', orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      order: {
        ...orderData,
        tracking_code: orderData.order_number,
      },
      tracking_code: orderData.order_number,
    });
  } catch (err: any) {
    console.error('[API Orders] Server exception:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
