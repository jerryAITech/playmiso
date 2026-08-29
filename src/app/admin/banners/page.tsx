'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  X,
  Sparkles,
  Loader2,
  ArrowRight,
} from 'lucide-react';

const GRADIENT_PRESETS = [
  { label: 'Sunset Amber & Orange', value: 'from-amber-400 via-orange-300 to-toy-orange' },
  { label: 'Cyber Sky & Emerald', value: 'from-sky-400 via-teal-300 to-emerald-400' },
  { label: 'Bubblegum Pink & Violet', value: 'from-pink-400 via-rose-300 to-purple-400' },
  { label: 'Royal Purple & Indigo', value: 'from-purple-500 via-indigo-400 to-blue-500' },
  { label: 'Sunny Yellow & Coral', value: 'from-yellow-300 via-amber-300 to-rose-400' },
];

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badgeText: 'MEGA TOY SALE • UP TO 40% OFF',
    ctaText: 'Shop All Toys',
    linkUrl: '/shop',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80',
    bgGradient: 'from-amber-400 via-orange-300 to-toy-orange',
    order: '1',
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      badgeText: 'MEGA TOY SALE • UP TO 40% OFF',
      ctaText: 'Shop All Toys',
      linkUrl: '/shop',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1000&q=80',
      bgGradient: 'from-amber-400 via-orange-300 to-toy-orange',
      order: (banners.length + 1).toString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || '',
      badgeText: b.badgeText || '',
      ctaText: b.ctaText || 'Shop Now',
      linkUrl: b.linkUrl || '/shop',
      image: b.image || '',
      bgGradient: b.bgGradient || 'from-amber-400 via-orange-300 to-toy-orange',
      order: (b.order || 1).toString(),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.image) return;

    setSubmitting(true);
    try {
      let res;
      if (editingBanner) {
        res = await fetch(`/api/banners/${editingBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchBanners();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete banner "${title}"?`)) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Dynamic Hero Banners</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage promotional hero carousel banners with images, headlines, and product links.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-xs px-5 py-3 rounded-2xl flex items-center gap-2 tap-bounce shadow-toy-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-6">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-toy-orange" />
            <span>Loading banners...</span>
          </div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs bg-white border border-slate-200 rounded-3xl">
            No banners created. Click &quot;Add New Banner&quot; to create one!
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Slide #{b.order || 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(b)}
                    className="p-2 text-slate-400 hover:text-toy-orange rounded-xl hover:bg-orange-50 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id, b.title)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Banner Visual Preview */}
              <div
                className={`relative rounded-3xl bg-gradient-to-r ${b.bgGradient} p-6 sm:p-8 overflow-hidden shadow-md border-2 border-white flex flex-col md:flex-row items-center justify-between gap-6`}
              >
                <div className="max-w-md space-y-2 z-10 text-slate-900">
                  {b.badgeText && (
                    <span className="inline-block bg-white/95 text-slate-900 font-black text-xs px-3 py-1 rounded-full shadow-xs">
                      {b.badgeText}
                    </span>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-black leading-tight text-slate-900">
                    {b.title}
                  </h3>
                  {b.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-900/90 font-medium">
                      {b.subtitle}
                    </p>
                  )}
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm">
                      <span>{b.ctaText || 'Shop Now'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {b.image && (
                  <div className="relative w-48 h-36 sm:w-64 sm:h-44 rounded-2xl overflow-hidden shadow-xl shrink-0 border-2 border-white">
                    <Image src={b.image} alt={b.title} fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Target Link: <strong className="text-slate-800 font-mono">{b.linkUrl}</strong></span>
                <span className="text-emerald-700 font-bold">✓ Active on Homepage Carousel</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">
                {editingBanner ? 'Edit Hero Banner' : 'Create New Hero Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ignite Imagination With Joyful STEM Kits!"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Motorized planets, building blocks & brain puzzles"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Promo Badge Text</label>
                <input
                  type="text"
                  placeholder="e.g. 🚀 MEGA TOY SALE • UP TO 40% OFF"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Background Gradient Theme</label>
                <select
                  value={formData.bgGradient}
                  onChange={(e) => setFormData({ ...formData, bgGradient: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                >
                  {GRADIENT_PRESETS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Link URL</label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="/shop or /category/..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-toy-orange text-white font-black text-xs px-6 py-2.5 rounded-xl hover:bg-toy-orange/90 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingBanner ? 'Update Banner' : 'Publish Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
