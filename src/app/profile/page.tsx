'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth, AddressType } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import {
  User,
  ShoppingBag,
  MapPin,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Package,
  Calendar,
  Phone,
  ArrowRight,
  ShieldCheck,
  Loader2,
  X,
} from 'lucide-react';
import { OrderType } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, addresses, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'account'>('orders');
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addrForm, setAddrForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    isDefault: false,
  });
  const [savingAddr, setSavingAddr] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchUserOrders() {
      if (!user) return;
      setLoadingOrders(true);
      try {
        const res = await fetch('/api/user/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    }

    if (user) {
      fetchUserOrders();
      setAddrForm((prev) => ({
        ...prev,
        fullName: user.name || '',
        phone: user.phone || '',
      }));
    }
  }, [user]);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrForm.fullName || !addrForm.phone || !addrForm.street || !addrForm.city || !addrForm.postalCode) {
      alert('Please fill all required fields');
      return;
    }

    setSavingAddr(true);
    const ok = await addAddress(addrForm);
    setSavingAddr(false);

    if (ok) {
      showToast('📍 New address saved to your profile!', 'success');
      setIsAddAddressOpen(false);
      setAddrForm({
        fullName: user?.name || '',
        phone: user?.phone || '',
        street: '',
        city: '',
        state: 'Maharashtra',
        postalCode: '',
        isDefault: false,
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Logged out successfully', 'info');
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-toy-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-toy-yellow/30 via-orange-100 to-pink-100 border-b border-slate-200/60 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center text-2xl sm:text-3xl font-black shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
                  <span className="bg-toy-orange text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                    {user.role === 'ADMIN' ? 'Store Admin' : 'Toy Club Member'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="bg-slate-900 hover:bg-slate-800 text-toy-yellow font-bold text-xs px-4 py-2.5 rounded-2xl tap-bounce shadow-sm"
                >
                  Admin Portal ↗
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 tap-bounce transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all tap-bounce shrink-0 ${
              activeTab === 'orders'
                ? 'bg-toy-orange text-white shadow-toy-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all tap-bounce shrink-0 ${
              activeTab === 'addresses'
                ? 'bg-toy-orange text-white shadow-toy-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all tap-bounce shrink-0 ${
              activeTab === 'account'
                ? 'bg-toy-orange text-white shadow-toy-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account Details</span>
          </button>
        </div>

        {/* TAB 1: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="p-12 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-toy-orange" />
                <span>Loading your toy orders...</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 text-toy-orange flex items-center justify-center text-3xl mx-auto">
                  📦
                </div>
                <h3 className="text-base font-black text-slate-900">No orders placed yet</h3>
                <p className="text-xs text-slate-500">
                  Explore our joyful toys and STEM kits to place your first Cash on Delivery order!
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-toy-orange text-white font-bold text-xs px-6 py-2.5 rounded-2xl shadow-toy-sm tap-bounce"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-toy-orange flex items-center justify-center font-bold">
                          🛍️
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Order ID</span>
                          <span className="font-mono font-black text-slate-900">{ord.orderNumber}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Order Date</span>
                          <span className="text-slate-700 font-semibold">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                            ord.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'SHIPPED'
                              ? 'bg-sky-100 text-sky-800'
                              : ord.status === 'PROCESSING'
                              ? 'bg-purple-100 text-purple-800'
                              : ord.status === 'CANCELLED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ord.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100"
                        >
                          {item.image && (
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
                              <Image src={item.image} alt={item.title} fill className="object-cover" sizes="48px" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                            <span className="text-[11px] text-slate-500">
                              Qty: {item.quantity} × ₹{item.price}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Summary */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                      <div className="text-slate-600">
                        <span>Delivery to: </span>
                        <strong className="text-slate-800">
                          {ord.address}, {ord.city}
                        </strong>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-slate-500">Total COD: </span>
                          <span className="text-base font-black text-toy-orange">₹{ord.totalAmount}</span>
                        </div>
                        <Link
                          href={`/order-success/${ord.orderNumber}`}
                          className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs tap-bounce hover:bg-slate-800"
                        >
                          Track Package
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Your Saved Addresses</h3>
                <p className="text-xs text-slate-500">
                  Select your primary delivery address for 1-click checkout.
                </p>
              </div>
              <button
                onClick={() => setIsAddAddressOpen(true)}
                className="bg-toy-orange hover:bg-toy-orange/90 text-white font-bold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm tap-bounce"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`bg-white rounded-3xl p-5 border-2 relative flex flex-col justify-between shadow-xs transition-all ${
                    addr.isDefault ? 'border-toy-orange bg-orange-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900">{addr.fullName}</h4>
                      {addr.isDefault ? (
                        <span className="bg-toy-orange text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[11px] font-bold text-slate-500 hover:text-toy-orange"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state} -{' '}
                      <strong className="text-slate-900">{addr.postalCode}</strong>
                    </p>

                    <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{addr.phone}</span>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Cash on Delivery Eligible</span>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Address Modal */}
            {isAddAddressOpen && (
              <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-base font-black text-slate-900">Add New Delivery Address</h3>
                    <button onClick={() => setIsAddAddressOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveAddress} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={addrForm.fullName}
                        onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={addrForm.phone}
                        onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
                      <textarea
                        rows={2}
                        required
                        value={addrForm.street}
                        onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                        placeholder="House/Flat No., Building name, Landmark"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={addrForm.city}
                          onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Pincode *</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={addrForm.postalCode}
                          onChange={(e) => setAddrForm({ ...addrForm, postalCode: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={addrForm.isDefault}
                        onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                        className="rounded border-slate-300 text-toy-orange focus:ring-toy-orange"
                      />
                      <span>Set as Default Delivery Address</span>
                    </label>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsAddAddressOpen(false)}
                        className="bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingAddr}
                        className="bg-toy-orange text-white font-bold text-xs px-6 py-2.5 rounded-xl hover:bg-toy-orange/90 flex items-center gap-1.5"
                      >
                        {savingAddr && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        <span>Save Address</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACCOUNT INFO */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 max-w-xl space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              Account Overview
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-bold">Registered Name:</span>
                <span className="font-bold text-slate-900">{user.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-bold">Email Address:</span>
                <span className="font-bold text-slate-900">{user.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-bold">Primary Phone:</span>
                <span className="font-bold text-slate-900">{user.phone || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500 font-bold">Account Role:</span>
                <span className="font-bold text-toy-orange uppercase">{user.role}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
