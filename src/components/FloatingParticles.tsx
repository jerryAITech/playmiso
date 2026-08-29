'use client';

import React from 'react';

export default function FloatingParticles() {
  const particles = [
    { emoji: '⭐', left: '8%', top: '15%', size: 'text-sm sm:text-base', delay: '0s', duration: '6s' },
    { emoji: '🎈', left: '88%', top: '22%', size: 'text-base sm:text-xl', delay: '1.5s', duration: '7s' },
    { emoji: '✨', left: '4%', top: '48%', size: 'text-xs sm:text-sm', delay: '2s', duration: '5s' },
    { emoji: '🚀', left: '92%', top: '65%', size: 'text-sm sm:text-lg', delay: '3s', duration: '8s' },
    { emoji: '🎨', left: '6%', top: '78%', size: 'text-sm sm:text-base', delay: '0.8s', duration: '6.5s' },
    { emoji: '⭐', left: '85%', top: '88%', size: 'text-xs sm:text-sm', delay: '2.5s', duration: '5.5s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {particles.map((p, idx) => (
        <div
          key={idx}
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
          className={`absolute ${p.size} opacity-35 hover:opacity-80 transition-opacity animate-float-slow filter drop-shadow-xs`}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
