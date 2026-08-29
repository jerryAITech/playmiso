'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Check,
  Sparkles,
  ArrowLeft,
  Gift,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import Footer from '@/components/Footer';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    originalMrpTotal,
    productDiscountSavings,
    couponDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    shippingFee,
    totalAmount,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const availableOffers = [
    {
      code: 'PLAYMISO10',
      title: 'Flat 10% OFF',
      desc: 'Exclusive storewide discount on all toys',
    },
    {
      code: 'FIRSTTOY',
      title: 'Flat ₹100 OFF',
      desc: 'Special welcome offer for new parents',
    },
    {
      code: 'FESTIVE20',
      title: 'Extra 20% OFF',
      desc: 'Festive season celebration discount',
    },
  ];

  const handleApplyCouponSubmit = async (codeToApply?: string) => {
    const targetCode = codeToApply || couponCode;
    if (!targetCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponError('');
    setCouponSuccess('');

    const res = await applyCoupon(targetCode.trim().toUpperCase());
    setCouponLoading(false);

    if (res.success) {
      setCouponSuccess(`🎉 Coupon "${targetCode.toUpperCase()}" applied successfully!`);
      setCouponCode('');
    } else {
      setCouponError(res.message || 'Invalid or expired coupon code');
    }
  };

  const totalCombinedSavings = productDiscountSavings + couponDiscount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-24 h-24 bg-white rounded-4xl flex items-center justify-center text-5xl mx-auto shadow-md border border-slate-200 animate-bounce">
            🧸
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Your Toy Bag is Empty
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Explore our magical collection of child-safe STEM kits, high-speed RC cars, and cuddly plushies with Cash on Delivery across India.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-toy-colored tap-bounce transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover Joyful Toys</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        
        {/* Header & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/shop"
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-toy-yellow to-toy-orange flex items-center justify-center text-slate-950 shadow-xs">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Shopping Bag ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h1>
            </div>
            <p className="text-xs text-slate-500 pl-10">
              Cash on Delivery (COD) Available • 100% Kid Safe & Verified
            </p>
          </div>

          <Link
            href="/shop"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-colors tap-bounce self-start sm:self-auto"
          >
            <span>+ Add More Toys</span>
          </Link>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow relative group"
              >
                {/* Thumbnail & Title */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-200">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b'}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    {item.ageGroup && (
                      <span className="text-[10px] font-extrabold text-toy-purple bg-purple-50 px-2 py-0.5 rounded-md uppercase">
                        {item.ageGroup}
                      </span>
                    )}
                    <Link href={`/product/${item.slug}`}>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-toy-orange transition-colors">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        ₹{item.price}
                      </span>
                      {item.compareAtPrice && item.compareAtPrice > item.price && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{item.compareAtPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Stepper & Remove Button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Stepper */}
                  <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-xs tap-bounce"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-black text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-xs tap-bounce"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Subtotal for item */}
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  {/* Trash Icon */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Coupons & Order Summary (5 Cols - Fixed/Sticky) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* 🏷️ PROMINENT PROMO & COUPON CENTER */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs sm:text-sm">
                  <Tag className="w-4 h-4 text-toy-orange" />
                  <span>Promo Codes & Coupons</span>
                </div>
                {appliedCoupon && (
                  <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Code Active
                  </span>
                )}
              </div>

              {/* Coupon Input Form */}
              {appliedCoupon ? (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-mono font-black text-xs text-emerald-900">
                      <span>🏷️ {appliedCoupon.code}</span>
                      <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-sans uppercase">
                        APPLIED
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-emerald-700">
                      You saved ₹{couponDiscount} on this order!
                    </p>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-white px-2.5 py-1 rounded-xl border border-rose-200 tap-bounce shadow-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER COUPON CODE"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
                    />
                    <button
                      type="button"
                      disabled={couponLoading || !couponCode.trim()}
                      onClick={() => handleApplyCouponSubmit()}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-5 py-3 rounded-2xl tap-bounce disabled:opacity-50 transition-all shadow-xs"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>

                  {couponSuccess && (
                    <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{couponSuccess}</span>
                    </div>
                  )}

                  {couponError && (
                    <div className="text-[11px] font-bold text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200 flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{couponError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 1-Click Available Offers Chips */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Available Offers (Click to Apply):
                </span>
                <div className="space-y-2">
                  {availableOffers.map((offer) => (
                    <div
                      key={offer.code}
                      onClick={() => handleApplyCouponSubmit(offer.code)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        appliedCoupon?.code === offer.code
                          ? 'border-emerald-500 bg-emerald-50/50'
                          : 'border-slate-200 bg-slate-50 hover:bg-orange-50/50 hover:border-toy-orange'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-black text-slate-900">
                            {offer.code}
                          </span>
                          <span className="text-[10px] font-bold text-toy-orange bg-orange-100 px-1.5 py-0.2 rounded">
                            {offer.title}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{offer.desc}</p>
                      </div>

                      <span className="text-[11px] font-black text-toy-orange hover:underline">
                        {appliedCoupon?.code === offer.code ? '✓ Applied' : 'Apply ➔'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY CARD */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Total MRP ({cart.reduce((a, b) => a + b.quantity, 0)} toys)</span>
                  <span>₹{originalMrpTotal}</span>
                </div>

                {productDiscountSavings > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Product Catalog Discount</span>
                    <span>-₹{productDiscountSavings}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Savings ({appliedCoupon?.code})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-600 font-bold">FREE (COD)</span>
                </div>
              </div>

              {totalCombinedSavings > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-[11px] font-black text-emerald-800 text-center">
                  🎉 Total Savings: ₹{totalCombinedSavings} on this order!
                </div>
              )}

              {/* Total Payable */}
              <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                <div className="space-y-0.5">
                  <span className="text-sm font-black text-slate-900">Total Payable Amount</span>
                  <span className="text-[10px] text-slate-400 block">Pay Cash or UPI at Delivery</span>
                </div>
                <span className="text-2xl font-black text-toy-orange">₹{totalAmount}</span>
              </div>

              {/* Checkout Action Button */}
              <Link
                href="/checkout"
                className="w-full bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-sm py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce transition-all"
              >
                <span>Proceed to Cash on Delivery (COD)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Reassurance Badges */}
              <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Kid Safe Materials</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-toy-blue shrink-0" />
                  <span>7-Day Easy Replacement</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}
