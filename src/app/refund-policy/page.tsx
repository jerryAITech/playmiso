import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { RotateCcw, Banknote, ShieldCheck, Clock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';
import { STORE_CONFIG } from '@/lib/store-config';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | PlayMiso Toys',
  description: 'Learn about our 7-day hassle-free replacement guarantee, 100% full refund policy, and order cancellations at PlayMiso.',
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-pink-100 border-b border-slate-200/60 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-toy-orange text-white rounded-2xl flex items-center justify-center shadow-sm">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black text-toy-orange uppercase tracking-wider">Hassle-Free & Transparent</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Refund & Cancellation Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-4xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          
          {/* Highlight Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold text-2xl shrink-0 shadow-sm">
                🛡️
              </div>
              <div>
                <h3 className="text-base font-black text-emerald-950">
                  7-Day 100% Parent Satisfaction Guarantee
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  If a toy arrives damaged, missing parts, or defective, we offer free reverse pickup & instant replacement or full refund!
                </p>
              </div>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-toy-orange" />
              <span>1. 7-Day Replacement & Return Window</span>
            </h2>
            <p>
              At PlayMiso, we want every child to experience pure joy. If you receive a product that is:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li><strong>Damaged in Transit:</strong> Any broken plastic, damaged packaging, or courier handling defects.</li>
              <li><strong>Manufacturing Defect:</strong> Battery issue, non-functioning electronics, or missing accessories.</li>
              <li><strong>Incorrect Item Received:</strong> If the item delivered does not match your order summary.</li>
            </ul>
            <p className="text-xs text-slate-600 mt-2">
              Simply contact our WhatsApp support team at <strong>{STORE_CONFIG.whatsappDisplay}</strong> within <strong>7 calendar days</strong> of delivery with a short video or photo.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-600" />
              <span>2. Refund Processing Timeframe</span>
            </h2>
            <p>
              Once your return request is approved and the package is picked up by our courier executive:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Cash on Delivery (COD) Orders</span>
                <p className="font-black text-slate-900 text-sm">Instant UPI / Bank Transfer (24-48 Hours)</p>
                <p className="text-xs text-slate-500">Refund is sent directly to your Google Pay, PhonePe, Paytm, or Bank Account.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Online Prepaid Orders (Razorpay)</span>
                <p className="font-black text-slate-900 text-sm">Original Payment Source (3-5 Business Days)</p>
                <p className="text-xs text-slate-500">Credited back automatically to your Debit/Credit card or NetBanking account.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-toy-blue" />
              <span>3. Order Cancellation Policy</span>
            </h2>
            <p>
              You can cancel your order anytime <strong>before it is dispatched</strong> from our fulfillment center by clicking Cancel in your order tracking page or sending a WhatsApp message to our helpdesk. There are zero cancellation charges!
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">4. Contact Our Refund Desk</h2>
            <p>
              Have a question regarding your return or refund? Our dedicated team is available 7 days a week:
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 pt-1">
              <span>📞 WhatsApp / Call: <a href={`https://wa.me/${STORE_CONFIG.whatsappNumber}`} className="text-toy-orange hover:underline">{STORE_CONFIG.whatsappDisplay}</a></span>
              <span>•</span>
              <span>✉️ Email: <a href={`mailto:${STORE_CONFIG.supportEmail}`} className="text-toy-orange hover:underline">{STORE_CONFIG.supportEmail}</a></span>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
