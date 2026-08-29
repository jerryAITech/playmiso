import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://playmiso.vercel.app';

  let productUrls: MetadataRoute.Sitemap = [];
  let categoryUrls: MetadataRoute.Sitemap = [];

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    productUrls = products.map((prod) => ({
      url: `${baseUrl}/product/${prod.slug}`,
      lastModified: prod.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }));

    categoryUrls = categories.map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (e) {
    console.warn('Sitemap build fallback: database unreachable during SSG build phase', e);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
