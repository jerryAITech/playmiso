import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  Plus,
  Truck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  let totalOrders = 0;
  let orders: any[] = [];
  let totalProducts = 0;
  let lowStockProducts: any[] = [];
  let categoriesCount = 0;
  let totalRevenue = 0;
  let pendingOrdersCount = 0;

  try {
    const [
      dbTotalOrders,
      dbOrders,
      dbTotalProducts,
      dbLowStockProducts,
      dbCategoriesCount,
      dbRevenueAgg,
      dbPendingOrdersCount,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      prisma.product.count(),
      prisma.product.findMany({
        where: { stock: { lte: 15 } },
        orderBy: { stock: 'asc' },
        take: 4,
      }),
      prisma.category.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
      }),
      prisma.order.count({
        where: { status: 'PENDING' },
      }),
    ]);

    totalOrders = dbTotalOrders;
    orders = dbOrders;
    totalProducts = dbTotalProducts;
    lowStockProducts = dbLowStockProducts;
    categoriesCount = dbCategoriesCount;
    totalRevenue = dbRevenueAgg._sum.totalAmount || 0;
    pendingOrdersCount = dbPendingOrdersCount;
  } catch (error) {
    console.error('AdminDashboard fallback mode:', error);
  }

  const statCards = [
    {
      title: 'Total Revenue (COD)',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: 'Lifetime Collections',
      icon: TrendingUp,
      bgColor: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      pillBg: 'bg-emerald-50',
    },
    {
      title: 'Total Orders Placed',
      value: totalOrders.toString(),
      change: `${pendingOrdersCount} Pending Dispatch`,
      icon: ShoppingBag,
      bgColor: 'bg-toy-orange',
      textColor: 'text-orange-700',
      pillBg: 'bg-orange-50',
    },
    {
      title: 'Active Toy Catalog',
      value: totalProducts.toString(),
      change: `${categoriesCount} Categories`,
      icon: Package,
      bgColor: 'bg-toy-blue',
      textColor: 'text-blue-700',
      pillBg: 'bg-blue-50',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockProducts.length.toString(),
      change: 'Needs Restocking',
      icon: AlertTriangle,
      bgColor: 'bg-rose-500',
      textColor: 'text-rose-700',
      pillBg: 'bg-rose-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Store Performance Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics for your PlayMiso toy store & Cash on Delivery orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-toy-sm tap-bounce"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Toy</span>
          </Link>
          <Link
            href="/admin/orders"
            className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 tap-bounce"
          >
            <Truck className="w-4 h-4" />
            <span>Process Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-2xl ${card.bgColor} text-white flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {card.value}
                </h3>
                <span className={`inline-block text-[11px] font-bold ${card.textColor} ${card.pillBg} px-2.5 py-0.5 rounded-full mt-2`}>
                  {card.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders & Low Stock Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-toy-orange" />
              <span>Recent Customer Orders (COD)</span>
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-toy-orange hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-medium">
                No orders placed yet. Orders will appear here in real-time.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-slate-900">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        • {order.customerName} ({order.city})
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {order.items?.length || 1} items • ₹{order.totalAmount}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                      order.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'SHIPPED'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'CANCELLED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Watchlist (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Low Inventory Watchlist</span>
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-bold text-toy-orange hover:underline"
            >
              Manage &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8 text-emerald-600 text-xs font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>All toy inventories are well stocked!</span>
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs"
                >
                  <div className="min-w-0 flex-1 mr-3">
                    <h4 className="font-bold text-slate-900 truncate">{p.title}</h4>
                    <span className="text-[11px] text-slate-500">₹{p.price}</span>
                  </div>
                  <span className="text-[11px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                    ⚠️ {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
