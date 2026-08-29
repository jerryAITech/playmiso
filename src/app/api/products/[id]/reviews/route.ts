import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviews = await prisma.review.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reviews || []);
  } catch (error) {
    console.error('Error fetching product reviews, returning empty list:', error);
    return NextResponse.json([]);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, rating, comment, title } = body;

    if (!name || !rating || !comment) {
      return NextResponse.json({ error: 'Name, rating and comment are required' }, { status: 400 });
    }

    const numRating = parseInt(rating) || 5;

    // Create review
    const review = await prisma.review.create({
      data: {
        productId: id,
        userName: name,
        rating: numRating,
        title: title || 'Verified Parent Review',
        comment,
        isVerified: true,
      },
    });

    // Recalculate product aggregate rating
    try {
      const allReviews = await prisma.review.findMany({
        where: { productId: id },
      });

      const totalScore = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalScore / allReviews.length;

      await prisma.product.update({
        where: { id },
        data: {
          rating: parseFloat(avgRating.toFixed(1)),
          reviewsCount: allReviews.length,
        },
      });
    } catch {}

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}
