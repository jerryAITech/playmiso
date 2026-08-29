'use client';

import React, { useState } from 'react';
import { Star, ShieldCheck, CheckCircle2, AlertCircle, MessageSquarePlus, Send, Sparkles } from 'lucide-react';
import { ReviewType } from '@/types';

interface ProductReviewsSectionProps {
  productId: string;
  initialReviews?: ReviewType[];
  averageRating: number;
  totalReviews: number;
}

export default function ProductReviewsSection({
  productId,
  initialReviews = [],
  averageRating,
  totalReviews,
}: ProductReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewType[]>(initialReviews);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setError('Please provide your name and review comment');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, title, comment }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setReviews((prev) => [data.review, ...prev]);
        setName('');
        setTitle('');
        setComment('');
        setShowForm(false);
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      setError('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
      {/* Top Header & Aggregate Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Customer Ratings & Parent Reviews
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real feedback from verified parents and gift-givers across India.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl">
            <span className="text-2xl font-black text-slate-900">{averageRating.toFixed(1)}</span>
            <div>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= Math.round(averageRating) ? 'fill-amber-400' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-500">
                Based on {reviews.length || totalReviews} reviews
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-toy-orange hover:bg-toy-orange/90 text-white font-black text-xs px-5 py-3 rounded-2xl flex items-center gap-2 shadow-toy-sm tap-bounce transition-all shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showForm ? 'Close Form' : 'Write a Review'}</span>
          </button>
        </div>
      </div>

      {/* Write a Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              Share Your Experience With This Toy
            </h3>
            <span className="text-xs text-slate-400 font-bold">100% Verified Review</span>
          </div>

          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Your Rating (Tap to Select Stars):
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 tap-bounce"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-black text-slate-800 ml-2">
                {rating === 5
                  ? '⭐⭐⭐⭐⭐ Exceptional!'
                  : rating === 4
                  ? '⭐⭐⭐⭐ Very Good!'
                  : rating === 3
                  ? '⭐⭐⭐ Good'
                  : 'Needs Improvement'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Name / Parent Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma, Bengaluru"
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Review Headline (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. My 5-year-old loves it!"
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Detailed Feedback *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other parents about the toy quality, child's engagement, materials, and delivery speed..."
              className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-toy-orange"
            />
          </div>

          {error && (
            <div className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-6 py-3 rounded-2xl flex items-center gap-2 tap-bounce shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Posting Review...' : 'Submit Verified Review'}</span>
            </button>
          </div>
        </form>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-900 text-xs font-bold p-4 rounded-2xl border border-emerald-200 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>🎉 Thank you! Your review has been submitted and published.</span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-medium bg-slate-50 rounded-3xl p-6">
            <p>Be the first parent to review this toy and help other families!</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-slate-50/80 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-toy-orange text-white flex items-center justify-center text-xs font-black">
                    {rev.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">{rev.userName}</span>
                      {rev.isVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${
                        s <= rev.rating ? 'fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {rev.title && (
                <h4 className="text-xs font-bold text-slate-800">{rev.title}</h4>
              )}

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
