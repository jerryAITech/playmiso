import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        discount: discount ? parseInt(discount) : 0,
        images: typeof images === 'string' ? images : JSON.stringify(images || []),
        videoUrl: videoUrl !== undefined ? videoUrl : undefined,
        categoryId,
        ageGroup,
        stock: parseInt(stock) || 0,
        isFeatured: Boolean(isFeatured),
        isTrending: Boolean(isTrending),
        isBestseller: Boolean(isBestseller),
        brand: brand || 'ToyJoy',
        safetyInfo: safetyInfo || '100% Non-Toxic, Safe for Kids',
        metaTitle: metaTitle !== undefined ? metaTitle : undefined,
        metaDescription: metaDescription !== undefined ? metaDescription : undefined,
        metaKeywords: metaKeywords !== undefined ? metaKeywords : undefined,
        canonicalUrl: canonicalUrl !== undefined ? canonicalUrl : undefined,
        ogImage: ogImage !== undefined ? ogImage : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
