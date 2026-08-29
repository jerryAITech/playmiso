'use client';

import React, { useState, useEffect } from 'react';
import {
  Palette,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Type,
  Layers,
  Flame,
  Gift,
  Sun,
  Moon,
  Eye,
  Sliders,
} from 'lucide-react';
import { useTheme, ThemeSettings } from '@/lib/theme-context';
import PlayMisoLogo from '@/components/PlayMisoLogo';

export default function AdminThemePage() {
  const { theme, refreshTheme } = useTheme();
  const [formData, setFormData] = useState<ThemeSettings>(theme);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(theme);
  }, [theme]);

  const festivePresets = [
    {
      id: 'NONE',
      title: 'Standard PlayMiso',
      emoji: '🎲',
      badgeText: 'Discover the Magic of Play ✨',
      desc: 'Normal everyday store appearance',
      ribbonBg: 'from-toy-purple via-toy-pink to-toy-orange',
    },
    {
      id: 'DIWALI',
      title: 'Diwali Dhamaka Sale',
      emoji: '🪔',
      badgeText: '🪔 Diwali Grand Toy Sale • Flat 50% OFF (COD Available)',
      desc: 'Diya festive logo with golden glow & festive banners',
      ribbonBg: 'from-amber-600 via-orange-500 to-yellow-500',
    },
    {
      id: 'CHRISTMAS',
      title: 'Christmas Wonderland',
      emoji: '🎅',
      badgeText: '🎅 Christmas Holiday Special • Extra 20% OFF with Code: SANTA20',
      desc: 'Santa festive logo with holiday cheer',
      ribbonBg: 'from-red-600 via-rose-500 to-emerald-600',
    },
    {
      id: 'NEW_YEAR',
      title: 'New Year Mega Bash',
      emoji: '🎆',
      badgeText: '🎆 Happy New Year Sale 2026 • Exclusive Toy Deals',
      desc: 'Fireworks festive logo with vibrant neon banners',
      ribbonBg: 'from-purple-700 via-indigo-600 to-pink-600',
    },
    {
      id: 'HOLI',
      title: 'Holi Color Carnival',
      emoji: '🎨',
      badgeText: '🎨 Holi Toy Carnival • Vibrant Colors & Safe Toys',
      desc: 'Color splash logo with rainbow ribbons',
      ribbonBg: 'from-pink-500 via-yellow-400 to-teal-400',
    },
    {
      id: 'CUSTOM',
      title: 'Custom Sale Event',
      emoji: '⚡',
      badgeText: '⚡ Weekend Flash Toy Sale • Limited Time Deals',
      desc: 'Set your own custom emoji, badge text & banner ribbon',
      ribbonBg: 'from-indigo-600 via-purple-600 to-pink-600',
    },
  ];

  const fontOptions = [
    { name: 'Plus Jakarta Sans', desc: 'Modern, clean & ultra-readable (Recommended)' },
    { name: 'Outfit', desc: 'Bold, joyful & rounded geometric headlines' },
    { name: 'Poppins', desc: 'Friendly, modern international sans-serif' },
    { name: 'Fredoka', desc: 'Ultra-bouncy, rounded cartoonish toy feel' },
    { name: 'Quicksand', desc: 'Soft, delicate rounded curves for kids' },
  ];

  const colorPresets = [
    { name: 'Sunset Orange (Default)', color: '#FF7844' },
    { name: 'Bubblegum Pink', color: '#F72585' },
    { name: 'Electric Turquoise', color: '#2EC4B6' },
    { name: 'Cyber Yellow', color: '#FFD23F' },
    { name: 'Royal Purple', color: '#7209B7' },
    { name: 'Emerald Green', color: '#06D6A0' },
  ];

  const buttonStyles = [
    { id: 'bouncy-3d', label: '3D Bouncy Press (Playful Toy Look)', classPreview: 'shadow-toy tap-bounce' },
    { id: 'pill', label: 'Pill Rounded (Smooth & Modern)', classPreview: 'rounded-full' },
    { id: 'rounded', label: 'Classic Rounded Box (Clean UI)', classPreview: 'rounded-2xl' },
  ];

  const borderRadiusOptions = [
    { id: 'rounded-3xl', label: 'Extra Bubbly 24px (Recommended)' },
    { id: 'rounded-2xl', label: 'Standard Rounded 16px' },
    { id: 'rounded-xl', label: 'Subtle Rounded 12px' },
  ];

  const handleApplyPreset = (preset: typeof festivePresets[0]) => {
    setFormData((prev) => ({
      ...prev,
      festiveMode: preset.id,
      festiveLogoEmoji: preset.emoji,
      festiveBadgeText: preset.badgeText,
      festiveRibbonBg: preset.ribbonBg,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess('🎉 Theme & Festive Campaign updated successfully! The entire website has been refreshed.');
        await refreshTheme();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save theme settings');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving theme');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-toy-yellow via-toy-orange to-toy-pink flex items-center justify-center text-white shadow-xs">
              <Palette className="w-5 h-5 text-slate-950" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Theme, Festive Logo & Design Customizer
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Control the store font, brand colors, button styles, and activate festive sale logos (Diwali, Christmas, New Year, Holi) across the website.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce disabled:opacity-70 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Applying Changes...' : 'Save & Publish Theme'}</span>
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 text-emerald-900 text-xs font-bold p-4 rounded-2xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 text-rose-900 text-xs font-bold p-4 rounded-2xl border border-rose-200 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Storefront Preview Box */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-4xl shadow-xl space-y-4 border border-slate-800">
        <div className="flex items-center justify-between text-xs font-bold border-b border-slate-800 pb-3">
          <span className="flex items-center gap-2 text-toy-yellow">
            <Eye className="w-4 h-4" />
            <span>Live Header & Festive Logo Preview</span>
          </span>
          <span className="text-[11px] text-slate-400">
            Mode: <strong className="text-white uppercase">{formData.festiveMode}</strong>
          </span>
        </div>

        {/* Preview Container */}
        <div className="bg-white rounded-3xl p-5 text-slate-900 shadow-md space-y-4">
          {/* Mock Top Festive Ribbon */}
          {formData.festiveMode !== 'NONE' && formData.festiveBannerActive && (
            <div className={`bg-gradient-to-r ${formData.festiveRibbonBg} text-white text-xs py-2 px-4 rounded-2xl font-black text-center shadow-xs flex items-center justify-center gap-2 animate-pulse`}>
              <span>{formData.festiveLogoEmoji}</span>
              <span>{formData.festiveBadgeText}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase">Special Offer</span>
            </div>
          )}

          {/* Logo & Header Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-toy-yellow via-toy-orange to-toy-pink flex items-center justify-center text-2xl shadow-toy-sm border-2 border-white">
                <span>{formData.festiveMode !== 'NONE' ? formData.festiveLogoEmoji : '🎲'}</span>
              </div>
              <div>
                <div className="font-black text-xl leading-none flex items-center gap-1.5">
                  <span>Play</span>
                  <span style={{ color: formData.primaryColor }}>Miso</span>
                  {formData.festiveMode !== 'NONE' && (
                    <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase">
                      SALE
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-extrabold text-toy-purple uppercase mt-0.5">
                  {formData.festiveMode !== 'NONE' && formData.festiveBadgeText
                    ? formData.festiveBadgeText
                    : 'Discover the Magic of Play ✨'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                style={{ backgroundColor: formData.primaryColor }}
                className={`text-white font-black text-xs px-5 py-2.5 rounded-2xl shadow-toy-colored`}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Festive Season & Sale Theme Logo */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  1. Festive Season & Sale Logo Customizer
                </h3>
                <p className="text-xs text-slate-500">
                  Select a festival to automatically update the logo, top announcement ribbon, and sale badges across the entire site!
                </p>
              </div>
            </div>
          </div>

          {/* Festive Presets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {festivePresets.map((preset) => {
              const isSelected = formData.festiveMode === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-4 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-toy-orange bg-orange-50/50 shadow-md scale-[1.02]'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs border border-slate-200">
                      {preset.emoji}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{preset.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{preset.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className={isSelected ? 'text-toy-orange' : 'text-slate-400'}>
                      {isSelected ? '✓ Active Theme' : 'Click to Apply'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Festive Custom Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Festive Mascot Logo Emoji (e.g. 🪔, 🎅, 🎆, 🎨, 🎁)
              </label>
              <input
                type="text"
                value={formData.festiveLogoEmoji || ''}
                onChange={(e) => setFormData({ ...formData, festiveLogoEmoji: e.target.value })}
                placeholder="🪔"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Festive Tagline & Sale Announcement Text
              </label>
              <input
                type="text"
                value={formData.festiveBadgeText || ''}
                onChange={(e) => setFormData({ ...formData, festiveBadgeText: e.target.value })}
                placeholder="Diwali Mega Sale • Up to 50% OFF"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Typography & Brand Colors */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-toy-orange flex items-center justify-center font-bold">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                2. Font Family & Primary Brand Color
              </h3>
              <p className="text-xs text-slate-500">
                Choose typography and main accent color for buttons, badges, and headers.
              </p>
            </div>
          </div>

          {/* Font Family Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Font Family (Applied across Storefront & Admin)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {fontOptions.map((font) => (
                <div
                  key={font.name}
                  onClick={() => setFormData({ ...formData, fontFamily: font.name })}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.fontFamily === font.name
                      ? 'border-toy-orange bg-orange-50/50 shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <h4 className="text-xs font-black text-slate-900">{font.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{font.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Color Presets */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700">
              Primary Brand Accent Color
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {colorPresets.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => setFormData({ ...formData, primaryColor: c.color })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl border-2 text-xs font-bold transition-all ${
                    formData.primaryColor === c.color
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Button Styles & Border Radius */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-toy-purple flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                3. Button Styling & Rounded Corners
              </h3>
              <p className="text-xs text-slate-500">
                Configure card roundness, button shadows, and micro-press touch feelings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Button Style</label>
              <div className="space-y-2">
                {buttonStyles.map((btn) => (
                  <div
                    key={btn.id}
                    onClick={() => setFormData({ ...formData, buttonStyle: btn.id })}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between text-xs font-bold ${
                      formData.buttonStyle === btn.id
                        ? 'border-toy-orange bg-orange-50/50'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span>{btn.label}</span>
                    {formData.buttonStyle === btn.id && (
                      <span className="text-toy-orange font-black">✓ Active</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Border Radius (Cards & Modals)</label>
              <div className="space-y-2">
                {borderRadiusOptions.map((radius) => (
                  <div
                    key={radius.id}
                    onClick={() => setFormData({ ...formData, borderRadius: radius.id })}
                    className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between text-xs font-bold ${
                      formData.borderRadius === radius.id
                        ? 'border-toy-orange bg-orange-50/50'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span>{radius.label}</span>
                    {formData.borderRadius === radius.id && (
                      <span className="text-toy-orange font-black">✓ Active</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-sm px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce disabled:opacity-70"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Publishing Changes...' : 'Save & Publish Theme Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
