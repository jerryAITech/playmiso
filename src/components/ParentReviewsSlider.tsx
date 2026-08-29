'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Quote,
  Award,
} from 'lucide-react';

interface Review {
  id: string;
  name: string;
  city: string;
  childAge: string;
  toyBought: string;
  rating: number;
  text: string;
  avatarBg: string;
  initials: string;
  verified: boolean;
}

export default function ParentReviewsSlider() {
  const reviews: Review[] = [
    {
      id: '1',
      name: 'Priya Desai',
      city: 'Bengaluru',
      childAge: 'Son, 7 Years',
      toyBought: 'Solar System STEM Explorer Kit',
      rating: 5,
      text: 'Ordered the Solar System STEM kit via COD. Fast delivery in 2 days and the quality is outstanding! My son is completely hooked on star facts instead of mobile screens.',
      avatarBg: 'from-toy-orange to-pink-500',
      initials: 'PD',
      verified: true,
    },
    {
      id: '2',
      name: 'Amit & Ritu Verma',
      city: 'New Delhi',
      childAge: 'Daughter, 2 Years',
      toyBought: 'Giant 3-Foot Cuddle Teddy Bear',
      rating: 5,
      text: 'The jumbo plush teddy bear is so soft and 100% child-safe with no loose fibers. Paid cash at doorstep without any fuss. The best birthday gift we could ever give her!',
      avatarBg: 'from-purple-500 to-indigo-600',
      initials: 'AV',
      verified: true,
    },
    {
      id: '3',
      name: 'Sneha Kapoor',
      city: 'Pune',
      childAge: 'Twins, 5 Years',
      toyBought: 'Magnetic 3D Marble Run Blocks',
      rating: 5,
      text: 'The mobile shopping experience is super smooth. The magnetic building blocks have strong sealed magnets and keep both my kids happily engaged for hours!',
      avatarBg: 'from-emerald-500 to-teal-600',
      initials: 'SK',
      verified: true,
    },
    {
      id: '4',
      name: 'Rajesh Nair',
      city: 'Hyderabad',
      childAge: 'Son, 8 Years',
      toyBought: 'Monster 4WD RC Stunt Car',
      rating: 5,
      text: 'Super durable stunt car! It flips 360 degrees and drives over rugs and grass easily. The rechargeable battery pack is very convenient. 10/10 service from PlayMiso.',
      avatarBg: 'from-amber-500 to-orange-600',
      initials: 'RN',
      verified: true,
    },
    {
      id: '5',
      name: 'Ananya Sengupta',
      city: 'Kolkata',
      childAge: 'Daughter, 9 Years',
      toyBought: 'World Map Wooden Jigsaw Puzzle',
      rating: 5,
      text: 'Eco-friendly smooth wooden puzzle pieces with bright landmark illustrations. A great family bonding activity for weekends. Highly recommend PlayMiso toys!',
      avatarBg: 'from-rose-500 to-red-600',
      initials: 'AS',
      verified: true,
    },
    {
      id: '6',
      name: 'Vikram & Pooja Malhotra',
      city: 'Mumbai',
      childAge: 'Son, 4 Years',
      toyBought: 'Musical Dancing Robot with Laser Lights',
      rating: 5,
      text: 'Our 4-year-old dances along with the robot every evening! Sturdy build quality, smooth rounded corners, and fast 48-hour delivery with Cash on Delivery.',
      avatarBg: 'from-cyan-500 to-blue-600',
      initials: 'VM',
      verified: true,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalReviews = reviews.length;

  // 🚀 Automatic Scroll: advances slide automatically every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalReviews);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, totalReviews]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative bg-gradient-to-br from-white via-orange-50/40 to-purple-50/30 rounded-4xl p-6 sm:p-10 border border-slate-200/80 shadow-lg overflow-hidden space-y-6 select-none"
    >
      {/* Decorative Atmospheric Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-toy-yellow/20 to-toy-orange/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-black text-amber-900 shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>Trusted by 50,000+ Indian Parents</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Why Families Love Play<span className="text-toy-orange">Miso</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg">
            Real experiences from verified parents who choose PlayMiso for screen-free joyful childhood memories.
          </p>
        </div>

        {/* 4.9 Star Aggregate Rating Card */}
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200 shadow-xs shrink-0">
          <div className="text-3xl font-black text-slate-900 leading-none">4.9</div>
          <div>
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-500 mt-0.5 block">
              1,200+ Verified COD Reviews
            </span>
          </div>
        </div>
      </div>

      {/* 🎠 MULTI-CARD AUTOMATIC SCROLLING CAROUSEL TRACK */}
      <div className="relative overflow-hidden py-2 z-10">
        <div
          className="flex transition-transform duration-700 ease-in-out gap-4 sm:gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / (typeof window !== 'undefined' && window.innerWidth < 640 ? 1 : typeof window !== 'undefined' && window.innerWidth < 1024 ? 2 : 3))}%)`,
          }}
        >
          {/* Duplicate review list so track glides smoothly */}
          {[...reviews, ...reviews].map((rev, idx) => (
            <div
              key={`${rev.id}-${idx}`}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group relative shine-effect"
            >
              <Quote className="w-8 h-8 text-toy-orange/15 absolute top-4 right-4 pointer-events-none group-hover:text-toy-orange/30 transition-colors" />

              <div className="space-y-3">
                {/* 5 Stars Rating */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[11px] font-extrabold text-slate-800 ml-1.5">
                    5.0 • Verified
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic line-clamp-4">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              {/* Parent Info & Purchased Toy */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${rev.avatarBg} text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0 border border-white`}
                  >
                    {rev.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-slate-900 truncate">
                        {rev.name}
                      </h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold truncate">
                      📍 {rev.city} • <span className="text-toy-purple">{rev.childAge}</span>
                    </p>
                  </div>
                </div>

                <div className="text-[10px] font-bold text-toy-orange bg-orange-50/80 px-2 py-0.5 rounded-md truncate">
                  🧸 {rev.toyBought}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls Bar: Automatic Auto-Scroll Indicator & Next/Prev Arrows */}
      <div className="flex items-center justify-between pt-2 relative z-10">
        {/* Dot Indicators */}
        <div className="flex items-center gap-1.5">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to review slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                currentIndex === idx
                  ? 'w-7 bg-toy-orange shadow-xs'
                  : 'w-2 bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Auto-Scroll Status & Nav Arrows */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline-block">
            {isPaused ? '⏸️ Paused on hover' : '⚡ Auto-scrolling every 3.5s'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous Review"
              className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 flex items-center justify-center shadow-xs tap-bounce transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Review"
              className="w-9 h-9 rounded-xl bg-toy-orange hover:bg-orange-600 text-white flex items-center justify-center shadow-toy-sm tap-bounce transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
