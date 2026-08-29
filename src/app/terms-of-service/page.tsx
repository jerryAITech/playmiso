import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { FileText, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | PlayMiso Toys',
  description: 'Terms and conditions for shopping at PlayMiso Toys Online Store.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-toy-blue/20 via-sky-100 to-indigo-100 border-b border-slate-200/60 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-toy-blue text-white rounded-2xl flex items-center justify-center shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black text-toy-blue uppercase tracking-wider">Legal Terms</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Terms of Service</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-4xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or purchasing from PlayMiso (&quot;playmiso.vercel.app&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">2. Orders & Cash on Delivery (COD) Policy</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>All Cash on Delivery orders require valid recipient contact details and complete delivery address with PIN code.</li>
              <li>PlayMiso reserves the right to confirm COD orders via phone call or WhatsApp message before dispatch.</li>
              <li>Customers must inspect the outer packaging at the time of delivery before releasing payment to the courier partner.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">3. Product Safety & Authenticity</h2>
            <p>
              All toys, games, STEM kits, and plushies sold on PlayMiso undergo strict quality checks and meet child-safe standards (non-toxic, BPA-free, rounded safety edges). Please always follow the recommended age groups displayed on the product packaging.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">4. Pricing & Availability</h2>
            <p>
              All prices are in Indian Rupees (₹ INR) and inclusive of all applicable taxes. We strive to maintain accurate inventory counts; however, in the rare event that an item goes out of stock after order placement, our support team will notify you immediately.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
