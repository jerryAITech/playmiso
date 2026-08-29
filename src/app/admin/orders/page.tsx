'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Eye,
  X,
  Phone,
  MapPin,
  Calendar,
  Loader2,
} from 'lucide-react';
import { OrderType } from '@/types';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'Pending Dispatch', bg: 'bg-amber-100', text: 'text-amber-900' },
  PROCESSING: { label: 'Packing / In Progress', bg: 'bg-purple-100', text: 'text-purple-900' },
  SHIPPED: { label: 'Shipped (On the Way)', bg: 'bg-sky-100', text: 'text-sky-900' },
  DELIVERED: { label: 'Delivered & Paid', bg: 'bg-emerald-100', text: 'text-emerald-900' },
  CANCELLED: { label: 'Cancelled', bg: 'bg-rose-100', text: 'text-rose-900' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let url = '/api/orders';
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (searchQuery) params.append('q', searchQuery);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchQuery]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o)));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: updated.status } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Manage Orders (Cash on Delivery)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track customer shipments, process package dispatches, and verify delivered COD collections.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-2xl border border-slate-200 self-start sm:self-auto tap-bounce shadow-xs"
        >
          Refresh Orders
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Search by Order ID, name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-toy-orange focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
            {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                  statusFilter === st
                    ? 'bg-toy-orange text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-toy-orange" />
            <span>Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No orders found matching this status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Customer Info</th>
                  <th className="p-4 font-bold">Items</th>
                  <th className="p-4 font-bold">COD Amount</th>
                  <th className="p-4 font-bold">Status Action</th>
                  <th className="p-4 font-bold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-toy-orange block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-900">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500">{order.phone}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                          {order.city}, {order.state}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-1 rounded-lg text-[11px]">
                          {order.items?.length || 0} toys
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-black text-slate-900 text-sm">₹{order.totalAmount}</span>
                        <span className="text-[10px] text-emerald-600 block font-bold">COD</span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-2.5 text-[11px] font-bold focus:outline-none focus:ring-2 focus:ring-toy-orange ${cfg.bg} ${cfg.text}`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                          {updatingId === order.id && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-toy-orange" />
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 tap-bounce"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono text-toy-orange font-bold uppercase">
                  Order Details
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Customer</span>
                  <h4 className="text-sm font-bold text-slate-900">{selectedOrder.customerName}</h4>
                  <p className="text-slate-600 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedOrder.phone}</span>
                  </p>
                  {selectedOrder.email && (
                    <p className="text-slate-500 text-[11px]">{selectedOrder.email}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    STATUS_CONFIG[selectedOrder.status]?.bg || 'bg-slate-100'
                  } ${STATUS_CONFIG[selectedOrder.status]?.text || 'text-slate-800'}`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Delivery Address</span>
                <p className="text-slate-700 mt-0.5 leading-relaxed">
                  {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} -{' '}
                  {selectedOrder.postalCode}
                </p>
                {selectedOrder.notes && (
                  <p className="text-amber-800 text-[11px] mt-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <strong>Note:</strong> {selectedOrder.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Order Items ({selectedOrder.items?.length || 0})
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.image && (
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-200">
                          <Image src={item.image} alt={item.title} fill className="object-cover" sizes="36px" />
                        </div>
                      )}
                      <div>
                        <h5 className="font-bold text-slate-900 truncate max-w-xs">{item.title}</h5>
                        <span className="text-[10px] text-slate-500">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-600">Total COD Collectible:</span>
              <span className="text-xl font-black text-toy-orange">
                ₹{selectedOrder.totalAmount}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-100 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
