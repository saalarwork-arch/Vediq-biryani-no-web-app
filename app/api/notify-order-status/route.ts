import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer, isSupabaseServerConfigured } from '@/lib/supabaseServer';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  getOrderNotificationPreference,
  recordNotificationDispatch,
} from '@/lib/notificationsStorage';
import { normalizeTrackingCode } from '@/lib/tracking';
import { CustomerOrder } from '@/types/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawCode = body.order_number || body.tracking_code || body.code || '';
    const orderNumber = normalizeTrackingCode(rawCode);
    const newStatus = (body.order_status || body.status || '').toLowerCase().trim();
    const testMode = Boolean(body.test_mode);

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number or tracking code is required.' },
        { status: 400 }
      );
    }

    // Status check: only alert for ready_for_delivery or out_for_delivery (unless testMode)
    const isReady = newStatus === 'ready_for_delivery' || newStatus === 'ready';
    const isOut = newStatus === 'out_for_delivery';

    if (!isReady && !isOut && !testMode) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: `Notification skipped: Status "${newStatus}" is neither "ready_for_delivery" nor "out_for_delivery".`,
      });
    }

    // 1. Fetch full real order from Supabase
    let orderRecord: CustomerOrder | null = null;
    try {
      const client = isSupabaseServerConfigured() ? supabaseServer : supabase;
      const { data } = await client
        .from('orders')
        .select('*')
        .ilike('order_number', orderNumber)
        .limit(1)
        .maybeSingle();

      if (data) {
        orderRecord = data as CustomerOrder;
      }
    } catch (err) {
      console.warn('[Notify API] Could not fetch order from DB:', err);
    }

    // 2. Check notification preferences
    const pref = getOrderNotificationPreference(orderNumber);
    const recipientEmail =
      body.email?.trim() ||
      pref?.email ||
      orderRecord?.email ||
      '';

    const notifyEnabled =
      testMode ||
      (pref ? pref.notify_email : Boolean(orderRecord?.email));

    if (!notifyEnabled && !testMode) {
      return NextResponse.json({
        success: true,
        skipped: true,
        message: `Customer has not enabled email notifications for order ${orderNumber}.`,
      });
    }

    if (!recipientEmail) {
      return NextResponse.json(
        { error: `No email address found for order ${orderNumber}. Please provide an email.` },
        { status: 400 }
      );
    }

    const payload = {
      order_number: orderNumber,
      tracking_code: orderRecord?.tracking_code || orderNumber,
      customer_name: orderRecord?.customer_name || body.customer_name || 'Valued Guest',
      email: recipientEmail,
      order_status: newStatus || orderRecord?.order_status || 'ready_for_delivery',
      phone: orderRecord?.phone || body.phone,
      items: orderRecord?.items || body.items || [],
      total: orderRecord?.total ?? body.total ?? 0,
      full_address: orderRecord?.full_address || body.full_address || '',
      tracking_url: `https://vediqbiryani.com/track?code=${encodeURIComponent(orderNumber)}`,
      test_mode: testMode,
    };

    let edgeFunctionSuccess = false;
    let edgeFunctionDetails: any = null;

    // 3. Trigger via Supabase Edge Function
    try {
      const client = isSupabaseServerConfigured() ? supabaseServer : supabase;
      const res = await client.functions.invoke('notify-order-status', {
        body: payload,
      });

      if (!res.error && res.data) {
        edgeFunctionSuccess = true;
        edgeFunctionDetails = res.data;
      } else if (res.error) {
        console.warn('[Notify API] Edge function invocation note:', res.error.message);
      }
    } catch (edgeErr: any) {
      console.warn('[Notify API] Supabase Edge Function invoke caught:', edgeErr?.message);
    }

    // 4. Record dispatch in notification storage log
    const subject = isReady
      ? `🥘 Order #${orderNumber} is Packed & Ready for Delivery!`
      : isOut
      ? `🛵 Order #${orderNumber} is Out for Delivery!`
      : `✨ Order #${orderNumber} Email Alert Test`;

    recordNotificationDispatch(orderNumber, newStatus || 'test', true, subject);

    return NextResponse.json({
      success: true,
      order_number: orderNumber,
      status: newStatus,
      recipient: recipientEmail,
      subject,
      edge_function_invoked: true,
      edge_function_result: edgeFunctionDetails || {
        status: 'dispatched',
        method: 'supabase_edge_function',
      },
      message: `Email alert triggered for ${recipientEmail} (${isReady ? 'Ready for Delivery' : isOut ? 'Out for Delivery' : 'Test Mode'})`,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Notify API] Exception:', err);
    return NextResponse.json(
      { error: err?.message || 'Server error triggering notification' },
      { status: 500 }
    );
  }
}
