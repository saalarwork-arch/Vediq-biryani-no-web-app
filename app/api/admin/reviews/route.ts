import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { supabaseServer } from '@/lib/supabaseServer';
import {
  getAllReviewsForAdmin,
  updateReviewStatus,
  deleteReviewById,
} from '@/lib/reviewsStorage';

export const dynamic = 'force-dynamic';

async function verifyAdminAuth(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return { authorized: false, error: 'Authentication required. Please sign in to the Admin Portal.' };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return { authorized: false, error: 'Invalid or expired admin session. Please log in again.' };
  }

  const isPrimaryAdmin =
    user.id === 'bfd10a7c-d7e7-4257-a50d-22ccc62c2e5c' ||
    user.email?.toLowerCase() === 'vediqbiryani@gmail.com';

  if (!isPrimaryAdmin) {
    const { data: adminRecord } = await supabaseServer
      .from('admins')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true)
      .maybeSingle();

    if (!adminRecord) {
      return { authorized: false, error: 'Account not authorized for Admin CMS management.' };
    }
  }

  return { authorized: true, user };
}

// GET: View all submitted reviews
export async function GET(req: NextRequest) {
  const auth = await verifyAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const reviews = await getAllReviewsForAdmin();
    return NextResponse.json({ success: true, reviews });
  } catch {
    return NextResponse.json({ success: true, reviews: [] });
  }
}

// PATCH: Approve or Hide review
export async function PATCH(req: NextRequest) {
  const auth = await verifyAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const { id, is_approved } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID is required.' }, { status: 400 });
    }

    await updateReviewStatus(id, Boolean(is_approved));

    return NextResponse.json({
      success: true,
      message: `Review has been ${is_approved ? 'approved and published' : 'hidden from public display'}.`,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update review status.' }, { status: 500 });
  }
}

// DELETE: Delete review
export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminAuth(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Review ID is required.' }, { status: 400 });
    }

    await deleteReviewById(id);

    return NextResponse.json({ success: true, message: 'Review successfully deleted.' });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete review.' }, { status: 500 });
  }
}
