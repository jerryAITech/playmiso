'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import CouponBox from '@/components/CouponBox';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Phone,
  User,
  MapPin,
  Mail,
  Loader2,
  Plus,
  LogIn,
  UserPlus,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    originalMrpTotal,
    productDiscountSavings,
    couponDiscount,
    appliedCoupon,
    shippingFee,
    totalAmount,
    clearCart,
    showToast,
  } = useCart();
  const { user, loading: authLoading, addresses, addAddress } = useAuth();

  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill from user profile or default address
  useEffect(() => {
    if (user) {
      if (addresses.length > 0) {
        const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
        setSelectedAddressId(defaultAddr.id);
        setFormData({
          customerName: defaultAddr.fullName || user.name,
          email: user.email,
          phone: defaultAddr.phone || user.phone || '',
          address: defaultAddr.street,
          city: defaultAddr.city,
          state: defaultAddr.state,
          postalCode: defaultAddr.postalCode,
          notes: '',
        });
        setUseNewAddress(false);
      } else {
        setFormData((prev) => ({
          ...prev,
          customerName: user.name,
          email: user.email,
          phone: user.phone || '',
        }));
        setUseNewAddress(true);
      }
    }
  }, [user, addresses]);

  const handleSelectAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    setUseNewAddress(false);
    const chosen = addresses.find((a) => a.id === addrId);
    if (chosen) {
      setFormData({
        customerName: chosen.fullName,
        email: user?.email || '',
        phone: chosen.phone,
        address: chosen.street,
        city: chosen.city,
        state: chosen.state,
        postalCode: chosen.postalCode,
        notes: '',
      });
      setErrors({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.customerName.trim()) errs.customerName = 'Please enter your full name';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Enter valid 10-digit mobile number';
    if (!formData.address.trim()) errs.address = 'Please enter full delivery street address';
    if (!formData.city.trim()) errs.city = 'Please enter city';
    if (!formData.postalCode.trim() || formData.postalCode.length < 6) errs.postalCode = 'Enter 6-digit Pincode';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('🔒 Please sign in before placing your order', 'warning');
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!validate()) return;
    if (cart.length === 0) {
      showToast('Your bag is empty!', 'warning');
      return;
    }

    setLoading(true);
    try {
      // If user is logged in and entered a new address, save it to their profile
      if (user && useNewAddress && saveToProfile) {
        await addAddress({
          fullName: formData.customerName,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          isDefault: addresses.length === 0,
        });
      }

      const payload = {
        userId: user.id,
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        notes: formData.notes,
        items: cart,
        subtotal,
        couponCode: appliedCoupon?.code || null,
        couponDiscount: couponDiscount,
        shippingFee,
        totalAmount,
        paymentMethod: 'COD',
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      showToast('🎉 Order placed successfully!', 'success');
      router.push(`/order-success/${data.orderNumber}`);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error creating order', 'warning');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-4xl mx-auto">
          🛍️
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your bag is empty</h2>
        <p className="text-xs text-slate-500">
          Add some joyful toys to your bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-toy-orange text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-toy-sm tap-bounce"
        >
          Explore Toys Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎲</span>
            <span className="font-black text-slate-900 text-lg">
              Play<span className="text-toy-orange">Miso</span> Checkout
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Secure COD</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* LOGIN GATE FOR GUEST USERS */}
        {!user && !authLoading && (
          <div className="bg-white rounded-4xl p-6 sm:p-10 border-2 border-toy-orange shadow-xl max-w-2xl mx-auto mb-8 text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-orange-100 text-toy-orange flex items-center justify-center text-3xl mx-auto shadow-inner">
              🔒
            </div>
            <div className="space-y-1">
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full uppercase">
                Login Required
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Please Sign In to Place Order
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Sign in to your PlayMiso account so you can track your shipment, view delivery updates, and manage your orders.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              <Link
                href="/login?redirect=/checkout"
                className="w-full sm:flex-1 bg-toy-orange hover:bg-toy-orange/90 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce text-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Account</span>
              </Link>
              <Link
                href="/signup?redirect=/checkout"
                className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 tap-bounce text-sm transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
              </Link>
            </div>
          </div>
        )}

        {/* LOGGED IN CHECKOUT FORM */}
        {user && (
          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Customer & Address Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* User Logged In Info Banner */}
              <div className="bg-white border border-slate-200 rounded-3xl p-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-toy-orange text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Ordering as {user.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  ✓ Verified Account
                </span>
              </div>

              {/* Saved Addresses Card (If user has saved addresses) */}
              {addresses.length > 0 && (
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-toy-orange" />
                      <h3 className="text-base font-extrabold text-slate-900">
                        Choose Delivery Address
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setUseNewAddress(!useNewAddress);
                        if (!useNewAddress) {
                          setFormData({
                            customerName: user.name,
                            email: user.email,
                            phone: user.phone || '',
                            address: '',
                            city: '',
                            state: 'Maharashtra',
                            postalCode: '',
                            notes: '',
                          });
                        }
                      }}
                      className="text-xs font-bold text-toy-orange hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{useNewAddress ? 'Use Saved Address' : 'Add New Address'}</span>
                    </button>
                  </div>

                  {!useNewAddress && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => handleSelectAddress(addr.id)}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-toy-orange bg-orange-50/30 shadow-xs'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-black text-slate-900">{addr.fullName}</span>
                              {addr.isDefault && (
                                <span className="bg-slate-100 text-slate-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2">
                              {addr.street}, {addr.city} - {addr.postalCode}
                            </p>
                            <span className="text-[11px] text-slate-500 font-medium block mt-1">
                              📞 {addr.phone}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Customer Contact & Delivery Input Form */}
              {(addresses.length === 0 || useNewAddress) && (
                <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                    <div className="w-7 h-7 rounded-xl bg-toy-orange text-white font-bold text-xs flex items-center justify-center">
                      1
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Delivery Address Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-toy-red">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleInputChange}
                          placeholder="e.g. Ananya Sharma"
                          className={`w-full bg-slate-50 border rounded-2xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange ${
                            errors.customerName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                          }`}
                        />
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.customerName && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.customerName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mobile Number (For Delivery SMS) <span className="text-toy-red">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. 9876543210"
                          maxLength={13}
                          className={`w-full bg-slate-50 border rounded-2xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange ${
                            errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                          }`}
                        />
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address (For Order Receipt)
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. ananya@example.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        House / Flat No., Building, Street Address <span className="text-toy-red">*</span>
                      </label>
                      <textarea
                        name="address"
                        rows={2}
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="e.g. Flat 301, Palm Heights, Near City Mall"
                        className={`w-full bg-slate-50 border rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange ${
                          errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-[11px] text-rose-500 mt-0.5">{errors.address}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        City <span className="text-toy-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Mumbai"
                        className={`w-full bg-slate-50 border rounded-2xl py-2.5 px-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange ${
                          errors.city ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                        }`}
                      />
                      {errors.city && (
                        <p className="text-[11px] text-rose-500 mt-0.5">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Pincode <span className="text-toy-red">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="6 digits"
                        maxLength={6}
                        className={`w-full bg-slate-50 border rounded-2xl py-2.5 px-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange ${
                          errors.postalCode ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                        }`}
                      />
                      {errors.postalCode && (
                        <p className="text-[11px] text-rose-500 mt-0.5">{errors.postalCode}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={saveToProfile}
                          onChange={(e) => setSaveToProfile(e.target.checked)}
                          className="rounded border-slate-300 text-toy-orange focus:ring-toy-orange"
                        />
                        <span>Save this address to my profile for future orders</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Choice (COD) */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                  <div className="w-7 h-7 rounded-xl bg-toy-orange text-white font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Payment Method
                  </h3>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      💵
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5">
                        <span>Cash on Delivery (COD)</span>
                        <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      </h4>
                      <p className="text-[11px] text-emerald-800 mt-0.5">
                        Pay via Cash or UPI scanner when the delivery executive arrives.
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>

            {/* Right: Order Summary Sidebar & Coupons */}
            <div className="lg:col-span-5 space-y-4">
              {/* Coupon Apply Box */}
              <CouponBox />

              {/* Order Price Details */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5 sticky top-24">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                  Order Summary ({cart.length} items)
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image
                          src={item.image || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=150&q=80'}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Qty: {item.quantity} × ₹{item.price}
                        </span>
                      </div>
                      <span className="text-xs font-black text-slate-900">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Calculation Breakdown */}
                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total MRP</span>
                    <span className="text-slate-400 line-through">₹{originalMrpTotal}</span>
                  </div>
                  {productDiscountSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Product Discounts</span>
                      <span>-₹{productDiscountSavings}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon ({appliedCoupon.code})</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charges</span>
                    <span className="font-bold text-slate-900">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-black">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-extrabold text-slate-900">Total Payable (COD)</span>
                    <span className="text-xl font-black text-toy-orange">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Total Savings Pill */}
                {productDiscountSavings + couponDiscount > 0 && (
                  <div className="bg-emerald-50 text-emerald-800 text-[11px] font-bold p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Your Total Savings:</span>
                    </span>
                    <span className="font-black text-emerald-700">
                      ₹{(productDiscountSavings + couponDiscount).toFixed(0)}
                    </span>
                  </div>
                )}

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-toy-orange hover:bg-toy-orange/90 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce text-sm disabled:opacity-50 transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Placing Your COD Order...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Place COD Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
