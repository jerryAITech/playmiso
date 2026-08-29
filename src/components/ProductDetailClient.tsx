'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Plus,
  Minus,
  Zap,
  Play,
  Film,
  Image as ImageIcon,
} from 'lucide-react';
import { ProductType } from '@/types';
import { useCart } from '@/lib/cart-context';

interface ProductDetailClientProps {
  product: ProductType;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist, setIsCartOpen } = useCart();
  const isFav = isInWishlist(product.id);

  let imageList: string[] = [];
  try {
    imageList = JSON.parse(product.images);
    if (!Array.isArray(imageList) || imageList.length === 0) {
      imageList = [product.images || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80'];
    }
  } catch {
    imageList = [product.images || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80'];
  }

  const [activeMedia, setActiveMedia] = useState<'image' | 'video'>('image');
  const [selectedImage, setSelectedImage] = useState(imageList[0] || '');
  const [quantity, setQuantity] = useState(1);

  // Format YouTube URL to embed if needed
  const getEmbedVideoUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  };

  const embedUrl = getEmbedVideoUrl(product.videoUrl);

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: selectedImage || imageList[0],
        ageGroup: product.ageGroup,
        maxStock: product.stock,
      },
      quantity
    );
  };

  const handleBuyNowCOD = () => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        image: selectedImage || imageList[0],
        ageGroup: product.ageGroup,
        maxStock: product.stock,
      },
      quantity
    );
    router.push('/checkout');
  };

  const savings =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice - product.price
      : 0;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Left: Interactive Media Gallery (Images + Video) */}
        <div className="space-y-3">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-md">
            
            {activeMedia === 'image' ? (
              <>
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {product.discount && product.discount > 0 ? (
                  <div className="absolute top-4 left-4 bg-toy-red text-white text-xs sm:text-sm font-black px-3 py-1 rounded-2xl shadow-sm tracking-tight">
                    {product.discount}% OFF
                  </div>
                ) : null}
              </>
            ) : embedUrl ? (
              <div className="w-full h-full bg-black flex items-center justify-center">
                {embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') ? (
                  <video src={embedUrl} controls autoPlay className="w-full h-full object-cover" />
                ) : (
                  <iframe
                    src={embedUrl}
                    title="Toy Demo Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>
            ) : null}

            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:text-toy-pink shadow-md tap-bounce transition-colors z-10"
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFav ? 'fill-toy-pink text-toy-pink' : 'text-slate-600'
                }`}
              />
            </button>
          </div>

          {/* Thumbnails Row: Images + Video Chip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            {imageList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedImage(img);
                  setActiveMedia('image');
                }}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                  activeMedia === 'image' && selectedImage === img
                    ? 'border-toy-orange ring-2 ring-toy-orange/30 scale-95'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" sizes="80px" />
              </button>
            ))}

            {/* Video Thumbnail Tab */}
            {product.videoUrl && (
              <button
                onClick={() => setActiveMedia('video')}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 flex flex-col items-center justify-center gap-1 transition-all ${
                  activeMedia === 'video'
                    ? 'border-toy-orange bg-orange-50 ring-2 ring-toy-orange/30 scale-95 text-toy-orange'
                    : 'border-slate-200 bg-amber-50 text-slate-800 hover:border-toy-orange'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span className="text-[10px] font-black uppercase">Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Product Information & Purchase Area */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category & Age badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-orange-50 text-toy-orange border border-orange-200 text-xs font-bold px-3 py-1 rounded-full">
                {product.category?.name || 'Toy Collection'}
              </span>
              <span className="bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold px-3 py-1 rounded-full">
                Age: {product.ageGroup}
              </span>
              {product.brand && (
                <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  By {product.brand}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-500">
                ({product.reviewsCount} verified parent reviews)
              </span>
            </div>

            {/* Price section */}
            <div className="bg-slate-50/80 p-4 rounded-3xl border border-slate-200/70 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">
                  ₹{product.price}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price ? (
                  <span className="text-base text-slate-400 line-through">
                    ₹{product.compareAtPrice}
                  </span>
                ) : null}
                {savings > 0 ? (
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                    Save ₹{savings}
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Inclusive of all taxes • <strong className="text-slate-800">Cash on Delivery Available</strong>
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Toy Features & Play Benefits
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Child Safety Callout */}
            <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">Safety Certified For Kids</h4>
                <p className="text-[11px] text-emerald-800">
                  {product.safetyInfo || '100% Non-Toxic materials, BPA Free, and child-safe rounded edges.'}
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-xs tap-bounce"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-black text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-xs tap-bounce"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-slate-500">
                ({product.stock} items available in stock)
              </span>
            </div>

          </div>

          {/* Desktop Purchase Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 hover:border-slate-400 font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 tap-bounce text-sm shadow-xs transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-toy-orange" />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuyNowCOD}
                className="w-full bg-toy-orange hover:bg-toy-orange/90 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce text-sm transition-all"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Buy Now (COD)</span>
              </button>
            </div>

            {/* Reassurance perks */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-toy-orange shrink-0" />
                <span>Free COD delivery on ₹499+</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-toy-blue shrink-0" />
                <span>7-Day Hassle-Free Replacement</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Bar on Mobile for 1-Tap Checkout */}
      <div className="md:hidden fixed bottom-16 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-30 flex items-center gap-3 shadow-lg">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] text-slate-400 block truncate">{product.title}</span>
          <span className="text-base font-black text-slate-900">₹{product.price * quantity}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-slate-100 text-slate-900 font-black text-xs px-4 py-3 rounded-2xl tap-bounce border border-slate-300"
        >
          Add to Bag
        </button>
        <button
          onClick={handleBuyNowCOD}
          className="bg-toy-orange text-white font-black text-xs px-5 py-3 rounded-2xl shadow-toy-colored tap-bounce"
        >
          Buy Now (COD)
        </button>
      </div>
    </>
  );
}
