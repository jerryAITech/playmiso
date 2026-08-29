import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import AgeGroupFilter from '@/components/AgeGroupFilter';
import Footer from '@/components/Footer';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ProductType } from '@/types';
import { defaultCategories, defaultProducts } from '@/lib/default-data';
import type { Metadata } from 'next';

export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ age?: string; sort?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  let category: any = defaultCategories.find((c) => c.slug === slug);

  try {
    const dbCat = await prisma.category.findUnique({
      where: { slug },
    });
    if (dbCat) category = dbCat;
  } catch {}

  if (!category) {
    return { title: 'Category Not Found | PlayMiso' };
  }

  return {
    title: `${category.name} Toys | Buy Online with Cash on Delivery | PlayMiso`,
    description: category.description || `Shop the best ${category.name} toys for kids with Cash on Delivery across India.`,
    openGraph: {
      title: `${category.name} - PlayMiso Store`,
      description: category.description || `Explore ${category.name} toys.`,
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { age, sort } = await searchParams;

  let category: any = defaultCategories.find((c) => c.slug === slug);
  let products: any[] = defaultProducts.filter((p) => p.category?.slug === slug);

  try {
    const dbCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (dbCategory) {
      category = dbCategory;

      const where: any = { categoryId: dbCategory.id };
      if (age) {
        where.ageGroup = age;
      }

      let orderBy: any = { createdAt: 'desc' };
      if (sort === 'price-low') {
        orderBy = { price: 'asc' };
      } else if (sort === 'price-high') {
        orderBy = { price: 'desc' };
      } else if (sort === 'rating') {
        orderBy = { rating: 'desc' };
      }

      const dbProducts = await prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
      });

      if (dbProducts) products = dbProducts;
    }
  } catch (err) {
    console.error('CategoryDetailPage fallback mode:', err);
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Category Banner */}
      <div className="bg-gradient-to-r from-toy-yellow/30 via-orange-100 to-pink-100 border-b border-slate-200/60 py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-toy-orange">
                {products.length} Products Available
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-0.5">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Age Filter for this category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AgeGroupFilter selectedAge={age} />
      </div>

      {/* Product List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 max-w-md mx-auto my-8 space-y-3">
            <div className="text-4xl">🎈</div>
            <h3 className="text-base font-bold text-slate-800">No toys found in this filter</h3>
            <p className="text-xs text-slate-500">Try choosing a different age group or explore all toys.</p>
            <Link
              href="/shop"
              className="inline-block bg-toy-orange text-white text-xs font-bold px-5 py-2.5 rounded-full tap-bounce"
            >
              Explore All Toys
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as ProductType} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
