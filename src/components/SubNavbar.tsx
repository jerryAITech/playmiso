'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, RotateCcw, ShieldCheck, Flame, Gift, Sparkles, Tag } from 'lucide-react';

export default function SubNavbar() {
  return (
    <div className="hidden lg:block border-b border-slate-100 bg-white/80 backdrop-blur-sm text-xs font-bold text-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-11">
        
        {/* Left Nav links */}
        <div className="flex items-center gap-6">
          <Link
            href="/categories"
            className="flex items-center gap-1.5 text-slate-900 font-extrabold hover:text-toy-orange transition-colors"
          >
            <Menu className="w-4 h-4 text-toy-orange" />
            <span>Shop by Category</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <span className="text-slate-200">|</span>

          <Link href="/shop" className="hover:text-toy-orange transition-colors">
            All Toys
          </Link>
          <Link href="/shop?bestseller=true" className="hover:text-toy-orange transition-colors flex items-center gap-1">
            <span>Best Sellers</span>
          </Link>
          <Link href="/shop?featured=true" className="hover:text-toy-orange transition-colors flex items-center gap-1">
            <span>New Arrivals</span>
          </Link>
          <Link href="/shop?trending=true" className="hover:text-toy-orange transition-colors flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-toy-red" />
            <span>Deals</span>
          </Link>
          <Link href="/categories" className="hover:text-toy-orange transition-colors flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-purple-600" />
            <span>Gift Finder</span>
          </Link>
        </div>

        {/* Right Badges */}
        <div className="flex items-center gap-5 text-[11px] text-slate-600 font-semibold">
          <div className="flex items-center gap-1.5 text-teal-700">
            <RotateCcw className="w-3.5 h-3.5 text-toy-blue" />
            <span>Easy 7-Day Return</span>
          </div>
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Kid Safe</span>
          </div>
        </div>

      </div>
    </div>
  );
}
