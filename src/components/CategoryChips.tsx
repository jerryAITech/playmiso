import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CategoryType } from '@/types';

interface CategoryChipsProps {
  categories: CategoryType[];
  selectedSlug?: string;
}

export default function CategoryChips({ categories, selectedSlug }: CategoryChipsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-3">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <span>Shop by Category</span>
        </h2>
        <Link
          href="/categories"
          className="text-xs sm:text-sm font-bold text-toy-orange hover:text-toy-orange/80"
        >
          View All &rarr;
        </Link>
      </div>

      {/* Horizontal Scroll Story Bubbles (App Style) */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-3 no-scrollbar snap-x">
        {/* All Toys bubble */}
        <Link
          href="/shop"
          className="flex flex-col items-center gap-1.5 shrink-0 group snap-start"
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
              !selectedSlug
                ? 'bg-gradient-to-tr from-toy-orange to-toy-yellow ring-2 ring-toy-orange ring-offset-2'
                : 'bg-slate-200'
            }`}
          >
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 to-toy-orange flex items-center justify-center text-xl sm:text-2xl shadow-inner text-white font-bold">
              🎁
            </div>
          </div>
          <span
            className={`text-xs text-center font-bold max-w-[72px] truncate ${
              !selectedSlug ? 'text-toy-orange' : 'text-slate-700'
            }`}
          >
            All Toys
          </span>
        </Link>

        {/* Dynamic Categories */}
        {categories.map((cat) => {
          const isSelected = selectedSlug === cat.slug;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-1.5 shrink-0 group snap-start"
            >
              <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                  isSelected
                    ? 'bg-gradient-to-tr from-toy-pink via-toy-purple to-toy-blue ring-2 ring-toy-pink ring-offset-2'
                    : 'bg-gradient-to-tr from-slate-200 to-slate-100 hover:from-toy-yellow hover:to-toy-orange'
                }`}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-inner">
                  <Image
                    src={cat.image || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=200&q=80'}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="80px"
                  />
                </div>
              </div>
              <span
                className={`text-[11px] sm:text-xs text-center font-bold max-w-[80px] leading-tight truncate ${
                  isSelected ? 'text-toy-pink font-extrabold' : 'text-slate-700'
                }`}
              >
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
