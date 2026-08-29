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
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [totalOrders, orders, totalProducts, lowStockProducts, categoriesCount] = await Promise.all([
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
  ]);

  const totalRevenue = (
    await prisma.order.aggregate({
      _sum: { totalAmount: true },
    })
  )._sum.totalAmount || 0;

  const pendingOrdersCount = await prisma.order.count({
    where: { status: 'PENDING' },
  });

  return (
    <div className="space-y-8">
      {/* Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Store Performance Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics for your toy eCommerce store & Cash on Delivery orders.
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
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-2xl border border-slate-200 tap-bounce shadow-xs"
          >
            View All Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total COD Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{totalRevenue.toLocaleString()}
            </span>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              ✓ 100% Cash on Delivery
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-toy-orange flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalOrders}</span>
            <p className="text-[11px] text-amber-600 font-bold mt-1">
              {pendingOrdersCount} Pending dispatch
            </p>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active Toys</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-toy-blue flex items-center justify-center font-bold">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalProducts}</span>
            <p className="text-[11px] text-slate-500 mt-1">{categoriesCount} Categories</p>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Low Stock Alert</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-rose-600">
              {lowStockProducts.length}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">Toys need replenishment</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Orders Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Recent COD Orders</h3>
              <p className="text-xs text-slate-500">Latest customer purchases</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-toy-orange hover:underline flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Total</th>
                  <th className="pb-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="py-3 font-mono font-bold text-toy-orange">
                      {order.orderNumber}
                    </td>
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500">{order.phone}</div>
                    </td>
                    <td className="py-3 font-bold text-slate-900">₹{order.totalAmount}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          order.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'SHIPPED'
                            ? 'bg-sky-100 text-sky-800'
                            : order.status === 'PROCESSING'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'CANCELLED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Low Stock Monitor */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900">Stock Warnings</h3>
            <p className="text-xs text-slate-500">Toys running low</p>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                  <span className="text-[11px] text-slate-500">Price: ₹{p.price}</span>
                </div>
                <div className="bg-rose-100 text-rose-700 text-xs font-black px-2.5 py-1 rounded-xl shrink-0">
                  {p.stock} Left
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/admin/products"
            className="block text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 rounded-2xl border border-slate-200 tap-bounce"
          >
            Manage Product Inventory
          </Link>
        </div>

      </div>
    </div>
  );
}
