import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let seo = await prisma.seoSetting.findUnique({
      where: { id: 'global' },
    });

    if (!seo) {
      seo = await prisma.seoSetting.create({
        data: {
          id: 'global',
          siteTitle: 'PlayMiso | Discover the Magic of Play (Cash On Delivery)',
          metaDescription:
            'PlayMiso – Discover the Magic of Play. Shop safe, educational, STEM kits, cuddly plushies, RC cars, puzzles and action figures for kids of all ages with Cash on Delivery (COD) across India.',
          keywords:
            'playmiso, toys online india, buy toys online, educational toys, stem toys, soft toys teddy bear, rc cars for kids, puzzles for children, cod toys shopping',
          ogImage:
            'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80',
          twitterHandle: '@PlayMisoIndia',
        },
      });
    }

    return NextResponse.json(seo);
  } catch (error: any) {
    console.error('Error fetching SEO settings:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteTitle, metaDescription, keywords, ogImage, twitterHandle } = body;

    const updated = await prisma.seoSetting.upsert({
      where: { id: 'global' },
      update: {
        siteTitle,
        metaDescription,
        keywords,
        ogImage,
        twitterHandle,
      },
      create: {
        id: 'global',
        siteTitle,
        metaDescription,
        keywords,
        ogImage,
        twitterHandle,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json({ error: error.message || 'Failed to update SEO settings' }, { status: 500 });
  }
}
