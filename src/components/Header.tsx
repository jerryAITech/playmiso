'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Heart, Truck, LayoutDashboard, LogIn } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import LiveSearchBar from '@/components/LiveSearchBar';

import { useTheme } from '@/lib/theme-context';
import PlayMisoLogo from '@/components/PlayMisoLogo';

export default function Header() {
  const { totalItems, wishlist, setIsCartOpen } = useCart();
  const { user } = useAuth();
  const { theme } = useTheme();

  const isFestive = theme.festiveMode !== 'NONE' && theme.festiveBannerActive;
  const ribbonBg = isFestive ? theme.festiveRibbonBg : 'from-toy-purple via-toy-pink to-toy-orange';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      {/* Top Value / Festive Banner */}
      <div className={`bg-gradient-to-r ${ribbonBg} text-white text-xs py-2 px-4 font-medium text-center flex items-center justify-center gap-2 shadow-xs transition-colors duration-500`}>
        {isFestive ? (
          <>
            <span className="text-base select-none">{theme.festiveLogoEmoji}</span>
            <span className="font-extrabold tracking-wide">{theme.festiveBadgeText}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
              Festive COD Sale
            </span>
          </>
        ) : (
          <>
            <Truck className="w-3.5 h-3.5 animate-bounce-subtle" />
            <span>
              Cash On Delivery (COD) Available • Free Shipping on ₹499+ • Use Code:{' '}
              <strong className="font-mono bg-white/20 px-1.5 py-0.5 rounded">PLAYMISO10</strong>
            </span>
            <span className="hidden md:inline-block bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold">
              100% Kid Safe
            </span>
          </>
        )}
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* PlayMiso Brand Logo */}
          <PlayMisoLogo size="md" />

          {/* Desktop Live Instant Search */}
          <div className="hidden md:block flex-1 max-w-md mx-6">
            <LiveSearchBar />
          </div>

          {/* Quick Nav & Action Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Admin Link Badge (If Admin user) */}
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="hidden lg:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-toy-yellow" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Profile / Auth Button */}
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold transition-all tap-bounce"
              >
                <div className="w-6 h-6 rounded-full bg-toy-orange text-white flex items-center justify-center text-xs font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-full text-xs font-bold transition-all tap-bounce"
              >
                <LogIn className="w-4 h-4 text-toy-orange" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Wishlist Link (Desktop) */}
            <Link
              href="/wishlist"
              className="hidden sm:flex relative p-2.5 text-slate-700 hover:text-toy-pink hover:bg-slate-100 rounded-full transition-colors tap-bounce"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-toy-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-scale-up shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-toy-yellow hover:bg-toy-yellow/90 text-slate-950 font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-toy-sm transition-all tap-bounce"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-slate-900" />
              <span className="hidden sm:inline text-sm">Bag</span>
              <span className="w-5 h-5 bg-slate-900 text-white text-xs font-black rounded-full flex items-center justify-center shadow-inner">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row with Live Autocomplete */}
        <div className="md:hidden pb-3">
          <LiveSearchBar isMobile placeholder="Search 1,000+ kid-approved toys..." />
        </div>
      </div>
    </header>
  );
}
