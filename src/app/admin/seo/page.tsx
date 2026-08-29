'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Globe,
  Search,
  CheckCircle2,
  Share2,
  Sparkles,
  Loader2,
  FileText,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function AdminSeoPortalPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [seoData, setSeoData] = useState({
    siteTitle: '',
    metaDescription: '',
    keywords: '',
    ogImage: '',
    twitterHandle: '',
  });

  useEffect(() => {
    async function fetchSeo() {
      try {
        const res = await fetch('/api/seo');
        if (res.ok) {
          const data = await res.json();
          setSeoData({
            siteTitle: data.siteTitle || '',
            metaDescription: data.metaDescription || '',
            keywords: data.keywords || '',
            ogImage: data.ogImage || '',
            twitterHandle: data.twitterHandle || '',
          });
        }
      } catch (err) {
        console.error('Failed to load SEO settings', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSeo();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoData),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save SEO', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-toy-orange" />
        <span>Loading SEO Control Center...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-toy-orange uppercase tracking-wider mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Search Engine Optimization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">SEO & Social Meta Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your Google search rankings, Schema.org rich snippets, and social sharing previews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-1.5 tap-bounce shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-toy-orange" />
            <span>Sitemap.xml ↗</span>
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-1.5 tap-bounce shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Robots.txt ↗</span>
          </a>
        </div>
      </div>

      {/* SEO Health Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">Google Indexing</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-black text-slate-900">Enabled</p>
          <span className="text-[10px] text-emerald-700 font-semibold block">All pages crawlable</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">JSON-LD Schema</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-black text-slate-900">Product & Rating</p>
          <span className="text-[10px] text-amber-700 font-semibold block">Rich cards active</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">OpenGraph & Social</span>
            <Share2 className="w-4 h-4 text-toy-pink" />
          </div>
          <p className="text-lg font-black text-slate-900">WhatsApp & FB</p>
          <span className="text-[10px] text-toy-pink font-semibold block">Social tags ready</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-3xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">SSR Performance</span>
            <Zap className="w-4 h-4 text-toy-blue" />
          </div>
          <p className="text-lg font-black text-slate-900">Next.js 15 SSR</p>
          <span className="text-[10px] text-toy-blue font-semibold block">Instant server load</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: SEO Editor Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">Meta Tags Configuration</h3>
              {savedSuccess && (
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved Live!</span>
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Primary Meta Title (Appears on Google Search)
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${seoData.siteTitle.length > 60 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {seoData.siteTitle.length}/60 chars
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={seoData.siteTitle}
                  onChange={(e) => setSeoData({ ...seoData, siteTitle: e.target.value })}
                  placeholder="PlayMiso | Discover the Magic of Play (Cash On Delivery)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Meta Description (Google Snippet Summary)
                  </label>
                  <span className={`text-[10px] font-mono font-bold ${seoData.metaDescription.length > 160 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {seoData.metaDescription.length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={seoData.metaDescription}
                  onChange={(e) => setSeoData({ ...seoData, metaDescription: e.target.value })}
                  placeholder="Shop safe, educational, STEM kits, cuddly plushies, RC cars with Cash on Delivery across India."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Search Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={seoData.keywords}
                  onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                  placeholder="playmiso, toys online india, buy toys online, stem toys, soft toys"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  OpenGraph Social Share Image URL
                </label>
                <input
                  type="url"
                  value={seoData.ogImage}
                  onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-xs px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-toy-sm tap-bounce disabled:opacity-50"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save SEO Configuration</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Google SERP Preview */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-toy-orange" />
              <span>Google Search Card Preview</span>
            </span>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-toy-orange text-white flex items-center justify-center text-[9px] font-bold">
                  🧸
                </div>
                <div className="text-[11px] text-slate-600 truncate">
                  https://playmiso.com <span className="text-slate-400">› shop</span>
                </div>
              </div>
              <h4 className="text-sm font-semibold text-blue-800 line-clamp-1 hover:underline cursor-pointer">
                {seoData.siteTitle || 'PlayMiso | Discover the Magic of Play'}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 leading-snug">
                {seoData.metaDescription || 'Shop safe, educational, STEM kits, cuddly plushies, RC cars with Cash on Delivery.'}
              </p>
            </div>
          </div>

          {/* Social Share Preview (WhatsApp / Facebook) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-xs">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-toy-pink" />
              <span>WhatsApp / Social Media Share Preview</span>
            </span>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              {seoData.ogImage && (
                <div className="relative aspect-video w-full bg-slate-200">
                  <Image src={seoData.ogImage} alt="OG Preview" fill className="object-cover" />
                </div>
              )}
              <div className="p-3.5 bg-white space-y-1 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-mono">playmiso.com</span>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{seoData.siteTitle}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                  {seoData.metaDescription}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
