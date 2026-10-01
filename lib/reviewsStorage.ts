import fs from 'node:fs';
import path from 'node:path';
import { supabase } from './supabaseClient';
import { supabaseServer } from './supabaseServer';
import { ReviewItem } from '@/types/supabase';

const localFilePath = path.join(process.cwd(), 'data', 'local-reviews.json');

// Helper to read local JSON storage safely
export function getLocalReviews(): ReviewItem[] {
  try {
    if (fs.existsSync(localFilePath)) {
      const content = fs.readFileSync(localFilePath, 'utf8');
      const parsed = JSON.parse(content || '[]');
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch {}
  return [];
}

// Helper to write local JSON storage safely
export function saveLocalReviews(reviews: ReviewItem[]): void {
  try {
    const dir = path.dirname(localFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(localFilePath, JSON.stringify(reviews, null, 2), 'utf8');
  } catch {}
}

// Check and fetch approved reviews for the public website
export async function getApprovedReviews(): Promise<ReviewItem[]> {
  try {
    // 1. Try Supabase
    const { data, error } = await supabase
      .from('reviews')
      .select('id, name, rating, review, is_approved, created_at')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data as ReviewItem[];
    }
  } catch {
    // Silently continue to local fallback
  }

  // 2. Fallback to local storage (only approved reviews)
  const localList = getLocalReviews();
  return localList.filter((r) => r.is_approved === true);
}

// Add a new review (pending by default)
export async function addReview(newReview: {
  name: string;
  rating: number;
  review: string;
}): Promise<{ id: string; savedToDb: boolean }> {
  const id = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const record: ReviewItem = {
    id,
    name: newReview.name,
    rating: newReview.rating,
    review: newReview.review,
    is_approved: false, // Must be approved by admin
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let savedToDb = false;

  // 1. Try saving to Supabase
  try {
    const { data, error } = await supabaseServer
      .from('reviews')
      .insert([record])
      .select('id')
      .maybeSingle();

    if (!error && data?.id) {
      savedToDb = true;
    }
  } catch {}

  // 2. Also save to local storage for local persistence
  const currentList = getLocalReviews();
  currentList.unshift(record);
  saveLocalReviews(currentList);

  return { id, savedToDb };
}

// Fetch all reviews for admin panel (both approved and pending)
export async function getAllReviewsForAdmin(): Promise<ReviewItem[]> {
  try {
    const { data, error } = await supabaseServer
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      return data as ReviewItem[];
    }
  } catch {}

  return getLocalReviews();
}

// Update review approval status (Admin)
export async function updateReviewStatus(
  id: string,
  is_approved: boolean
): Promise<boolean> {
  let updatedInDb = false;

  try {
    const { error } = await supabaseServer
      .from('reviews')
      .update({ is_approved, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      updatedInDb = true;
    }
  } catch {}

  // Always update local store too
  const list = getLocalReviews();
  const updatedList = list.map((r) => (r.id === id ? { ...r, is_approved } : r));
  saveLocalReviews(updatedList);

  return true;
}

// Delete review (Admin)
export async function deleteReviewById(id: string): Promise<boolean> {
  try {
    await supabaseServer.from('reviews').delete().eq('id', id);
  } catch {}

  const list = getLocalReviews();
  const updatedList = list.filter((r) => r.id !== id);
  saveLocalReviews(updatedList);

  return true;
}
