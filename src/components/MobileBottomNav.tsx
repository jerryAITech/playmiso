'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Search, Heart, ShoppingBag, Shield, User } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, wishlist, setIsCartOpen } = useCart();
  const { user } = useAuth();

  // If in admin area, show admin bottom nav
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-4 py-2 flex items-center justify-around shadow-2xl">
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            pathname === '/admin' ? 'text-toy-yellow font-bold' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/admin/products"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            pathname.startsWith('/admin/products') ? 'text-toy-yellow font-bold' : 'text-slate-400'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Products</span>
        </Link>
        <Link
          href="/admin/orders"
          className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
            pathname.startsWith('/admin/orders') ? 'text-toy-yellow font-bold' : 'text-slate-400'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>Orders</span>
        </Link>
        <Link
          href="/"
          className="flex flex-col items-center gap-1 text-[11px] font-medium text-toy-orange"
        >
          <Shield className="w-5 h-5" />
          <span>Storefront</span>
        </Link>
      </div>
    );
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around">
        
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl tap-bounce transition-all ${
            pathname === '/' ? 'text-toy-orange font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {pathname === '/' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-toy-orange rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </Link>

        {/* Categories */}
        <Link
          href="/categories"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl tap-bounce transition-all ${
            pathname.startsWith('/categories') ? 'text-toy-orange font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Grid className="w-5 h-5" />
            {pathname.startsWith('/categories') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-toy-orange rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Explore</span>
        </Link>

        {/* Bag */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl tap-bounce text-slate-700 hover:text-toy-orange relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-toy-orange text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-bounce-subtle">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight font-medium mt-1">Bag</span>
        </button>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl tap-bounce transition-all relative ${
            pathname === '/wishlist' ? 'text-toy-pink font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-toy-pink text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
            {pathname === '/wishlist' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-toy-pink rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Wishlist</span>
        </Link>

        {/* Profile / Account */}
        <Link
          href={user ? '/profile' : '/login'}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl tap-bounce transition-all ${
            pathname === '/profile' || pathname === '/login' || pathname === '/signup'
              ? 'text-toy-orange font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <User className="w-5 h-5" />
            {(pathname === '/profile' || pathname === '/login') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-toy-orange rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">{user ? 'Profile' : 'Sign In'}</span>
        </Link>

      </div>
    </nav>
  );
}
