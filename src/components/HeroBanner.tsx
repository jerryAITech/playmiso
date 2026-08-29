'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedToyCar from './AnimatedToyCar';

export interface BannerType {
  id: string;
  title: string;
  subtitle?: string | null;
  badgeText?: string | null;
  ctaText: string;
  linkUrl: string;
  image: string;
  bgGradient: string;
  order: number;
  isActive: boolean;
}

interface HeroBannerProps {
  initialBanners?: BannerType[];
}

const FALLBACK_BANNERS: BannerType[] = [
  {
    id: '1',
    title: 'Ignite Imagination With Joyful STEM Kits!',
    subtitle: 'Motorized planetary models, magnetic marble runs & brain puzzles for curious minds.',
    badgeText: '🚀 MEGA TOY SALE • UP TO 40% OFF',
    ctaText: 'Shop STEM Toys',
    linkUrl: '/category/educational-stem',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80',
    bgGradient: 'from-amber-400 via-orange-300 to-toy-orange',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    title: 'High-Speed 4WD Monster RC Stunt Cars!',
    subtitle: '360° stunt flipping, luminous LED headlights & 50m remote control range.',
    badgeText: '🏎️ TOP THRILL • CASH ON DELIVERY',
    ctaText: 'Explore RC Cars',
    linkUrl: '/category/rc-cars-vehicles',
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=1000&q=80',
    bgGradient: 'from-sky-400 via-teal-300 to-emerald-400',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    title: 'Super Soft Huggable Cuddle Plushies!',
    subtitle: '100% hypoallergenic, child-safe velvety teddy bears & comforting animal buddies.',
    badgeText: '❤️ 100% NEWBORN & TODDLER SAFE',
    ctaText: 'View Plushies',
    linkUrl: '/category/soft-toys-plushies',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=1000&q=80',
    bgGradient: 'from-pink-400 via-rose-300 to-purple-400',
    order: 3,
    isActive: true,
  },
];

export default function HeroBanner({ initialBanners }: HeroBannerProps) {
  const [banners, setBanners] = useState<BannerType[]>(
    initialBanners && initialBanners.length > 0 ? initialBanners : FALLBACK_BANNERS
  );
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch('/api/banners');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBanners(data);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (!initialBanners || initialBanners.length === 0) {
      fetchBanners();
    }
  }, [initialBanners]);

  // Autoplay carousel every 6 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const activeBanner = banners[currentSlide] || banners[0] || FALLBACK_BANNERS[0];

  return (
    <section className="relative overflow-hidden pt-3 sm:pt-6 pb-2">
      {/* Background Soft Blobs */}
      <div className="absolute top-0 -left-20 w-72 h-72 bg-toy-yellow/20 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-toy-pink/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Carousel Slide Card */}
        <div
          className={`relative rounded-3xl sm:rounded-4xl bg-gradient-to-r ${activeBanner.bgGradient} p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl border-2 border-white/60 transition-all duration-700 ease-out`}
        >
          {/* Animated floating badges & emojis */}
          <div className="absolute top-4 right-12 text-3xl sm:text-5xl animate-float-slow select-none opacity-80 pointer-events-none">
            🚀
          </div>
          <div className="absolute bottom-4 right-1/3 text-2xl sm:text-4xl animate-bounce-subtle select-none opacity-70 pointer-events-none">
            🎨
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {activeBanner.badgeText && (
                <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-slate-900 text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full shadow-sm">
                  <Sparkles className="w-4 h-4 text-toy-orange animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{activeBanner.badgeText}</span>
                </div>
              )}

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                {activeBanner.title}
              </h1>

              {activeBanner.subtitle && (
                <p className="text-xs sm:text-base text-slate-900/90 font-medium leading-relaxed max-w-lg">
                  {activeBanner.subtitle}
                </p>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={activeBanner.linkUrl}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-toy-sm flex items-center gap-2 tap-bounce transition-all"
                >
                  <span>{activeBanner.ctaText || 'Shop All Toys'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/shop"
                  className="bg-white/90 hover:bg-white text-slate-900 font-bold text-xs sm:text-sm px-5 sm:px-7 py-3.5 sm:py-4 rounded-2xl border border-white shadow-sm tap-bounce transition-all"
                >
                  Explore All Toys
                </Link>
              </div>
            </div>

            {/* Right: Featured High-Res Toy Image (5 cols) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-64 h-48 sm:w-80 sm:h-60 lg:w-96 lg:h-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500 bg-white">
                <Image
                  src={activeBanner.image}
                  alt={activeBanner.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-xl">
                  Cash on Delivery
                </div>
              </div>
            </div>

          </div>

          {/* Carousel Arrows & Dot Indicators */}
          {banners.length > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/30">
              <div className="flex items-center gap-1.5">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === idx ? 'w-8 bg-slate-900' : 'w-2 bg-slate-900/40 hover:bg-slate-900/70'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-xs tap-bounce transition-colors"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                  className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-xs tap-bounce transition-colors"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 🚗 ANIMATED MOVING TOY CAR ROAD */}
        <div className="mt-4 rounded-2xl overflow-hidden shadow-sm">
          <AnimatedToyCar />
        </div>

      </div>
    </section>
  );
}
