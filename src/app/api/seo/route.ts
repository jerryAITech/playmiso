import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const defaultSeo = {
  id: 'global',
  siteTitle: 'PlayMiso | Discover the Magic of Play (Cash On Delivery)',
  metaDescription:
    'PlayMiso – Discover the Magic of Play. Shop safe, educational, STEM kits, cuddly plushies, RC cars, puzzles and action figures for kids of all ages with Cash on Delivery (COD) across India.',
  keywords:
    'playmiso, toys online india, buy toys online, educational toys, stem toys, soft toys teddy bear, rc cars for kids, puzzles for children, cod toys shopping',
  ogImage:
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80',
  twitterHandle: '@PlayMisoIndia',
};

export async function GET() {
  try {
    let seo = await prisma.seoSetting.findUnique({
      where: { id: 'global' },
    });

    if (!seo) {
      try {
        seo = await prisma.seoSetting.create({
          data: defaultSeo,
        });
      } catch {
        seo = defaultSeo as any;
      }
    }

    return NextResponse.json(seo || defaultSeo);
  } catch (error: any) {
    console.error('Error fetching SEO settings, returning default fallback:', error);
    return NextResponse.json(defaultSeo);
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
        siteTitle: siteTitle || defaultSeo.siteTitle,
        metaDescription: metaDescription || defaultSeo.metaDescription,
        keywords: keywords || defaultSeo.keywords,
        ogImage: ogImage || defaultSeo.ogImage,
        twitterHandle: twitterHandle || defaultSeo.twitterHandle,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating SEO settings:', error);
    return NextResponse.json({ error: error.message || 'Failed to update SEO settings' }, { status: 500 });
  }
}
