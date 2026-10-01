import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl =
  !rawUrl || rawUrl.includes('iqgwzfeprwoanjdnvkog') || rawUrl.includes('placeholder')
    ? 'https://vjfoacxdihwseoeorohg.supabase.co'
    : rawUrl;

const isOldKey = (key: string) => {
  if (!key) return true;
  if (key.includes('oCpYwd') || key.includes('placeholder')) return true;
  try {
    const parts = key.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      if (payload.ref && payload.ref !== 'vjfoacxdihwseoeorohg') return true;
    }
  } catch {}
  return false;
};

const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const rawAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

const supabaseServiceKey =
  rawServiceKey && !isOldKey(rawServiceKey)
    ? rawServiceKey
    : rawAnonKey && !isOldKey(rawAnonKey)
    ? rawAnonKey
    : 'sb_publishable_iQefxX2GY7_1hA5ylJwybQ_AhQEVvNH';

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export const isSupabaseServerConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
      supabaseServiceKey &&
      !supabaseUrl.includes('placeholder-project')
  );
};
