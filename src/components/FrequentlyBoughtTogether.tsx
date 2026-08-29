'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, ShoppingBag, Sparkles, Gift } from 'lucide-react';
import { ProductType } from '@/types';
import { useCart } from '@/lib/cart-context';

interface FrequentlyBoughtTogetherProps {
  currentProduct: ProductType;
  bundleProduct?: ProductType | null;
}

export default function FrequentlyBoughtTogether({
  currentProduct,
  bundleProduct,
}: FrequentlyBoughtTogetherProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [includeBundle, setIncludeBundle] = useState(true);

  if (!bundleProduct) return null;

  let currentImage = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b';
  try {
    const parsed = JSON.parse(currentProduct.images);
    if (parsed[0]) currentImage = parsed[0];
  } catch {
    if (currentProduct.images) currentImage = currentProduct.images;
  }

  let bundleImage = 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f';
  try {
    const parsed = JSON.parse(bundleProduct.images);
    if (parsed[0]) bundleImage = parsed[0];
  } catch {
    if (bundleProduct.images) bundleImage = bundleProduct.images;
  }

  const bundleDiscount = 0.1; // Extra 10% bundle discount
  const originalCombinedPrice = currentProduct.price + bundleProduct.price;
  const discountedCombinedPrice = Math.round(originalCombinedPrice * (1 - bundleDiscount));
  const savings = originalCombinedPrice - discountedCombinedPrice;

  const handleAddBundleToBag = () => {
    // Add main product
    addToCart({
      id: currentProduct.id,
      title: currentProduct.title,
      slug: currentProduct.slug,
      price: currentProduct.price,
      compareAtPrice: currentProduct.compareAtPrice,
      image: currentImage,
      ageGroup: currentProduct.ageGroup,
      maxStock: currentProduct.stock,
    });

    // Add bundle product if selected
    if (includeBundle) {
      addToCart({
        id: bundleProduct.id,
        title: bundleProduct.title,
        slug: bundleProduct.slug,
        price: bundleProduct.price,
        compareAtPrice: bundleProduct.compareAtPrice,
        image: bundleImage,
        ageGroup: bundleProduct.ageGroup,
        maxStock: bundleProduct.stock,
      });
    }

    setIsCartOpen(true);
  };

  return (
    <div className="bg-gradient-to-br from-white to-orange-50/50 rounded-4xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center gap-2 text-toy-orange font-black text-xs uppercase tracking-wider">
        <Sparkles className="w-4 h-4" />
        <span>Frequently Bought Together</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Product Thumbnails + Plus operator */}
        <div className="flex items-center gap-3">
          {/* Main Product */}
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border-2 border-toy-orange shrink-0 shadow-xs">
              <Image src={currentImage} alt={currentProduct.title} fill className="object-cover" sizes="80px" />
            </div>
            <div className="max-w-[120px] sm:max-w-[140px]">
              <h4 className="text-xs font-bold text-slate-900 truncate">{currentProduct.title}</h4>
              <span className="text-xs font-black text-slate-800">₹{currentProduct.price}</span>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-600 shrink-0">
            +
          </div>

          {/* Bundle Item */}
          <div className="flex items-center gap-2">
            <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white border-2 ${includeBundle ? 'border-toy-orange' : 'border-slate-200 opacity-60'} shrink-0 shadow-xs transition-all`}>
              <Image src={bundleImage} alt={bundleProduct.title} fill className="object-cover" sizes="80px" />
            </div>
            <div className="max-w-[120px] sm:max-w-[140px]">
              <h4 className="text-xs font-bold text-slate-900 truncate">{bundleProduct.title}</h4>
              <span className="text-xs font-black text-slate-800">₹{bundleProduct.price}</span>
            </div>
          </div>
        </div>

        {/* Total Price & Add Both Action */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200/80 md:pl-6 shrink-0">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900">
                ₹{includeBundle ? discountedCombinedPrice : currentProduct.price}
              </span>
              {includeBundle && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{originalCombinedPrice}
                </span>
              )}
            </div>
            {includeBundle && (
              <span className="text-[11px] font-black text-emerald-600 block">
                Save ₹{savings} (Extra 10% Bundle Discount)
              </span>
            )}
          </div>

          <button
            onClick={handleAddBundleToBag}
            className="bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce transition-all shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{includeBundle ? 'Add Both To Bag' : 'Add Item To Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
