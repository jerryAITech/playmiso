import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RotateCcw, Heart, Phone, Mail, MapPin } from 'lucide-react';
import { STORE_CONFIG } from '@/lib/store-config';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-toy-yellow via-toy-orange to-toy-pink flex items-center justify-center text-2xl shadow-toy-sm">
                🎲
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white leading-none">
                  Play<span className="text-toy-orange">Miso</span>
                </span>
                <span className="text-[10px] font-extrabold tracking-wider text-toy-yellow uppercase mt-0.5">
                  Discover the Magic of Play ✨
                </span>
              </div>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              PlayMiso is India&apos;s favorite destination for safe, creative, and joyful toys. Igniting young minds and discovering the pure magic of play every day.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Cash on Delivery (COD) Across India</span>
            </div>
          </div>

          {/* Quick Shop Links */}
          <div>
            <h4 className="text-white text-sm font-extrabold tracking-wider uppercase mb-4">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/educational-stem" className="hover:text-toy-yellow transition-colors">
                  Educational & STEM Kits
                </Link>
              </li>
              <li>
                <Link href="/category/soft-toys-plushies" className="hover:text-toy-yellow transition-colors">
                  Soft Toys & Teddy Bears
                </Link>
              </li>
              <li>
                <Link href="/category/rc-cars-vehicles" className="hover:text-toy-yellow transition-colors">
                  Remote Control & RC Cars
                </Link>
              </li>
              <li>
                <Link href="/category/puzzles-board-games" className="hover:text-toy-yellow transition-colors">
                  Puzzles & Board Games
                </Link>
              </li>
              <li>
                <Link href="/category/action-figures-heroes" className="hover:text-toy-yellow transition-colors">
                  Action Figures & Robots
                </Link>
              </li>
              <li>
                <Link href="/category/art-craft-clay" className="hover:text-toy-yellow transition-colors">
                  Art, Craft & Magic Clay
                </Link>
              </li>
            </ul>
          </div>

          {/* Age Filters */}
          <div>
            <h4 className="text-white text-sm font-extrabold tracking-wider uppercase mb-4">
              Shop By Age
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop?age=0-2+Years" className="hover:text-toy-yellow transition-colors">
                  🍼 Babies & Toddlers (0-2 Yrs)
                </Link>
              </li>
              <li>
                <Link href="/shop?age=3-5+Years" className="hover:text-toy-yellow transition-colors">
                  🎨 Preschoolers (3-5 Yrs)
                </Link>
              </li>
              <li>
                <Link href="/shop?age=6-8+Years" className="hover:text-toy-yellow transition-colors">
                  🚀 Early School (6-8 Yrs)
                </Link>
              </li>
              <li>
                <Link href="/shop?age=9%2B+Years" className="hover:text-toy-yellow transition-colors">
                  🎮 Big Kids & Teens (9+ Yrs)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-white text-sm font-extrabold tracking-wider uppercase mb-4">
              Customer Helpdesk
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-toy-yellow shrink-0" />
                <span>{STORE_CONFIG.whatsappDisplay} ({STORE_CONFIG.operatingHours})</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-toy-orange shrink-0" />
                <span>{STORE_CONFIG.supportEmail}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-toy-pink shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.officeAddress}</span>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
              >
                <span>🛡️ Store Admin Access</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} PlayMiso India Pvt Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping-returns" className="hover:text-white transition-colors">
              Shipping & Returns
            </Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
