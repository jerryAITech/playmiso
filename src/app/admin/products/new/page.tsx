'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Package,
  Sparkles,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  ShieldCheck,
  Tag,
  Search,
  Globe,
  Share2,
  Wand2,
} from 'lucide-react';
import { CategoryType, ProductType } from '@/types';
import FileUpload from '@/components/FileUpload';

export default function AddNewToyPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    compareAtPrice: '',
    discount: 0,
    images: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80',
    videoUrl: '',
    categoryId: '',
    ageGroup: '3-5 Years',
    stock: '20',
    brand: 'PlayMiso',
    safetyInfo: '100% Non-Toxic, BPA Free, Safe child-friendly edges',
    isFeatured: true,
    isTrending: false,
    isBestseller: false,
    // Per-Product SEO fields
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    ogImage: '',
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (data.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  // Calculate discount percentage automatically
  const priceNum = parseFloat(formData.price) || 0;
  const mrpNum = parseFloat(formData.compareAtPrice) || 0;
  const calculatedDiscount = mrpNum > priceNum && priceNum > 0 ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

  // 1-Click SEO Auto-Generator
  const handleAutoGenerateSeo = () => {
    if (!formData.title) {
      alert('Please enter a Toy Product Title first!');
      return;
    }

    const selectedCat = categories.find((c) => c.id === formData.categoryId)?.name || 'Toys';
    const firstImage = formData.images.split(/[\n,]+/)[0]?.trim() || '';

    const generatedTitle = `Buy ${formData.title} Online in India | PlayMiso COD`;
    const generatedDesc = `Shop ${formData.title} at best price ₹${formData.price || '999'}. ${selectedCat} for kids (${formData.ageGroup}). 100% Kid-Safe, Cash On Delivery & Fast Shipping across India.`;
    const generatedKeywords = `${formData.title.toLowerCase()}, buy ${formData.title.toLowerCase()}, ${selectedCat.toLowerCase()}, toys for ${formData.ageGroup.toLowerCase()}, cod toys`;

    setFormData((prev) => ({
      ...prev,
      metaTitle: generatedTitle.substring(0, 65),
      metaDescription: generatedDesc.substring(0, 160),
      metaKeywords: generatedKeywords,
      ogImage: firstImage || prev.ogImage,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.categoryId) {
      setError('Please fill in all required fields (Title, Category, Price)');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const imageList = formData.images
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        discount: calculatedDiscount,
        stock: parseInt(formData.stock) || 0,
        images: JSON.stringify(imageList.length > 0 ? imageList : [formData.images]),
        metaTitle: formData.metaTitle || null,
        metaDescription: formData.metaDescription || null,
        metaKeywords: formData.metaKeywords || null,
        canonicalUrl: formData.canonicalUrl || null,
        ogImage: formData.ogImage || (imageList[0] ?? null),
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to create toy product');
      }
    } catch (err: any) {
      setError(err.message || 'Network error creating toy');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400 text-xs font-semibold flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-toy-orange" />
        <span>Loading product form...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products Inventory</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Add New Toy to Store
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create a new toy product with images, pricing, safety certificates, age tags, and custom SEO.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-2xl font-semibold">
          {error}
        </div>
      )}

      {/* Main White Card Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Package className="w-4 h-4 text-toy-orange" />
            <span>1. Product Details</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Toy Product Title <span className="text-toy-red">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 4WD All-Terrain Monster Stunt RC Car"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category <span className="text-toy-red">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Age Recommendation <span className="text-toy-red">*</span>
              </label>
              <select
                value={formData.ageGroup}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
              >
                <option value="0-2 Years">0-2 Years (Babies / Toddlers)</option>
                <option value="3-5 Years">3-5 Years (Preschoolers)</option>
                <option value="6-8 Years">6-8 Years (Early School)</option>
                <option value="9+ Years">9+ Years (Big Kids / Teens)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Toy Description & Features
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explain how the toy works, battery requirements, educational benefits, and materials used..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Stock */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>2. Pricing & Stock Inventory</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Selling Price (₹) <span className="text-toy-red">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1299"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                MRP / Compare Price (₹)
              </label>
              <input
                type="number"
                min="1"
                value={formData.compareAtPrice}
                onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                placeholder="1999"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Initial Stock Count <span className="text-toy-red">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="20"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
              />
            </div>
          </div>

          {calculatedDiscount > 0 && (
            <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-2xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                Calculated Discount: <strong>{calculatedDiscount}% OFF</strong> (Customer saves ₹
                {mrpNum - priceNum})
              </span>
            </div>
          )}
        </div>

        {/* Section 3: Multiple Images & Product Video */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <ImageIcon className="w-4 h-4 text-toy-blue" />
            <span>3. Product Images & Demo Video</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Image File Uploader */}
            <FileUpload
              label="Upload Toy Image (Local File / Phone)"
              acceptType="image"
              helperText="Upload JPG, PNG, or WebP photo of the toy"
              onUploadSuccess={(url) => {
                if (url) {
                  setFormData((prev) => ({
                    ...prev,
                    images: prev.images ? `${prev.images}\n${url}` : url,
                  }));
                }
              }}
            />

            {/* 30s Demo Video Uploader */}
            <FileUpload
              label="Upload Toy Demo Video (Max 30s)"
              acceptType="video"
              maxVideoDurationSeconds={30}
              helperText="Upload short unboxing/movement clip (Trimmed to max 30s)"
              onUploadSuccess={(url) => {
                setFormData((prev) => ({ ...prev, videoUrl: url }));
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Image URLs (Enter 1 URL per line or comma-separated) <span className="text-toy-red">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              💡 You can choose local files above or paste multiple image URLs here for the product gallery.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Demo Video URL (YouTube Embed or Direct Video Link)
            </label>
            <input
              type="url"
              value={formData.videoUrl || ''}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ or /uploads/my-video.mp4"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              🎥 Customers can click the &quot;Watch Video&quot; tab on the product page to see the toy in action!
            </p>
          </div>
        </div>

        {/* Section 4: Brand & Safety Certification */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>4. Brand & Child Safety Assurance</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="PlayMiso"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Child Safety Certification Tag
              </label>
              <input
                type="text"
                value={formData.safetyInfo}
                onChange={(e) => setFormData({ ...formData, safetyInfo: e.target.value })}
                placeholder="100% Non-Toxic, BPA Free, Safe for Kids"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
              />
            </div>
          </div>

          {/* Badges Toggles */}
          <div className="flex flex-wrap gap-5 pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-slate-300 text-toy-orange focus:ring-toy-orange"
              />
              <span>Featured Flash Deal (Homepage)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestseller}
                onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                className="rounded border-slate-300 text-toy-orange focus:ring-toy-orange"
              />
              <span>Bestseller Ribbon</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                className="rounded border-slate-300 text-toy-orange focus:ring-toy-orange"
              />
              <span>Trending Collection</span>
            </label>
          </div>
        </div>

        {/* Section 5: PER-PRODUCT SEO & GOOGLE PREVIEW */}
        <div className="space-y-4 pt-2 border-t-2 border-toy-orange/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-toy-orange" />
              <span>5. Product SEO & Google Search Optimization</span>
            </h3>

            {/* 1-Click Auto-Generate SEO Assistant */}
            <button
              type="button"
              onClick={handleAutoGenerateSeo}
              className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-black px-3.5 py-1.5 rounded-xl border border-amber-300 flex items-center gap-1.5 self-start sm:self-auto tap-bounce transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-toy-orange" />
              <span>✨ 1-Click Auto-Generate SEO</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* SEO Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Product Meta Title (Google Search Headline)
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      formData.metaTitle.length > 60 ? 'text-amber-600' : 'text-slate-400'
                    }`}
                  >
                    {formData.metaTitle.length}/60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="e.g. Buy 4WD Monster Stunt RC Car Online India | PlayMiso COD"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Product Meta Description (Google Snippet)
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      formData.metaDescription.length > 160 ? 'text-amber-600' : 'text-slate-400'
                    }`}
                  >
                    {formData.metaDescription.length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="e.g. Shop high-speed 360° flip stunt RC car with LED headlights. Cash on Delivery across India, 100% child-safe."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Product Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                  placeholder="e.g. rc stunt car, buy toys online, remote control car for kids, cod toys"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
                />
              </div>
            </div>

            {/* Live Google Search Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-toy-orange" />
                <span>Live Google Search Card Preview</span>
              </span>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-toy-orange text-white flex items-center justify-center text-[9px] font-bold">
                    🧸
                  </div>
                  <div className="text-[11px] text-slate-600 truncate">
                    https://playmiso.com <span className="text-slate-400">› product › toy-preview</span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-blue-800 line-clamp-1 hover:underline cursor-pointer">
                  {formData.metaTitle || formData.title || 'Product Title | PlayMiso India'}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 leading-snug">
                  {formData.metaDescription ||
                    formData.description ||
                    'Shop safe, high-quality toys with Cash on Delivery across India.'}
                </p>

                <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-500 font-medium border-t border-slate-200/60 mt-1">
                  <span>Rating: ★ 4.8 (12 reviews)</span>
                  <span>Price: ₹{formData.price || '999'}</span>
                  <span className="text-emerald-600 font-bold">In stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/admin/products"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-2xl tap-bounce transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-xs px-8 py-3.5 rounded-2xl shadow-toy-colored tap-bounce flex items-center gap-2 disabled:opacity-50 transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Toy with SEO...</span>
              </>
            ) : (
              <>
                <span>Save & Publish Toy (with SEO)</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
