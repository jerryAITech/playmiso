import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductDetailClient from '@/components/ProductDetailClient';
import ProductCard from '@/components/ProductCard';
import ProductReviewsSection from '@/components/ProductReviewsSection';
import FrequentlyBoughtTogether from '@/components/FrequentlyBoughtTogether';
import Footer from '@/components/Footer';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ProductType } from '@/types';
import { defaultProducts } from '@/lib/default-data';
import type { Metadata } from 'next';

export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: { category: true },
  });

  if (!product) {
    return { title: 'Product Not Found | PlayMiso' };
  }

  let images: string[] = [];
  try {
    images = JSON.parse(product.images);
  } catch {
    images = [product.images];
  }

  const title =
    product.metaTitle ||
    `${product.title} | Buy Online at ₹${product.price} (Cash on Delivery) | PlayMiso`;

  const description =
    product.metaDescription ||
    (product.description ? product.description.substring(0, 160) : `Buy ${product.title} with Cash on Delivery across India.`);

  const ogImageUrl = product.ogImage || (images.length > 0 ? images[0] : undefined);

  return {
    title,
    description,
    keywords: product.metaKeywords || `${product.title}, buy ${product.title}, toys online india, cod toys`,
    alternates: product.canonicalUrl ? { canonical: product.canonicalUrl } : undefined,
    openGraph: {
      title,
      description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (product) {
      relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
        },
        include: { category: true },
        take: 4,
      });
    }
  } catch (err) {
    console.error('Product page fallback mode:', err);
  }

  if (!product) {
    product = defaultProducts.find((p) => p.slug === slug || p.id === slug) || defaultProducts[0];
    relatedProducts = defaultProducts.filter((p) => p.id !== product?.id);
  }

  if (!product) {
    notFound();
  }

  const bundleProduct = relatedProducts[0] || null;

  let imagesList: string[] = [];
  try {
    imagesList = JSON.parse(product.images);
  } catch {
    imagesList = [product.images];
  }

  // Google JSON-LD Structured Data Schema for Rich SEO Cards
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: imagesList,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'PlayMiso',
    },
    offers: {
      '@type': 'Offer',
      url: `https://playmiso.vercel.app/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2028-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'PlayMiso Store',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
    },
  };

  return (
    <div className="space-y-10 pb-16 sm:pb-0">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-toy-orange">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-toy-orange">
            Toys
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link href={`/category/${product.category.slug}`} className="hover:text-toy-orange">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-slate-800 truncate max-w-[160px] sm:max-w-xs">{product.title}</span>
        </nav>
      </div>

      {/* Main Detail Client Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductDetailClient product={product as unknown as ProductType} />
      </div>

      {/* Frequently Bought Together Bundle Widget */}
      {bundleProduct && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FrequentlyBoughtTogether
            currentProduct={product as unknown as ProductType}
            bundleProduct={bundleProduct as unknown as ProductType}
          />
        </div>
      )}

      {/* Customer Reviews & Rating Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductReviewsSection
          productId={product.id}
          initialReviews={product.reviews as any}
          averageRating={product.rating}
          totalReviews={product.reviewsCount}
        />
      </div>

      {/* Related Toys Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg sm:text-2xl font-black text-slate-900">
              More Toys You Might Love ✨
            </h3>
            <Link
              href={`/category/${product.category?.slug}`}
              className="text-xs sm:text-sm font-bold text-toy-orange hover:underline"
            >
              View More &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel as unknown as ProductType} />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
