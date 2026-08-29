import React from 'react';
import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4 select-none">
      {/* Playful Bouncing Animated Toy */}
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-toy-yellow via-toy-orange to-toy-red flex items-center justify-center text-4xl shadow-xl animate-bounce">
          🧸
        </div>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-14 h-2 bg-slate-300/60 rounded-full blur-xs animate-pulse" />
      </div>

      {/* Brand Text */}
      <div className="text-center space-y-1">
        <h3 className="text-base font-black text-slate-900 flex items-center justify-center gap-1.5">
          <span>Loading Play</span>
          <span className="text-toy-orange">Miso</span>
          <Sparkles className="w-4 h-4 text-toy-orange animate-spin" />
        </h3>
        <p className="text-xs text-slate-500 font-medium animate-pulse">
          Discovering the Magic of Play...
        </p>
      </div>
    </div>
  );
}
