import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import Footer from '@/components/Footer';
import { ArrowRight, Sparkles } from 'lucide-react';
import { defaultCategories } from '@/lib/default-data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Toy Categories & Collections | Educational, Plushies, RC Cars',
  description: 'Browse PlayMiso toy collections by category: STEM educational toys, soft plushies, remote control cars, puzzles, and arts & crafts.',
};

export const revalidate = 0;

export default async function CategoriesPage() {
  let categories: any[] = defaultCategories.map((c) => ({ ...c, _count: { products: 12 } }));

  try {
    const dbCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories;
    }
  } catch (err) {
    console.error('CategoriesPage fallback mode:', err);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-100 via-pink-50 to-amber-50 py-8 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full text-xs font-bold text-toy-purple shadow-sm mb-2">
            <Sparkles className="w-3.5 h-3.5 text-toy-orange" />
            <span>Curated Collections</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
            Browse All Toy Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            From brain-boosting STEM projects to cozy plushies and high-speed RC cars, find the perfect toy for every adventure.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div className="flex gap-4 items-center">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image
                    src={cat.image || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=300&q=80'}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="100px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-toy-orange uppercase tracking-wider">
                    {cat._count?.products || 10}+ Toys Available
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1 group-hover:text-toy-orange transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {cat.description || 'Fun toys and learning games for kids.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-toy-orange">
                <span>Explore Category</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
