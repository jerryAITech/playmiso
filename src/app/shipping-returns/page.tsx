import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { Truck, RotateCcw, Clock, ShieldCheck, ArrowLeft, PackageCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping & Returns Policy | PlayMiso Toys',
  description: 'Fast pan-India delivery, Free Cash on Delivery, and 7-day hassle-free replacement policy at PlayMiso.',
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-100 via-teal-100 to-green-100 border-b border-slate-200/60 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">Fast & Hassle-Free</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Shipping & Returns</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-4xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-toy-orange" />
              <span>1. Fast Shipping Across India</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Metro Cities</span>
                <p className="font-black text-slate-900 text-base">2 to 3 Business Days</p>
                <p className="text-xs text-slate-500">Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Rest of India</span>
                <p className="font-black text-slate-900 text-base">3 to 5 Business Days</p>
                <p className="text-xs text-slate-500">All Tier 2, Tier 3 cities and regional PIN codes</p>
              </div>
            </div>
            <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              ✓ Free Delivery on all prepaid and Cash on Delivery orders!
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-toy-pink" />
              <span>2. 7-Day Hassle-Free Replacement Policy</span>
            </h2>
            <p>
              We want your child to love their new toy! If a product arrives damaged, defective, or with missing parts:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>Contact our WhatsApp support team within <strong>7 days</strong> of delivery with a quick photo or video.</li>
              <li>We will arrange a free reverse pickup and dispatch a brand new replacement immediately at no extra cost.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-toy-blue" />
              <span>3. Order Tracking</span>
            </h2>
            <p>
              Once your package is handed over to our courier partner (Delhivery / Bluedart / Expressbees), you will receive a direct tracking link on your WhatsApp and email.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
