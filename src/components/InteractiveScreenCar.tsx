'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  vx: number;
  vy: number;
}

export default function InteractiveScreenCar() {
  const [pos, setPos] = useState<Position>({ x: 80, y: 160 });
  const [facing, setFacing] = useState<number>(1); // 1 = right, -1 = left
  const [pitch, setPitch] = useState<number>(0); // gentle tilt angle, wheels always down!
  const [isDriving, setIsDriving] = useState<boolean>(true);
  const [isTurbo, setIsTurbo] = useState<boolean>(false);
  const [bubble, setBubble] = useState<string | null>(null);

  const posRef = useRef<Position>({ x: 80, y: 160 });
  // Constant steady velocity (constant speed and straight path between edges)
  const velRef = useRef<Velocity>({ vx: 2.5, vy: 1.2 });
  const isTurboRef = useRef<boolean>(false);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    // Set initial constant velocity
    velRef.current = { vx: 2.6, vy: 1.2 };

    const cruiseLoop = () => {
      const current = posRef.current;
      const vel = velRef.current;
      const speedMultiplier = isTurboRef.current ? 2.5 : 1.0;

      const carWidth = 64;
      const carHeight = 36;
      const minX = 10;
      const maxX = (window.innerWidth || 1200) - carWidth - 10;
      const minY = 75; // Stay below top header
      const maxY = (window.innerHeight || 800) - carHeight - 75; // Stay above bottom dock

      let newX = current.x + vel.vx * speedMultiplier;
      let newY = current.y + vel.vy * speedMultiplier;

      // 🛡️ DIRECTION ONLY CHANGES WHEN HITTING WINDOW SCREEN EDGES (No mid-screen changes):

      // 1. Hit Left Screen Boundary
      if (newX <= minX) {
        newX = minX;
        vel.vx = Math.abs(vel.vx); // Bounce to the right
      }
      // 2. Hit Right Screen Boundary
      else if (newX >= maxX) {
        newX = maxX;
        vel.vx = -Math.abs(vel.vx); // Bounce to the left
      }

      // 3. Hit Top Screen Boundary
      if (newY <= minY) {
        newY = minY;
        vel.vy = Math.abs(vel.vy); // Bounce downwards
      }
      // 4. Hit Bottom Screen Boundary
      else if (newY >= maxY) {
        newY = maxY;
        vel.vy = -Math.abs(vel.vy); // Bounce upwards
      }

      // Orientation is 100% upright:
      // Facing: 1 (right) or -1 (left)
      const currentFacing = vel.vx >= 0 ? 1 : -1;
      
      // Pitch: gentle tilt according to vertical slope (-15deg to +15deg, wheels always down)
      const slope = vel.vy / (Math.abs(vel.vx) || 1);
      const currentPitch = Math.max(-15, Math.min(15, slope * 14));

      posRef.current = { x: newX, y: newY };
      velRef.current = vel;

      setPos({ x: newX, y: newY });
      setFacing(currentFacing);
      setPitch(currentPitch);
      setIsDriving(true);

      animRef.current = requestAnimationFrame(cruiseLoop);
    };

    animRef.current = requestAnimationFrame(cruiseLoop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Click on the toy car to trigger Turbo speed burst & honk
  const handleCarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTurbo(true);
    isTurboRef.current = true;
    setBubble('BEEP BEEP! 🚗💨');

    setTimeout(() => {
      setIsTurbo(false);
      isTurboRef.current = false;
      setBubble(null);
    }, 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        zIndex: 48,
        pointerEvents: 'none',
        transition: 'none',
      }}
      className="select-none"
    >
      {/* Speech Bubble above car */}
      {bubble && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-toy-yellow flex items-center gap-1 animate-bounce pointer-events-none z-10">
          <Sparkles className="w-3 h-3 text-toy-yellow" />
          <span>{bubble}</span>
        </div>
      )}

      {/* 🚗 100% Upright Car Container (scaleX flips left/right, pitch tilts slightly, wheels always down) */}
      <div
        onClick={handleCarClick}
        style={{
          transform: `scaleX(${facing}) rotate(${pitch}deg)`,
          transformOrigin: '32px 18px',
          pointerEvents: 'auto',
        }}
        className="relative group cursor-pointer p-1 tap-bounce"
        title="PlayMiso RC Car (Edge-to-Edge Screen Cruising)"
      >
        {/* Exhaust Smoke Trail */}
        {isDriving && (
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400/80 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-slate-300 animate-smoke" />
          </div>
        )}

        {/* 🏎️ Sport RC Stunt Car SVG */}
        <div className="relative filter drop-shadow-xl transition-transform hover:scale-110 active:scale-95">
          <svg
            width="64"
            height="36"
            viewBox="0 0 64 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Aerodynamic Body Shell */}
            <path
              d="M6 24C6 24 10 24 12 24C14 15 19 9 29 9H41C48 9 52 14 55 21H60C62 21 63 22 63 24V27H3C3 25 4 24 6 24Z"
              fill="#FF7844"
            />
            {/* Sport Racing Stripes */}
            <path d="M18 15H46L44 19H20L18 15Z" fill="#FFD23F" />
            
            {/* Windshield Cockpit */}
            <path
              d="M28 11H39C43 11 46 14 48 19H22C24 14 26 11 28 11Z"
              fill="#2EC4B6"
            />

            {/* Playful Mascot Driver */}
            <circle cx="33" cy="14.5" r="4" fill="#F72585" />
            <circle cx="32" cy="13.5" r="1.2" fill="#FFFFFF" />

            {/* Headlights Beam Projector (Forward Glowing) */}
            <polygon points="63,22 80,16 80,32 63,26" fill="#FFD23F" fillOpacity="0.4" />

            {/* Rear Sport Wheel with Spinning Rims */}
            <g className={isDriving ? 'animate-wheel-spin origin-[15px_27px]' : ''}>
              <circle cx="15" cy="27" r="6" fill="#0E131F" />
              <circle cx="15" cy="27" r="3.5" fill="#E2E8F0" />
              <circle cx="15" cy="27" r="1.8" fill="#FF3366" />
            </g>

            {/* Front Sport Wheel with Spinning Rims */}
            <g className={isDriving ? 'animate-wheel-spin origin-[50px_27px]' : ''}>
              <circle cx="50" cy="27" r="6" fill="#0E131F" />
              <circle cx="50" cy="27" r="3.5" fill="#E2E8F0" />
              <circle cx="50" cy="27" r="1.8" fill="#FF3366" />
            </g>
          </svg>

          {isTurbo && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-toy-yellow text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md flex items-center gap-0.5 animate-bounce">
              <Zap className="w-2.5 h-2.5 fill-current" />
              <span>TURBO</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
