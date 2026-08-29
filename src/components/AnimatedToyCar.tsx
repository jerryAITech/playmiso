'use client';

import React, { useState } from 'react';
import { Zap, Sparkles } from 'lucide-react';

export default function AnimatedToyCar() {
  const [speedBoost, setSpeedBoost] = useState(false);

  const handleCarClick = () => {
    setSpeedBoost(true);
    setTimeout(() => setSpeedBoost(false), 2500);
  };

  return (
    <div className="relative w-full overflow-hidden py-1.5 bg-slate-900/90 border-y border-slate-800 select-none">
      {/* Road Dashed Markings */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-around opacity-30 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="w-6 sm:w-10 h-0.5 bg-toy-yellow rounded-full" />
        ))}
      </div>

      {/* Moving Car Container */}
      <div
        onClick={handleCarClick}
        title="Click the toy car for Turbo Speed! 🏎️💨"
        className={`inline-flex items-center gap-2 cursor-pointer z-10 animate-car-drive ${
          speedBoost ? '[animation-duration:4s!important]' : ''
        }`}
      >
        {/* Exhaust Smoke */}
        <div className="relative w-4 h-4 flex items-center justify-center">
          <span className="absolute w-2 h-2 rounded-full bg-slate-400 animate-smoke" />
          <span className="absolute w-1.5 h-1.5 rounded-full bg-slate-300 animate-smoke [animation-delay:0.3s]" />
        </div>

        {/* The Animated SVG Toy Car */}
        <div className="relative animate-car-bounce">
          <svg
            width="56"
            height="28"
            viewBox="0 0 56 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            {/* Car Body (Sporty Toy Red) */}
            <path
              d="M4 18C4 18 8 18 10 18C12 11 16 6 24 6H34C40 6 44 10 46 16H52C54 16 55 17 55 19V22H1C1 20 2 18 4 18Z"
              fill="#FF3366"
            />
            {/* Yellow Racing Stripe */}
            <path d="M14 12H38L37 14H16L14 12Z" fill="#FFD23F" />
            {/* Windshield Glass */}
            <path
              d="M23 8H33C37 8 39.5 11 41 15H17C18.5 11 20.5 8 23 8Z"
              fill="#2EC4B6"
              fillOpacity="0.85"
            />
            {/* Driver Helmet (Cute Bear Driver) */}
            <circle cx="28" cy="11" r="3.5" fill="#FF7844" />
            <circle cx="27" cy="10" r="1" fill="#0E131F" />
            {/* Headlight Beam Glow */}
            <path d="M52 17L56 16L56 20L52 19Z" fill="#FFD23F" />
            <polygon points="56,16 68,12 68,24 56,20" fill="#FFD23F" fillOpacity="0.25" />
            {/* Back Wheel */}
            <g className="animate-wheel-spin origin-[12px_22px]">
              <circle cx="12" cy="22" r="5" fill="#0E131F" />
              <circle cx="12" cy="22" r="3" fill="#E2E8F0" />
              <circle cx="12" cy="22" r="1.5" fill="#FF7844" />
            </g>
            {/* Front Wheel */}
            <g className="animate-wheel-spin origin-[42px_22px]">
              <circle cx="42" cy="22" r="5" fill="#0E131F" />
              <circle cx="42" cy="22" r="3" fill="#E2E8F0" />
              <circle cx="42" cy="22" r="1.5" fill="#FF7844" />
            </g>
          </svg>

          {/* Speed Boost Sparkle */}
          {speedBoost && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-toy-yellow text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md animate-bounce">
              <Zap className="w-2.5 h-2.5 fill-slate-950" />
              <span>TURBO!</span>
            </div>
          )}
        </div>

        {/* Speech / Delivery Tag */}
        <span className="hidden sm:inline-block bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
          Express Toy Delivery ⚡
        </span>
      </div>
    </div>
  );
}
