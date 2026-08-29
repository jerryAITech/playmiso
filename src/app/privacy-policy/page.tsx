import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | PlayMiso Toys',
  description: 'Learn how PlayMiso protects your data, ensures safe checkout, and safeguards children privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-toy-yellow/30 via-orange-100 to-pink-100 border-b border-slate-200/60 py-8 sm:py-12">
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black text-toy-orange uppercase tracking-wider">Legal & Trust</span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Privacy Policy</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-4xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-toy-orange" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              At PlayMiso (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we value the privacy of our young explorers and their parents. We collect only necessary details to process your orders and ensure smooth doorstep delivery:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li><strong>Contact Information:</strong> Name, phone number, delivery address, and email address.</li>
              <li><strong>Order Details:</strong> Items purchased, Cash on Delivery preferences, and order timestamps.</li>
              <li><strong>Device & Browsing Data:</strong> Anonymized browsing cookies to keep items in your shopping bag.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-toy-blue" />
              <span>2. Child Safety & COPPA Compliance</span>
            </h2>
            <p>
              PlayMiso is designed for parents, guardians, and gift-givers. We do not knowingly collect personal information directly from children under 13 without parental consent. All purchasing accounts must be managed by an adult.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>3. How We Use Your Data</span>
            </h2>
            <p>
              Your personal information is used strictly for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
              <li>Processing and dispatching your toy orders across India.</li>
              <li>Sending live WhatsApp/Email order receipts and courier tracking links.</li>
              <li>Providing dedicated customer helpdesk support.</li>
            </ul>
            <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-100 mt-2">
              🛡️ <strong>Zero Data Selling Guarantee:</strong> We never sell, rent, or trade your personal or contact information to any third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900">4. Contact Our Privacy Desk</h2>
            <p>
              If you have any questions or would like to request data deletion, reach out to our team at{' '}
              <a href="mailto:support@playmiso.in" className="text-toy-orange font-bold hover:underline">
                support@playmiso.in
              </a>.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
