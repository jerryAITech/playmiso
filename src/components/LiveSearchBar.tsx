'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { ProductType } from '@/types';

interface LiveSearchBarProps {
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
}

export default function LiveSearchBar({
  placeholder = 'Search toys, lego, cars, teddy bears, puzzles...',
  className = '',
  isMobile = false,
}: LiveSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search query
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data: ProductType[] = await res.json();
          setResults(data.slice(0, 6)); // Top 6 matches
          setIsOpen(true);
        }
      } catch (e) {
        console.error('Live search error', e);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/product/${slug}`);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={query}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-slate-50 border border-slate-200 rounded-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-toy-orange focus:bg-white transition-all shadow-inner ${
            isMobile ? 'py-2.5 pl-10 pr-20' : 'py-2.5 pl-11 pr-24'
          }`}
        />

        <Search
          className={`text-slate-400 absolute top-1/2 -translate-y-1/2 ${
            isMobile ? 'left-3 w-4 h-4' : 'left-4 w-4 h-4'
          }`}
        />

        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-toy-orange mr-1" />}

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            className="bg-toy-orange hover:bg-toy-orange/90 text-white font-semibold text-xs px-3.5 py-1.5 rounded-full transition-colors tap-bounce"
          >
            Search
          </button>
        </div>
      </form>

      {/* Live Dropdown Results Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
          <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-toy-orange" />
              <span>Matching Toys ({results.length})</span>
            </span>
            <span className="text-[10px] text-slate-400">Click to view toy</span>
          </div>

          {results.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No toys found matching &quot;<strong className="text-slate-800">{query}</strong>&quot;.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto no-scrollbar">
              {results.map((product) => {
                let imgUrl = 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=150&q=80';
                try {
                  const parsed = JSON.parse(product.images);
                  if (Array.isArray(parsed) && parsed[0]) imgUrl = parsed[0];
                } catch {
                  if (product.images) imgUrl = product.images;
                }

                return (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug)}
                    className="p-3 hover:bg-orange-50/40 cursor-pointer flex items-center justify-between gap-3 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 group-hover:border-toy-orange transition-colors">
                        <Image src={imgUrl} alt={product.title} fill className="object-cover" sizes="48px" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-toy-orange transition-colors">
                          {product.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                            {product.category?.name || product.ageGroup}
                          </span>
                          {product.stock <= 5 && (
                            <span className="text-[10px] text-rose-600 font-bold">
                              Only {product.stock} left!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 block">₹{product.price}</span>
                      {product.discount && product.discount > 0 ? (
                        <span className="text-[10px] text-emerald-600 font-bold">
                          {product.discount}% OFF
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              <div
                onClick={handleSubmit}
                className="p-3 bg-slate-50 hover:bg-slate-100 cursor-pointer text-center text-xs font-bold text-toy-orange flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View all results for &quot;{query}&quot;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
