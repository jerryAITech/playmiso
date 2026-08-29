'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white/95 text-slate-900 backdrop-blur-md px-4 py-3.5 rounded-2xl shadow-xl border border-slate-200/90 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
            {toast.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-toy-blue shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <p className="leading-tight">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
