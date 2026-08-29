'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, Heart, ShoppingBag, Shield, User, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, wishlist } = useCart();
  const { user } = useAuth();

  // If in admin area, show admin bottom nav on mobile & tablet
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-4 py-2 flex items-center justify-around shadow-2xl">
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium tap-bounce ${
            pathname === '/admin' ? 'text-toy-yellow font-black' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/admin/products"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium tap-bounce ${
            pathname.startsWith('/admin/products') ? 'text-toy-yellow font-black' : 'text-slate-400'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Products</span>
        </Link>
        <Link
          href="/admin/orders"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium tap-bounce ${
            pathname.startsWith('/admin/orders') ? 'text-toy-yellow font-black' : 'text-slate-400'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Orders</span>
        </Link>
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-[11px] font-medium text-toy-orange tap-bounce"
        >
          <Shield className="w-5 h-5" />
          <span>Storefront</span>
        </Link>
      </div>
    );
  }

  const isHome = pathname === '/';
  const isExplore = pathname.startsWith('/categories') || pathname.startsWith('/category') || pathname === '/shop';
  const isBag = pathname === '/cart' || pathname === '/checkout';
  const isWishlist = pathname === '/wishlist';
  const isProfile = pathname === '/profile' || pathname === '/login' || pathname === '/signup';

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-2xl border-t border-slate-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] select-none pb-[max(0.375rem,env(safe-area-inset-bottom))]"
      aria-label="Mobile & Tablet Navigation"
    >
      <div className="max-w-lg mx-auto px-3 py-1.5 flex items-center justify-around">
        
        {/* 1. Home Tab */}
        <Link
          href="/"
          aria-label="Home"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl tap-bounce transition-all relative ${
            isHome ? 'text-toy-orange font-black scale-105' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 transition-transform ${isHome ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {isHome && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-toy-orange rounded-full shadow-xs animate-scale-up" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </Link>

        {/* 2. Explore / Categories Tab */}
        <Link
          href="/shop"
          aria-label="Explore Toys"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl tap-bounce transition-all relative ${
            isExplore ? 'text-toy-orange font-black scale-105' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Grid className={`w-5 h-5 transition-transform ${isExplore ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {isExplore && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-toy-orange rounded-full shadow-xs animate-scale-up" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Explore</span>
        </Link>

        {/* 3. Shopping Bag Tab (Navigates directly to /cart) */}
        <Link
          href="/cart"
          aria-label={`Shopping Bag (${totalItems} items)`}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl tap-bounce transition-all relative ${
            isBag ? 'text-toy-orange font-black scale-105' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <div className={`p-1 rounded-xl transition-all ${isBag ? 'bg-orange-50' : ''}`}>
              <ShoppingBag className={`w-5 h-5 transition-transform ${isBag ? 'stroke-[2.5] text-toy-orange' : 'stroke-[1.8]'}`} />
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-toy-orange text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-bounce-subtle">
                {totalItems}
              </span>
            )}
            {isBag && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-toy-orange rounded-full shadow-xs" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Bag</span>
        </Link>

        {/* 4. Wishlist Tab */}
        <Link
          href="/wishlist"
          aria-label={`Wishlist (${wishlist.length} items)`}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl tap-bounce transition-all relative ${
            isWishlist ? 'text-toy-pink font-black scale-105' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 transition-transform ${isWishlist ? 'stroke-[2.5] fill-toy-pink text-toy-pink' : 'stroke-[1.8]'}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-toy-pink text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
            {isWishlist && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-toy-pink rounded-full shadow-xs" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Wishlist</span>
        </Link>

        {/* 5. Profile / Account Tab */}
        <Link
          href={user ? '/profile' : '/login'}
          aria-label={user ? 'User Profile' : 'Sign In'}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl tap-bounce transition-all relative ${
            isProfile ? 'text-toy-orange font-black scale-105' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <User className={`w-5 h-5 transition-transform ${isProfile ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {isProfile && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-toy-orange rounded-full shadow-xs animate-scale-up" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">{user ? 'Profile' : 'Sign In'}</span>
        </Link>

      </div>
    </nav>
  );
}
