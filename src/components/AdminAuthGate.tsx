'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, KeyRound, Loader2, ArrowRight, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, checkAuth } = useAuth();
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user && user.role === 'ADMIN') {
        setAuthorized(true);
      }
    }
  }, [user, loading]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.user && data.user.role === 'ADMIN') {
        await checkAuth();
        setAuthorized(true);
      } else {
        setError(data.error || 'Incorrect Admin PIN. (Default PIN is: 2026)');
      }
    } catch (err) {
      setError('Network error validating PIN');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-toy-orange">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-bold text-slate-600">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50/40 to-slate-200 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-4xl p-6 sm:p-10 border border-slate-200 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95">
          
          {/* Brand Icon */}
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-toy-orange to-toy-pink text-white flex items-center justify-center text-3xl mx-auto shadow-md">
            🛡️
          </div>

          <div>
            <span className="text-xs font-black text-toy-orange uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Admin Access Gate
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              PlayMiso Store Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your Master Admin PIN to unlock the store dashboard.
            </p>
          </div>

          {/* Quick PIN Form */}
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Enter 4-Digit Admin PIN
              </label>
              <input
                type="password"
                maxLength={6}
                autoFocus
                required
                placeholder="• • • •"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-48 mx-auto text-center font-mono text-2xl font-black tracking-widest bg-slate-50 border-2 border-slate-200 focus:border-toy-orange rounded-2xl py-3 text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all"
              />
            </div>

            {error && (
              <div className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !pin}
              className="w-full bg-toy-orange hover:bg-toy-orange/90 text-white font-black py-3.5 px-6 rounded-2xl shadow-toy-sm tap-bounce flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Hint & Regular Login Link */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500">
            <p className="bg-slate-50 p-2.5 rounded-xl text-[11px] font-mono text-slate-600 border border-slate-200">
              💡 Demo Master PIN: <strong className="text-slate-900">2026</strong>
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <Link href="/login?redirect=/admin" className="text-toy-orange font-bold hover:underline">
                Login with Email/Password
              </Link>
              <span>•</span>
              <Link href="/" className="text-slate-500 hover:text-slate-800">
                Return to Store ↗
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return <>{children}</>;
}
