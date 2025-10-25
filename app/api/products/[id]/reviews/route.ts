import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';
import { reviewSchema } from '@/lib/validation';

initializeDatabase();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser();
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: productId } = await params;
    const body = await request.json();
    
    // Check if product exists
    const product = db.products.find((p) => p.id === productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Validate input
    const result = reviewSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.issues },
        { status: 400 }
      );
    }

    // Get user info
    const user = db.users.find((u) => u.id === authUser.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const review = {
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productId,
      userId: authUser.userId,
      userName: `${user.firstName} ${user.lastName}`,
      ...result.data,
      createdAt: new Date(),
    };

    db.reviews.push(review);

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
