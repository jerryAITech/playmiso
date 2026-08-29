'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, Plus, Minus, ShoppingBag } from 'lucide-react';
import { ProductType } from '@/types';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: ProductType;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, getItemQuantity, toggleWishlist, isInWishlist } = useCart();
  const isFav = isInWishlist(product.id);
  const qtyInCart = getItemQuantity(product.id);

  // Parse images JSON or fallback
  let imageList: string[] = [];
  try {
    imageList = JSON.parse(product.images);
  } catch {
    imageList = [product.images || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80'];
  }
  const mainImage = imageList[0] || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: mainImage,
      ageGroup: product.ageGroup,
      maxStock: product.stock,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-slate-100/90 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden shine-effect">
      {/* Wishlist Button (Positioned above image, outside Link) */}
      <button
        type="button"
        onClick={handleWishlist}
        className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-toy-pink shadow-md tap-bounce transition-all hover:scale-110 cursor-pointer"
        aria-label={isFav ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-300 ${
            isFav ? 'fill-toy-pink text-toy-pink scale-110 animate-bounce' : 'text-slate-500'
          }`}
        />
      </button>

      {/* Product Image Container */}
      <Link
        href={`/product/${product.slug}`}
        aria-label={`View details for ${product.title}`}
        className="relative aspect-square w-full overflow-hidden bg-slate-50 block"
      >
        <Image
          src={mainImage}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Discount Badge */}
        {product.discount && product.discount > 0 ? (
          <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-red-600 to-toy-red text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-xl shadow-md tracking-tight animate-pulse">
            {product.discount}% OFF
          </div>
        ) : null}

        {/* Age Group Tag */}
        <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md text-slate-800 text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-sm border border-slate-200/80">
          {product.ageGroup}
        </div>
      </Link>

      {/* Product Info Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span className="truncate max-w-[100px]">{product.brand || 'PlayMiso'}</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-toy-orange transition-colors leading-snug">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-slate-900">
                ₹{product.price}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price ? (
                <span className="text-[11px] text-slate-400 line-through">
                  ₹{product.compareAtPrice}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] font-bold text-emerald-600 block">COD Eligible</span>
          </div>

          {/* Interactive Cart Button or Quantity Selector (+ / -) */}
          {qtyInCart === 0 ? (
            <button
              onClick={handleQuickAdd}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-toy-yellow hover:bg-toy-orange text-slate-950 hover:text-white flex items-center justify-center shadow-toy-sm tap-bounce hover:scale-105 transition-all cursor-pointer"
              aria-label={`Add ${product.title} to bag`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          ) : (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="flex items-center bg-white text-slate-900 border-2 border-toy-orange rounded-2xl p-0.5 shadow-xs"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product.id, qtyInCart - 1);
                }}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-orange-50 hover:bg-orange-100 text-toy-orange flex items-center justify-center tap-bounce font-black text-xs transition-all cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>

              <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-black text-slate-900 font-mono">
                {qtyInCart}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(product.id, qtyInCart + 1);
                }}
                disabled={qtyInCart >= (product.stock || 99)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-toy-orange hover:bg-orange-600 text-white flex items-center justify-center tap-bounce font-black text-xs disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
