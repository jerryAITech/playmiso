'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import CouponBox from './CouponBox';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    originalMrpTotal,
    productDiscountSavings,
    couponDiscount,
    appliedCoupon,
    shippingFee,
    freeShippingThreshold,
    totalAmount,
  } = useCart();

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = freeShippingThreshold - subtotal;
  const totalCombinedSavings = productDiscountSavings + couponDiscount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 ease-out">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-toy-yellow/30 flex items-center justify-center text-slate-800">
                <ShoppingBag className="w-4 h-4 text-toy-orange" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Your Toy Bag ({cart.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-4 py-3 bg-amber-50/60 border-b border-amber-100/70">
            {amountToFreeShipping > 0 ? (
              <div className="text-xs text-amber-900 font-medium">
                Add <span className="font-bold text-toy-orange">₹{amountToFreeShipping}</span> more for{' '}
                <span className="font-bold text-emerald-600">FREE Delivery</span>!
              </div>
            ) : (
              <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>🎉 Yay! You unlocked FREE Delivery across India!</span>
              </div>
            )}
            <div className="w-full bg-amber-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-toy-yellow to-toy-green h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-4xl mb-4 shadow-inner">
                  🧸
                </div>
                <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Looks like you haven&apos;t picked any exciting toys yet! Explore our bestsellers and fun learning kits.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 bg-toy-orange text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-toy-sm hover:bg-toy-orange/90 tap-bounce"
                >
                  Explore Toys Now
                </button>
              </div>
            ) : (
              <>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 items-center relative group"
                  >
                    {/* Product Thumbnail */}
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=300&q=80'}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="text-[10px] uppercase font-bold text-toy-purple tracking-wider bg-purple-50 px-2 py-0.5 rounded-md">
                        {item.ageGroup}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate mt-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-slate-900">
                          ₹{item.price}
                        </span>
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{item.compareAtPrice}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-slate-900 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Coupon Box Component */}
                <div className="pt-2">
                  <CouponBox />
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3 shadow-lg">
              {/* Savings callout badge */}
              {totalCombinedSavings > 0 && (
                <div className="bg-emerald-50 text-emerald-800 rounded-xl p-2 text-xs font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Total Discount Savings:</span>
                  </span>
                  <span className="text-emerald-700 font-black">₹{totalCombinedSavings.toFixed(0)}</span>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Total MRP</span>
                  <span className="text-slate-500 line-through">₹{originalMrpTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Product Discounted Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-slate-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Payable (COD)</span>
                  <span className="text-toy-orange text-base">₹{totalAmount}</span>
                </div>
              </div>

              {/* COD Feature Tag */}
              <div className="bg-emerald-50/70 text-emerald-800 rounded-xl p-2 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-emerald-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Cash on Delivery (Pay at Doorstep) Available</span>
              </div>

              {/* Checkout Action Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full bg-toy-orange hover:bg-toy-orange/90 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce text-sm transition-all"
              >
                <span>Proceed to COD Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
