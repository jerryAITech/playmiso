'use client';

import React, { useState, useEffect } from 'react';
import { Tag, CheckCircle2, X, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CouponBox() {
  const { appliedCoupon, applyCoupon, removeCoupon, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch('/api/coupons');
        if (res.ok) {
          const data = await res.json();
          setAvailableCoupons(data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchCoupons();
  }, []);

  const handleApply = async (codeToApply?: string) => {
    const targetCode = codeToApply || couponCode;
    if (!targetCode.trim()) return;

    setLoading(true);
    await applyCoupon(targetCode.trim());
    setCouponCode('');
    setLoading(false);
  };

  return (
    <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
          <Tag className="w-3.5 h-3.5 text-toy-orange" />
          <span>Apply Promo Coupon</span>
        </div>
        {appliedCoupon && (
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Applied</span>
          </span>
        )}
      </div>

      {appliedCoupon ? (
        <div className="bg-white border border-emerald-300 rounded-xl p-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              🎉
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-black text-xs text-slate-900 uppercase">
                  {appliedCoupon.code}
                </span>
                <span className="text-[11px] font-bold text-emerald-600">
                  (Saved ₹{appliedCoupon.discountAmount})
                </span>
              </div>
              {appliedCoupon.description && (
                <p className="text-[10px] text-slate-500">{appliedCoupon.description}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            title="Remove Coupon"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter coupon code..."
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="flex-1 bg-white border border-amber-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-toy-orange uppercase shadow-inner"
          />
          <button
            type="button"
            onClick={() => handleApply()}
            disabled={loading || !couponCode.trim()}
            className="bg-toy-orange hover:bg-toy-orange/90 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs tap-bounce disabled:opacity-50 flex items-center gap-1"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
          </button>
        </div>
      )}

      {/* Clickable Quick Coupon Chips */}
      {!appliedCoupon && availableCoupons.length > 0 && (
        <div className="pt-1">
          <span className="text-[10px] font-bold text-slate-500 block mb-1.5">
            Tap to apply promo deals:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {availableCoupons.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleApply(c.code)}
                className="bg-white hover:bg-amber-100/80 border border-amber-300 text-slate-800 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 tap-bounce transition-colors"
              >
                <Sparkles className="w-2.5 h-2.5 text-toy-orange" />
                <span className="font-mono text-toy-orange">{c.code}</span>
                <span className="text-slate-500 font-normal">
                  ({c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
