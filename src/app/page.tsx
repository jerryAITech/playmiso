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

export const revalidate = 0; // Dynamic data for real-time inventory

export default async function HomePage() {
  const [banners, categories, featuredProducts, trendingProducts, bestsellerProducts] = await Promise.all([
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
            className="text-xs sm:text-sm font-bold text-toy-orange hover:underline flex items-center gap-1"
          >
            <span>See All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AnimatedProductGrid
          initialProducts={featuredProducts as unknown as ProductType[]}
          pageSize={8}
          featured={true}
        />
      </section>

      {/* Banner Promo Strip (COD & Fast Dispatch) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-toy-blue to-teal-500 rounded-3xl p-5 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
              Zero Risk Shopping
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Pay Cash on Delivery at Your Doorstep!
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 max-w-lg">
              Inspect your toy parcel first, pay afterwards. 100% genuine toys with 7 days hassle-free exchange.
            </p>
          </div>
          <Link
            href="/shop"
            className="bg-white text-teal-900 font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-toy-sm hover:bg-slate-50 tap-bounce shrink-0"
          >
            Explore Toys
          </Link>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-purple-100 text-toy-purple flex items-center justify-center font-bold text-lg">
              👑
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                Most Loved Bestsellers
              </h2>
              <p className="text-xs text-slate-500 hidden sm:block">
                Parent-approved toys with 4.8+ star ratings
              </p>
            </div>
          </div>
          <Link
            href="/shop"
            className="text-xs sm:text-sm font-bold text-toy-purple hover:underline flex items-center gap-1"
          >
            <span>View Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <AnimatedProductGrid
          initialProducts={bestsellerProducts as unknown as ProductType[]}
          pageSize={8}
          sort="rating"
        />
      </section>

      {/* Parent Reviews & Testimonials Slider Carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ParentReviewsSlider />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
