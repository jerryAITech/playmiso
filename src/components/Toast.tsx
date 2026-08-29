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
          className="pointer-events-auto bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-slate-700/50 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            {toast.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-toy-yellow shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-toy-blue shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-toy-green shrink-0" />
            )}
            <p className="leading-tight">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
