import { NextRequest, NextResponse } from 'next/server';
import { getApprovedReviews, addReview } from '@/lib/reviewsStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reviews = await getApprovedReviews();
    return NextResponse.json({ success: true, reviews });
  } catch {
    return NextResponse.json({ success: true, reviews: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, rating, review } = body;

    const cleanName = String(name || '').trim();
    const numRating = Number(rating);
    const cleanReview = String(review || '').trim();

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your full name (at least 2 characters).' },
        { status: 400 }
      );
    }

    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { success: false, error: 'Please select a valid rating between 1 and 5 stars.' },
        { status: 400 }
      );
    }

    if (!cleanReview || cleanReview.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Please write your feedback/review (at least 5 characters).' },
        { status: 400 }
      );
    }

    if (cleanReview.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Review is too long (maximum 2000 characters).' },
        { status: 400 }
      );
    }

    const { id, savedToDb } = await addReview({
      name: cleanName,
      rating: numRating,
      review: cleanReview,
    });

    return NextResponse.json({
      success: true,
      savedToDb,
      id,
      message: 'Thank you for sharing your experience! Your review will be published once approved by our team.',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}
