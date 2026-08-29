'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

import { useTheme } from '@/lib/theme-context';

interface PlayMisoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  isLink?: boolean;
}

export default function PlayMisoLogo({
  className = '',
  size = 'md',
  showTagline = true,
  isLink = true,
}: PlayMisoLogoProps) {
  const { theme } = useTheme();

  const iconSizes = {
    sm: 'w-8 h-8 text-lg rounded-xl',
    md: 'w-10 h-10 sm:w-11 sm:h-11 text-2xl rounded-2xl',
    lg: 'w-14 h-14 sm:w-16 sm:h-16 text-3xl sm:text-4xl rounded-3xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl',
  };

  // Determine icon to display (Festive Emoji or default toy dice)
  let mascotIcon = '🎲';
  if (theme.festiveMode === 'DIWALI') mascotIcon = '🪔';
  else if (theme.festiveMode === 'CHRISTMAS') mascotIcon = '🎅';
  else if (theme.festiveMode === 'NEW_YEAR') mascotIcon = '🎆';
  else if (theme.festiveMode === 'HOLI') mascotIcon = '🎨';
  else if (theme.festiveMode === 'CUSTOM' && theme.festiveLogoEmoji) mascotIcon = theme.festiveLogoEmoji;

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {/* 🎨 PlayMiso Iconic Magic Mascot Badge */}
      <div
        className={`relative ${iconSizes[size]} bg-gradient-to-tr from-toy-yellow via-toy-orange to-toy-pink flex items-center justify-center shadow-toy-sm group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shrink-0 border-2 border-white`}
      >
        <span className="select-none filter drop-shadow-xs">{mascotIcon}</span>
        
        {/* Festive or Magic Sparkle Pin */}
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-toy-yellow rounded-full flex items-center justify-center shadow-xs">
          <Sparkles className="w-2.5 h-2.5 text-slate-950 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      {/* Brand Typography & Tagline */}
      <div className="flex flex-col">
        <div className={`font-black tracking-tight leading-none text-slate-900 ${textSizes[size]} flex items-center gap-1.5`}>
          <span>Play</span>
          <span className="bg-gradient-to-r from-toy-orange via-toy-pink to-toy-purple bg-clip-text text-transparent">
            Miso
          </span>
          {theme.festiveMode !== 'NONE' && (
            <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-xs">
              SALE
            </span>
          )}
        </div>

        {showTagline && (
          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider bg-gradient-to-r from-toy-purple via-toy-pink to-toy-orange bg-clip-text text-transparent uppercase mt-0.5">
            {theme.festiveMode !== 'NONE' && theme.festiveBadgeText
              ? theme.festiveBadgeText
              : 'Discover the Magic of Play ✨'}
          </span>
        )}
      </div>
    </div>
  );

  if (!isLink) return content;

  return (
    <Link href="/" className="inline-block" aria-label="PlayMiso Homepage">
      {content}
    </Link>
  );
}
