'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, Rocket } from 'lucide-react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (currentScrollY > 320) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      if (totalScrollHeight > 0) {
        const progress = Math.min(100, Math.round((currentScrollY / totalScrollHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-7 z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-white/95 text-slate-800 hover:text-toy-orange rounded-full shadow-xl border-2 border-toy-orange/80 backdrop-blur-md tap-bounce hover:scale-110 transition-all cursor-pointer"
      >
        {/* Circular Scroll Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20"
            className="stroke-slate-100"
            strokeWidth="3"
            fill="transparent"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            className="stroke-toy-orange transition-all duration-150"
            strokeWidth="3"
            strokeDasharray={125.6}
            strokeDashoffset={125.6 - (125.6 * scrollProgress) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Animated Arrow / Rocket Icon */}
        <div className="relative flex flex-col items-center justify-center">
          <ArrowUp className="w-5 h-5 text-toy-orange group-hover:-translate-y-0.5 transition-transform stroke-[2.5]" />
        </div>

        {/* Floating Tooltip (Desktop) */}
        <span className="hidden sm:group-hover:block absolute -top-8 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap animate-in fade-in">
          Top 🚀
        </span>
      </button>
    </div>
  );
}
