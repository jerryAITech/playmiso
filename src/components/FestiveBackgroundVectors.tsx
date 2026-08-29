'use client';

import React from 'react';
import { useTheme } from '@/lib/theme-context';

export default function FestiveBackgroundVectors() {
  const { theme } = useTheme();

  // If no festive theme is active
  if (!theme || theme.festiveMode === 'NONE') {
    return null;
  }

  // 🪔 1. DIWALI THEME BACKGROUND VECTORS
  if (theme.festiveMode === 'DIWALI') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Top-Left Golden Rangoli Mandala Vector */}
        <div className="absolute -top-16 -left-16 w-64 h-64 opacity-15 text-amber-500 animate-spin" style={{ animationDuration: '60s' }}>
          <svg viewBox="0 0 200 200" fill="currentColor">
            <path d="M100,0 C120,40 160,40 200,100 C160,160 120,160 100,200 C80,160 40,160 0,100 C40,40 80,40 100,0 Z" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
        </div>

        {/* Top-Right Golden Diya Vector */}
        <div className="absolute top-20 right-4 sm:right-10 opacity-25 animate-float-slow text-amber-500">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C12 2 9 6 9 9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9C15 6 12 2 12 2Z" fill="#FFD23F" />
            <path d="M4 14C4 18.42 7.58 22 12 22C16.42 22 20 18.42 20 14H4Z" fill="#FF7844" />
          </svg>
        </div>

        {/* Bottom-Left Golden Diya Vector */}
        <div className="absolute bottom-24 left-4 sm:left-10 opacity-25 animate-float-slow text-amber-500" style={{ animationDelay: '2s' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C12 2 9 6 9 9C9 10.66 10.34 12 12 12C13.66 12 15 10.66 15 9C15 6 12 2 12 2Z" fill="#FFD23F" />
            <path d="M4 14C4 18.42 7.58 22 12 22C16.42 22 20 18.42 20 14H4Z" fill="#FF7844" />
          </svg>
        </div>

        {/* Floating Sparkles & Lanterns */}
        <div className="absolute top-1/4 left-1/12 text-lg sm:text-2xl opacity-40 animate-bounce" style={{ animationDuration: '4s' }}>
          🪔
        </div>
        <div className="absolute top-2/3 right-1/12 text-xl sm:text-2xl opacity-40 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1s' }}>
          ✨
        </div>
        <div className="absolute bottom-1/4 right-1/6 text-lg sm:text-2xl opacity-35 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}>
          🪔
        </div>
        <div className="absolute top-1/2 left-1/6 text-sm sm:text-xl opacity-35 animate-bounce" style={{ animationDuration: '6s', animationDelay: '1.5s' }}>
          ⭐
        </div>
      </div>
    );
  }

  // 🎅 2. CHRISTMAS THEME BACKGROUND VECTORS
  if (theme.festiveMode === 'CHRISTMAS') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Soft Frosty Snowflakes Falling */}
        <div className="absolute top-12 left-1/10 text-2xl opacity-45 animate-float-slow">❄️</div>
        <div className="absolute top-1/4 right-1/12 text-xl opacity-50 animate-float-slow" style={{ animationDelay: '1.2s' }}>❄️</div>
        <div className="absolute top-1/2 left-1/12 text-3xl opacity-40 animate-float-slow" style={{ animationDelay: '2.5s' }}>🎄</div>
        <div className="absolute top-2/3 right-1/8 text-2xl opacity-45 animate-float-slow" style={{ animationDelay: '0.8s' }}>⛄</div>
        <div className="absolute bottom-1/5 left-1/8 text-2xl opacity-45 animate-float-slow" style={{ animationDelay: '3s' }}>🎁</div>
        <div className="absolute bottom-1/3 right-1/12 text-xl opacity-50 animate-float-slow" style={{ animationDelay: '1.8s' }}>❄️</div>

        {/* Top-Right Christmas Tree Vector */}
        <div className="absolute top-20 right-6 opacity-20 text-emerald-600">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12,2 4,11 8,11 3,17 9,17 6,22 18,22 15,17 21,17 16,11 20,11" />
          </svg>
        </div>
      </div>
    );
  }

  // 🎆 3. NEW YEAR THEME BACKGROUND VECTORS
  if (theme.festiveMode === 'NEW_YEAR') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Glowing Fireworks & Celebrations */}
        <div className="absolute top-16 left-1/12 text-2xl opacity-50 animate-bounce" style={{ animationDuration: '3s' }}>🎆</div>
        <div className="absolute top-1/3 right-1/12 text-2xl opacity-50 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>🎉</div>
        <div className="absolute top-1/2 left-1/8 text-3xl opacity-45 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1.5s' }}>🎇</div>
        <div className="absolute top-3/4 right-1/6 text-2xl opacity-50 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '0.5s' }}>🥳</div>
        <div className="absolute bottom-1/6 left-1/12 text-2xl opacity-50 animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '2s' }}>⭐</div>

        {/* Firework Burst Vector */}
        <div className="absolute top-10 right-10 w-48 h-48 opacity-15 text-pink-500 animate-spin" style={{ animationDuration: '40s' }}>
          <svg viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="3" />
            <line x1="50" y1="10" x2="50" y2="30" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="50" y1="70" x2="50" y2="90" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="10" y1="50" x2="30" y2="50" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="70" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="20" y1="20" x2="35" y2="35" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="65" y1="65" x2="80" y2="80" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
          </svg>
        </div>
      </div>
    );
  }

  // 🎨 4. HOLI THEME BACKGROUND VECTORS
  if (theme.festiveMode === 'HOLI') {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Colorful Gulal Splash Vectors */}
        <div className="absolute top-20 left-1/12 text-2xl opacity-50 animate-float-slow">🎨</div>
        <div className="absolute top-1/3 right-1/12 text-3xl opacity-50 animate-float-slow" style={{ animationDelay: '1.5s' }}>🌈</div>
        <div className="absolute top-2/3 left-1/8 text-2xl opacity-45 animate-float-slow" style={{ animationDelay: '2s' }}>✨</div>
        <div className="absolute bottom-1/4 right-1/8 text-2xl opacity-50 animate-float-slow" style={{ animationDelay: '0.5s' }}>🎈</div>

        {/* Color Splash Blob Vector */}
        <div className="absolute top-16 right-8 w-60 h-60 opacity-15 text-pink-500">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <path d="M45,-75C58,-68,69,-56,76,-43C83,-29,85,-15,83,-1C81,13,74,27,66,40C57,53,46,67,32,74C18,81,1,82,-16,79C-33,76,-50,70,-62,58C-74,46,-81,29,-83,11C-85,-7,-81,-25,-72,-39C-63,-53,-49,-63,-35,-70C-21,-77,-6,-81,7,-79C20,-78,32,-82,45,-75Z" transform="translate(100 100)" />
          </svg>
        </div>
      </div>
    );
  }

  // 🪄 5. CUSTOM FESTIVE THEME BACKGROUND
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <div className="absolute top-20 left-1/12 text-2xl opacity-50 animate-bounce" style={{ animationDuration: '4s' }}>
        {theme.festiveLogoEmoji || '⚡'}
      </div>
      <div className="absolute top-1/3 right-1/12 text-2xl opacity-50 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1s' }}>
        {theme.festiveLogoEmoji || '🎁'}
      </div>
      <div className="absolute top-2/3 left-1/8 text-2xl opacity-45 animate-bounce" style={{ animationDuration: '5s', animationDelay: '1.5s' }}>
        ✨
      </div>
      <div className="absolute bottom-1/4 right-1/8 text-2xl opacity-50 animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '2s' }}>
        {theme.festiveLogoEmoji || '⭐'}
      </div>
    </div>
  );
}
