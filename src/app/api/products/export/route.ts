import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultProducts } from '@/lib/default-data';

export async function GET() {
  try {
    let products: any[] = [];
    try {
      products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      products = defaultProducts;
    }

    if (!products || products.length === 0) {
      products = defaultProducts;
    }

    const headers = [
      'Title',
      'Category',
      'Price (INR)',
      'Compare At Price (MRP)',
      'Discount (%)',
      'Stock',
      'Age Group',
      'Brand',
      'Description',
      'Safety Info',
      'Image URLs (Comma-separated)',
      'Demo Video URL',
      'Meta Title',
      'Meta Description',
      'Meta Keywords',
      'Is Featured',
      'Is Trending',
      'Is Bestseller',
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const val = String(str).replace(/"/g, '""');
      return `"${val}"`;
    };

    const rows = products.map((p) => {
      let imageListStr = p.images;
      try {
        const parsed = JSON.parse(p.images);
        if (Array.isArray(parsed)) imageListStr = parsed.join(', ');
      } catch {
        imageListStr = p.images;
      }

      return [
        escapeCsv(p.title),
        escapeCsv(p.category?.name || 'Educational & STEM Kits'),
        escapeCsv(p.price),
        escapeCsv(p.compareAtPrice || ''),
        escapeCsv(p.discount || 0),
        escapeCsv(p.stock),
        escapeCsv(p.ageGroup),
        escapeCsv(p.brand || 'PlayMiso'),
        escapeCsv(p.description),
        escapeCsv(p.safetyInfo),
        escapeCsv(imageListStr),
        escapeCsv(p.videoUrl || ''),
        escapeCsv(p.metaTitle || ''),
        escapeCsv(p.metaDescription || ''),
        escapeCsv(p.metaKeywords || ''),
        escapeCsv(p.isFeatured ? 'TRUE' : 'FALSE'),
        escapeCsv(p.isTrending ? 'TRUE' : 'FALSE'),
        escapeCsv(p.isBestseller ? 'TRUE' : 'FALSE'),
      ].join(',');
    });

    // Add UTF-8 BOM (\uFEFF) so Microsoft Excel opens it cleanly with special characters & formatting
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="playmiso_products_export_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting products, using default fallback:', error);
    return NextResponse.json({ error: 'Failed to export products' }, { status: 500 });
  }
}
