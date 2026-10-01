import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { supabase } from '@/lib/supabaseClient';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const DEFAULT_STORAGE_BUCKET = 'restaurant_assets';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required. Please sign in to the Admin Portal.',
          errorCode: 'UNAUTHENTICATED',
        },
        { status: 401 }
      );
    }

    // Verify session token
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or expired admin session. Please log in again.',
          errorCode: 'INVALID_SESSION',
        },
        { status: 401 }
      );
    }

    // Authorization check
    const isPrimaryAdmin =
      user.id === 'bfd10a7c-d7e7-4257-a50d-22ccc62c2e5c' ||
      user.email?.toLowerCase() === 'vediqbiryani@gmail.com';

    if (!isPrimaryAdmin) {
      // Check database admins table
      const { data: adminRecord } = await supabaseServer
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .maybeSingle();

      if (!adminRecord) {
        return NextResponse.json(
          {
            success: false,
            error: 'Access denied: You are not authorized as an active admin.',
            errorCode: 'FORBIDDEN',
          },
          { status: 403 }
        );
      }
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'products';
    const bucket = (formData.get('bucket') as string) || DEFAULT_STORAGE_BUCKET;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No image file provided in upload request.',
          errorCode: 'NO_FILE',
        },
        { status: 400 }
      );
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File exceeds maximum allowed size (10MB). Received ${(file.size / (1024 * 1024)).toFixed(1)} MB.`,
          errorCode: 'FILE_TOO_LARGE',
        },
        { status: 400 }
      );
    }

    // Sanitize file path
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const rawBase = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    const sanitizedBase = rawBase.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40).toLowerCase();
    const uniqueStamp = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const filePath = `${folder}/${uniqueStamp}_${sanitizedBase}.${ext}`;

    const contentType =
      file.type && ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())
        ? file.type
        : ext === 'png'
        ? 'image/png'
        : ext === 'webp'
        ? 'image/webp'
        : 'image/jpeg';

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Attempt upload using supabaseServer
    let uploadRes = await supabaseServer.storage.from(bucket).upload(filePath, buffer, {
      contentType,
      upsert: true,
    });

    // 2. If supabaseServer had an error, attempt with scoped user token
    if (uploadRes.error) {
      const supabaseUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vjfoacxdihwseoeorohg.supabase.co';
      const supabaseAnonKey =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        'sb_publishable_iQefxX2GY7_1hA5ylJwybQ_AhQEVvNH';

      const scopedClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      uploadRes = await scopedClient.storage.from(bucket).upload(filePath, buffer, {
        contentType,
        upsert: true,
      });
    }

    if (uploadRes.error) {
      const errMsg = uploadRes.error.message || String(uploadRes.error);
      const isRls =
        errMsg.toLowerCase().includes('row-level security') ||
        errMsg.toLowerCase().includes('violates') ||
        errMsg.toLowerCase().includes('policy') ||
        errMsg.toLowerCase().includes('denied');

      return NextResponse.json(
        {
          success: false,
          error: isRls
            ? `Supabase Storage RLS Error: Row-level security policy on bucket "${bucket}" rejected upload. Ensure RLS policies on storage.objects allow user ${user.id} (${user.email}).`
            : `Supabase Storage Error: ${errMsg}`,
          errorCode: (uploadRes.error as any).statusCode || 403,
          details: uploadRes.error,
          bucket,
          path: filePath,
          userId: user.id,
        },
        { status: 400 }
      );
    }

    // Resolve public URL
    const { data: publicUrlData } = supabaseServer.storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      bucket,
      path: filePath,
    });
  } catch (err: any) {
    console.error('[API upload-image error]', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Server error uploading image to storage.',
        errorCode: 'SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}
