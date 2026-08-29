'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles, Star } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { ProductType } from '@/types';
import Footer from '@/components/Footer';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const allProducts: ProductType[] = await res.json();
          const favs = allProducts.filter((p) => wishlist.includes(p.id));
          setProducts(favs);
        }
      } catch (e) {
        console.error('Failed to fetch wishlist toys', e);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  const handleMoveToBag = (product: ProductType) => {
    let imageList: string[] = [];
    try {
      imageList = JSON.parse(product.images);
    } catch {
      imageList = [product.images];
    }

    addToCart({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: imageList[0] || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b',
      ageGroup: product.ageGroup,
      maxStock: product.stock,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/shop"
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-xs">
                <Heart className="w-5 h-5 fill-white text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                My Saved Toy Wishlist
              </h1>
            </div>
            <p className="text-xs text-slate-500 pl-10">
              {wishlist.length} {wishlist.length === 1 ? 'toy' : 'toys'} saved for your little ones.
            </p>
          </div>

          {wishlist.length > 0 && (
            <Link
              href="/shop"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-colors tap-bounce self-start sm:self-auto"
            >
              <span>Continue Shopping</span>
            </Link>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-4 border border-slate-200 animate-pulse space-y-3">
                <div className="aspect-square bg-slate-200 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                <div className="h-3 bg-slate-100 rounded-full w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-4xl p-10 sm:p-16 border border-slate-200 text-center max-w-lg mx-auto shadow-sm space-y-5">
            <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-xs text-pink-500 animate-bounce">
              ❤️
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Your Toy Wishlist is Empty
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our magical catalog of child-safe STEM kits, RC stunt cars, and soft plushies. Tap the heart icon on any toy to save it here!
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-toy-colored tap-bounce transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Joyful Toys</span>
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {products.map((product) => {
              let imageList: string[] = [];
              try {
                imageList = JSON.parse(product.images);
              } catch {
                imageList = [product.images];
              }
              const mainImage = imageList[0] || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b';

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                    <Link href={`/product/${product.slug}`}>
                      <Image
                        src={mainImage}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Remove Wishlist Button */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 text-rose-500 hover:bg-rose-50 shadow-md flex items-center justify-center tap-bounce transition-all"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {product.discount && product.discount > 0 && (
                      <div className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-xl shadow-xs">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Details & Actions */}
                  <div className="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {product.ageGroup}
                      </div>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-toy-orange transition-colors mt-0.5">
                          {product.title}
                        </h3>
                      </Link>
                      <div className="text-sm font-black text-slate-900 mt-1">
                        ₹{product.price}
                      </div>
                    </div>

                    <button
                      onClick={() => handleMoveToBag(product)}
                      className="w-full bg-toy-yellow hover:bg-toy-orange text-slate-950 hover:text-white font-black text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs tap-bounce transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
