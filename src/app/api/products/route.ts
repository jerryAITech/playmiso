import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const age = searchParams.get('age');
    const query = searchParams.get('q');
    const sort = searchParams.get('sort');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category) {
      where.category = { slug: category };
    }

    if (age) {
      where.ageGroup = age;
    }

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { brand: { contains: query } },
      ];
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-high') {
      orderBy = { price: 'desc' };
    } else if (sort === 'rating') {
      orderBy = { rating: 'desc' };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(products, {
      headers: {
        'x-total-count': total.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      compareAtPrice,
      discount,
      images,
      videoUrl,
      categoryId,
      ageGroup,
      stock,
      isFeatured,
      isTrending,
      isBestseller,
      brand,
      safetyInfo,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogImage,
    } = body;

    if (!title || !price || !categoryId || !ageGroup) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    // Generate unique slug
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${randomSuffix}`;

    const newProduct = await prisma.product.create({
      data: {
        title,
        slug,
        description: description || '',
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        discount: discount ? parseInt(discount) : 0,
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        videoUrl: videoUrl || null,
        categoryId,
        ageGroup,
        stock: parseInt(stock) || 10,
        isFeatured: Boolean(isFeatured),
        isTrending: Boolean(isTrending),
        isBestseller: Boolean(isBestseller),
        brand: brand || 'ToyJoy',
        safetyInfo: safetyInfo || '100% Non-Toxic, Safe for Kids',
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
        canonicalUrl: canonicalUrl || null,
        ogImage: ogImage || null,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
