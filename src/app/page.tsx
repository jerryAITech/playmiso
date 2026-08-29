import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import HeroBanner from '@/components/HeroBanner';
import CategoryChips from '@/components/CategoryChips';
import AgeGroupFilter from '@/components/AgeGroupFilter';
import ProductCard from '@/components/ProductCard';
import AnimatedProductGrid from '@/components/AnimatedProductGrid';
import ParentReviewsSlider from '@/components/ParentReviewsSlider';
import Footer from '@/components/Footer';
import { Sparkles, Flame, Trophy, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { CategoryType, ProductType } from '@/types';
import { defaultBanners, defaultCategories, defaultProducts } from '@/lib/default-data';

export const revalidate = 0; // Dynamic data for real-time inventory

export default async function HomePage() {
  let banners: any[] = defaultBanners;
  let categories: any[] = defaultCategories;
  let featuredProducts: any[] = defaultProducts;
  let trendingProducts: any[] = defaultProducts;
  let bestsellerProducts: any[] = defaultProducts;

  try {
    const [dbBanners, dbCategories, dbFeatured, dbTrending, dbBestsellers] = await Promise.all([
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' },
      }),
      prisma.product.findMany({
        where: { isFeatured: true },
        include: { category: true },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        where: { isTrending: true },
        include: { category: true },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        where: { isBestseller: true },
        include: { category: true },
        take: 8,
        orderBy: { rating: 'desc' },
      }),
    ]);

    if (dbBanners && dbBanners.length > 0) banners = dbBanners;
    if (dbCategories && dbCategories.length > 0) categories = dbCategories;
    if (dbFeatured && dbFeatured.length > 0) featuredProducts = dbFeatured;
    if (dbTrending && dbTrending.length > 0) trendingProducts = dbTrending;
    if (dbBestsellers && dbBestsellers.length > 0) bestsellerProducts = dbBestsellers;
  } catch (error) {
    console.error('HomePage fallback mode (database initializing):', error);
  }

  return (
    <div className="space-y-6 sm:space-y-10">
      {/* Hero Section with Dynamic Banners */}
      <HeroBanner initialBanners={banners} />

      {/* Categories Horizontal Story Chips */}
      <section>
        <CategoryChips categories={categories as CategoryType[]} />
      </section>

      {/* Age Group Filter Bar */}
      <section>
        <AgeGroupFilter />
      </section>

      {/* Featured / Flash Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-amber-100 text-toy-orange flex items-center justify-center font-bold text-lg">
              ⚡
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>Featured Flash Deals</span>
                <span className="bg-toy-red text-white text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full">
                  HOT
                </span>
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                Grab top-rated toys at special festive prices with Cash on Delivery
              </p>
            </div>
          </div>
          <Link
            href="/shop?featured=true"
            className="text-xs sm:text-sm font-bold text-toy-orange hover:text-toy-orange/80 flex items-center gap-1 group tap-bounce"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product as ProductType} />
          ))}
        </div>
      </section>

      {/* Verified Parent Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ParentReviewsSlider />
      </section>

      {/* Explore All Toys Infinite Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-orange-100 text-toy-orange flex items-center justify-center font-bold text-lg">
              🧸
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                Explore All Toys
              </h2>
              <p className="text-xs text-slate-500">
                100% Non-toxic, BPA-free and lab tested safe for child development
              </p>
            </div>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-bold text-toy-orange hover:text-toy-orange/80 flex items-center gap-1 group tap-bounce"
          >
            <span>Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <AnimatedProductGrid initialProducts={trendingProducts as ProductType[]} />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
