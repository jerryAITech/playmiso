'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from '@/components/ProductCard';
import { ProductType } from '@/types';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

interface AnimatedProductGridProps {
  initialProducts: ProductType[];
  totalCount?: number;
  categorySlug?: string;
  ageGroup?: string;
  query?: string;
  sort?: string;
  featured?: boolean;
  pageSize?: number;
}

export default function AnimatedProductGrid({
  initialProducts,
  totalCount = 0,
  categorySlug,
  ageGroup,
  query,
  sort,
  featured,
  pageSize = 8,
}: AnimatedProductGridProps) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    totalCount > initialProducts.length || initialProducts.length >= pageSize
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(true);
  const pageRef = useRef<number>(1);

  // Keep refs in sync
  loadingRef.current = loading;
  hasMoreRef.current = hasMore;
  pageRef.current = page;

  // Sync when initialProducts change (e.g. user changes filters/category)
  useEffect(() => {
    setProducts(initialProducts);
    setPage(1);
    const moreAvailable = totalCount > initialProducts.length || initialProducts.length >= pageSize;
    setHasMore(moreAvailable);
    hasMoreRef.current = moreAvailable;
    pageRef.current = 1;
  }, [initialProducts, totalCount, pageSize]);

  // Automated load next page function
  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    setLoading(true);
    loadingRef.current = true;

    try {
      const nextPage = pageRef.current + 1;
      const params = new URLSearchParams();
      params.set('page', nextPage.toString());
      params.set('limit', pageSize.toString());

      if (categorySlug) params.set('category', categorySlug);
      if (ageGroup) params.set('age', ageGroup);
      if (query) params.set('q', query);
      if (sort) params.set('sort', sort);
      if (featured) params.set('featured', 'true');

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const newProducts: ProductType[] = await res.json();
        if (newProducts.length === 0) {
          setHasMore(false);
          hasMoreRef.current = false;
        } else {
          setProducts((prev) => {
            // Deduplicate products by ID
            const existingIds = new Set(prev.map((p) => p.id));
            const uniqueNew = newProducts.filter((p) => !existingIds.has(p.id));
            return [...prev, ...uniqueNew];
          });
          setPage(nextPage);
          pageRef.current = nextPage;

          if (newProducts.length < pageSize) {
            setHasMore(false);
            hasMoreRef.current = false;
          }
        }
      } else {
        setHasMore(false);
        hasMoreRef.current = false;
      }
    } catch (err) {
      console.error('Error auto-loading toys on scroll:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [categorySlug, ageGroup, query, sort, featured, pageSize]);

  // 🚀 AUTOMATED SCROLL LISTENER (IntersectionObserver)
  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMoreRef.current && !loadingRef.current) {
          loadNextPage();
        }
      },
      {
        root: null,
        rootMargin: '200px', // Pre-fetch 200px before reaching bottom
        threshold: 0.1,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadNextPage]);

  return (
    <div className="space-y-8">
      {/* Grid with Cascading Scroll-Reveal Animation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {products.map((product, index) => {
          // Stagger delay based on index modulo for smooth wave entry
          const staggerDelay = `${(index % 8) * 60}ms`;

          return (
            <div
              key={`${product.id}-${index}`}
              style={{
                animationDelay: staggerDelay,
              }}
              className="animate-card-enter hover:-translate-y-1.5 transition-transform"
            >
              <ProductCard product={product} />
            </div>
          );
        })}
      </div>

      {/* Shimmer Skeleton Cards while auto-loading next batch */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 pt-2 animate-in fade-in">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl p-3.5 border border-slate-100 shadow-sm space-y-3 animate-pulse"
            >
              <div className="aspect-square bg-slate-200/70 rounded-2xl w-full" />
              <div className="space-y-2">
                <div className="h-3.5 bg-slate-200/80 rounded-full w-3/4" />
                <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
                <div className="h-4 bg-slate-200/60 rounded-full w-1/3 pt-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Automated Scroll Sentinel & Loader State (No manual button) */}
      <div ref={sentinelRef} className="py-6 flex flex-col items-center justify-center min-h-[60px]">
        {loading ? (
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-slate-200 shadow-md">
            <span className="text-xl animate-bounce">🎲</span>
            <Loader2 className="w-4 h-4 text-toy-orange animate-spin" />
            <span className="text-xs font-black bg-gradient-to-r from-toy-orange via-toy-pink to-toy-purple bg-clip-text text-transparent">
              Loading More Joyful Toys...
            </span>
          </div>
        ) : !hasMore && products.length > 0 ? (
          <div className="inline-flex items-center gap-2 bg-slate-100/90 text-slate-600 text-xs font-bold px-5 py-2.5 rounded-full border border-slate-200/80 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>You&apos;ve explored all {products.length} toys in this collection! ✨</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
