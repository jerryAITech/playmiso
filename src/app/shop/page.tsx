import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import AnimatedProductGrid from '@/components/AnimatedProductGrid';
import AgeGroupFilter from '@/components/AgeGroupFilter';
import Footer from '@/components/Footer';
import { Filter, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { CategoryType, ProductType } from '@/types';
import { defaultCategories, defaultProducts } from '@/lib/default-data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Toys Catalog | Shop Safe STEM Kits, Plushies & RC Cars',
  description: 'Explore the complete PlayMiso toy collection. Non-toxic, BPA-free STEM educational kits, plushies, action figures, puzzles, and RC cars with Cash on Delivery across India.',
};

export const revalidate = 0;

interface ShopPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    age?: string;
    sort?: string;
    featured?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const { q, category, age, sort, featured } = params;

  const where: any = {};

  if (category) {
    where.category = { slug: category };
  }

  if (age) {
    where.ageGroup = age;
  }

  if (featured === 'true') {
    where.isFeatured = true;
  }

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { brand: { contains: q } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price-low') {
    orderBy = { price: 'asc' };
  } else if (sort === 'price-high') {
    orderBy = { price: 'desc' };
  } else if (sort === 'rating') {
    orderBy = { rating: 'desc' };
  }

  let products: any[] = defaultProducts;
  let categories: any[] = defaultCategories;
  let totalCount = defaultProducts.length;

  try {
    const [dbProducts, dbCategories, dbCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        take: 8,
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.product.count({ where }),
    ]);

    if (dbProducts && dbProducts.length > 0) products = dbProducts;
    if (dbCategories && dbCategories.length > 0) categories = dbCategories;
    if (dbCount !== undefined) totalCount = dbCount;
  } catch (error) {
    console.error('ShopPage fallback mode:', error);
  }

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-50 to-pink-50 border-b border-slate-200/60 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-toy-orange uppercase tracking-wider mb-1">
                <span>Toy Explorer</span>
                <span>•</span>
                <span>{totalCount} Toys Available</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
                {category
                  ? categories.find((c) => c.slug === category)?.name || 'Toys Catalog'
                  : q
                  ? `Search: "${q}"`
                  : age
                  ? `Toys for ${age}`
                  : 'All Toys & Fun Games'}
              </h1>
            </div>

            {/* Quick Sorting Options */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-slate-600 shrink-0 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-toy-orange" />
                <span>Sort:</span>
              </span>
              <Link
                href={{
                  pathname: '/shop',
                  query: { ...params, sort: undefined },
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  !sort ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Newest
              </Link>
              <Link
                href={{
                  pathname: '/shop',
                  query: { ...params, sort: 'price-low' },
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  sort === 'price-low' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Price: Low to High
              </Link>
              <Link
                href={{
                  pathname: '/shop',
                  query: { ...params, sort: 'price-high' },
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  sort === 'price-high' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Price: High to Low
              </Link>
              <Link
                href={{
                  pathname: '/shop',
                  query: { ...params, sort: 'rating' },
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  sort === 'rating' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                Top Rated
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <Link
            href={{
              pathname: '/shop',
              query: { ...params, category: undefined },
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all tap-bounce ${
              !category
                ? 'bg-toy-orange text-white shadow-toy-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
            }`}
          >
            All Categories
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={{
                pathname: '/shop',
                query: { ...params, category: cat.slug },
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all tap-bounce ${
                category === cat.slug
                  ? 'bg-toy-orange text-white shadow-toy-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Age Group Bar */}
        <AgeGroupFilter selectedAge={age} />
      </div>

      {/* Products Grid with Scroll Animations & Load More */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8 space-y-4">
            <div className="text-5xl">🔍</div>
            <h3 className="text-lg font-extrabold text-slate-800">No matching toys found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your category or age filters to find more playful toys.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-toy-orange text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-toy-sm hover:bg-toy-orange/90 tap-bounce"
            >
              Reset All Filters
            </Link>
          </div>
        ) : (
          <AnimatedProductGrid
            initialProducts={products as unknown as ProductType[]}
            totalCount={totalCount}
            categorySlug={category}
            ageGroup={age}
            query={q}
            sort={sort}
            featured={featured === 'true'}
            pageSize={8}
          />
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
