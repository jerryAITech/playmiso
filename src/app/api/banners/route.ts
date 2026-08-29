import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(banners);
  } catch (error: any) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, badgeText, ctaText, linkUrl, image, bgGradient, productId, order } = body;

    if (!title || !image) {
      return NextResponse.json({ error: 'Title and Image URL are required' }, { status: 400 });
    }

    const banner = await prisma.banner.create({
      data: {
        title,
        subtitle: subtitle || '',
        badgeText: badgeText || 'MEGA TOY SALE • UP TO 40% OFF',
        ctaText: ctaText || 'Shop Now',
        linkUrl: linkUrl || '/shop',
        image,
        bgGradient: bgGradient || 'from-amber-400 via-orange-300 to-toy-orange',
        productId: productId || null,
        order: parseInt(order) || 0,
        isActive: true,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error: any) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: error.message || 'Failed to create banner' }, { status: 500 });
  }
}
