import React from 'react';
import Link from 'next/link';

interface AgeGroupFilterProps {
  selectedAge?: string;
}

const AGE_GROUPS = [
  { label: '0-2 Years', value: '0-2 Years', emoji: '🍼', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: '3-5 Years', value: '3-5 Years', emoji: '🎨', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { label: '6-8 Years', value: '6-8 Years', emoji: '🚀', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { label: '9+ Years', value: '9+ Years', emoji: '🎮', color: 'bg-purple-50 text-purple-700 border-purple-200' },
];

export default function AgeGroupFilter({ selectedAge }: AgeGroupFilterProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-3">
        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <span>Shop by Age</span>
        </h2>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-2 no-scrollbar">
        <Link
          href="/shop"
          className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all shrink-0 tap-bounce ${
            !selectedAge
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
          }`}
        >
          All Ages
        </Link>
        {AGE_GROUPS.map((group) => {
          const isSelected = selectedAge === group.value;
          return (
            <Link
              key={group.value}
              href={`/shop?age=${encodeURIComponent(group.value)}`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all shrink-0 tap-bounce ${
                isSelected
                  ? 'bg-toy-orange text-white border-toy-orange shadow-toy-sm'
                  : `${group.color} hover:shadow-sm`
              }`}
            >
              <span>{group.emoji}</span>
              <span>{group.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
