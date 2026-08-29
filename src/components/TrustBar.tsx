'use client';

import React from 'react';
import { Truck, ShieldCheck, Banknote, RotateCcw, Award } from 'lucide-react';

export default function TrustBar() {
  const items = [
    {
      icon: Truck,
      color: 'text-toy-orange bg-orange-50',
      title: 'Express Delivery',
      subtitle: 'Get your toys delivered fast!',
    },
    {
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50',
      title: '100% Kid Safe',
      subtitle: 'Non-toxic & BPA Free',
    },
    {
      icon: Banknote,
      color: 'text-amber-600 bg-amber-50',
      title: 'Cash on Delivery',
      subtitle: 'Pay when it arrives',
    },
    {
      icon: RotateCcw,
      color: 'text-toy-blue bg-teal-50',
      title: 'Easy 7-Day Return',
      subtitle: 'Hassle-free replacement',
    },
    {
      icon: Award,
      color: 'text-purple-600 bg-purple-50',
      title: 'Top Brand Quality',
      subtitle: 'Tested by Indian parents',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-3 sm:p-4 shadow-sm grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors ${
                idx === 4 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center shrink-0 shadow-xs`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-slate-900 truncate">{item.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
