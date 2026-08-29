'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/profile';
  const { login } = useAuth();
  const { showToast } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      showToast('🎉 Welcome back! Logged in successfully.', 'success');
      router.push(redirectUrl);
    } else {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-4xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
        
        {/* Brand Top */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-toy-yellow via-toy-orange to-toy-pink flex items-center justify-center text-3xl mx-auto shadow-toy-sm border-2 border-white">
            🎲
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Welcome to Play<span className="text-toy-orange">Miso</span>
          </h1>
          <p className="text-xs text-slate-500">
            {redirectUrl === '/checkout'
              ? 'Please sign in to your account to complete your Cash on Delivery order.'
              : 'Discover the Magic of Play • Sign in for orders and saved addresses.'}
          </p>
        </div>

        {/* Notice for Checkout */}
        {redirectUrl === '/checkout' && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 text-xs text-orange-950 flex items-center gap-2">
            <span className="text-base">🔒</span>
            <span>Login is required before placing your order.</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-2xl border border-rose-200 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-toy-orange hover:bg-toy-orange/90 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce text-sm disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Don&apos;t have an account? </span>
          <Link
            href={`/signup${redirectUrl !== '/profile' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="text-toy-orange font-bold hover:underline"
          >
            Create Free Account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-toy-orange" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
