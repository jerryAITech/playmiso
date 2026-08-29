import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Store,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  Globe,
  Sparkles,
  Palette,
} from 'lucide-react';
import AdminAuthGate from '@/components/AdminAuthGate';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-5 shrink-0 justify-between shadow-xs">
          <div className="space-y-6">
            
            {/* Admin Brand */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-toy-yellow via-toy-orange to-toy-pink flex items-center justify-center text-xl shadow-toy-sm text-slate-900 font-bold border border-white">
                🎲
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 leading-tight">
                  PlayMiso <span className="text-toy-orange text-xs font-bold uppercase">Admin</span>
                </h2>
                <p className="text-[10px] text-slate-500 font-medium">Discover the Magic of Play</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="space-y-1 text-xs font-bold">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:text-toy-orange hover:bg-orange-50/60 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-toy-orange" />
                <span>Dashboard Overview</span>
              </Link>

              <Link
                href="/admin/products"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:text-toy-orange hover:bg-orange-50/60 transition-colors"
              >
                <Package className="w-4 h-4 text-amber-500" />
                <span>Manage Products</span>
              </Link>

              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:text-toy-orange hover:bg-orange-50/60 transition-colors pl-6"
              >
                <PlusCircle className="w-3.5 h-3.5 text-toy-orange" />
                <span>Add New Toy (Page)</span>
              </Link>

              <Link
                href="/admin/products/import-export"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:text-toy-orange hover:bg-orange-50/60 transition-colors pl-6"
              >
                <span className="text-xs">📊</span>
                <span>Import / Export Excel</span>
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:text-toy-orange hover:bg-orange-50/60 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Orders (COD)</span>
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:text-toy-orange hover:bg-orange-50/60 transition-colors"
              >
                <Layers className="w-4 h-4 text-toy-blue" />
                <span>Categories</span>
              </Link>

              <Link
                href="/admin/banners"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:text-toy-orange hover:bg-orange-50/60 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-toy-yellow" />
                <span>Dynamic Banners</span>
              </Link>

              <Link
                href="/admin/coupons"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:text-toy-orange hover:bg-orange-50/60 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-toy-pink" />
                <span>Coupons & Discounts</span>
              </Link>

              <Link
                href="/admin/theme"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:text-toy-orange hover:bg-orange-50/60 transition-colors"
              >
                <Palette className="w-4 h-4 text-toy-pink" />
                <span>Theme & Festive Logo</span>
              </Link>

              <Link
                href="/admin/seo"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:text-toy-orange hover:bg-orange-50/60 transition-colors"
              >
                <Globe className="w-4 h-4 text-purple-600" />
                <span>SEO & Meta Portal</span>
              </Link>
            </nav>
          </div>

          {/* Bottom Store Link */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-[11px] text-emerald-950">
              <p className="font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Store Live & Active</span>
              </p>
              <p className="text-emerald-800 mt-0.5 text-[10px]">Payment: Cash on Delivery</p>
            </div>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-2xl text-xs tap-bounce transition-colors shadow-sm"
            >
              <Store className="w-4 h-4" />
              <span>Open Storefront ↗</span>
            </Link>
          </div>
        </aside>

        {/* Main Admin Content */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-x-hidden">
          {/* Top bar */}
          <header className="h-16 border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Admin Control Center</span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                White Theme Active
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin/products/new"
                className="bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 tap-bounce shadow-toy-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add New Toy</span>
              </Link>
              <Link
                href="/"
                className="md:hidden bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200"
              >
                Store ↗
              </Link>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </AdminAuthGate>
  );
}
