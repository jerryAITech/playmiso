'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '@/types';

interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

export interface AppliedCoupon {
  code: string;
  discountAmount: number;
  description?: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getItemQuantity: (productId: string) => number;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
  subtotal: number;
  originalMrpTotal: number;
  productDiscountSavings: number;
  couponDiscount: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  shippingFee: number;
  freeShippingThreshold: number;
  totalAmount: number;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 49;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('playmiso_cart') || localStorage.getItem('toy_joy_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('playmiso_wishlist') || localStorage.getItem('toy_joy_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCoupon = localStorage.getItem('playmiso_coupon') || localStorage.getItem('toy_joy_coupon');
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error('Failed to load cart/wishlist from localStorage', e);
    }
    setMounted(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('playmiso_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('playmiso_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist', e);
    }
  }, [wishlist, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (appliedCoupon) {
        localStorage.setItem('playmiso_coupon', JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem('playmiso_coupon');
      }
    } catch (e) {
      console.error('Failed to save coupon', e);
    }
  }, [appliedCoupon, mounted]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, item.maxStock || 99);
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i));
      }
      return [...prev, { ...item, quantity: Math.min(qty, item.maxStock || 99) }];
    });
    showToast(`🎉 "${item.title.substring(0, 24)}..." added to bag!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast('Removed from bag', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const clamped = Math.min(quantity, item.maxStock || 99);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const getItemQuantity = (productId: string) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('❤️ Saved to your toy wishlist!');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const originalMrpTotal = cart.reduce((acc, item) => acc + (item.compareAtPrice || item.price) * item.quantity, 0);
  const productDiscountSavings = Math.max(0, originalMrpTotal - subtotal);

  // Validate applied coupon whenever subtotal changes
  const applyCoupon = async (code: string) => {
    if (!code.trim()) {
      return { success: false, message: 'Please enter a coupon code' };
    }

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountAmount: data.discountAmount,
          description: data.coupon.description,
        });
        showToast(data.message, 'success');
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Invalid coupon code' };
      }
    } catch (e: any) {
      return { success: false, message: 'Failed to validate coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Re-verify coupon discount value against changing subtotal
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  // Free shipping logic
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || cart.length === 0;
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;

  // Final Total calculation
  const totalAmount = Math.max(0, subtotal - couponDiscount + shippingFee);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        totalItems,
        subtotal,
        originalMrpTotal,
        productDiscountSavings,
        couponDiscount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        totalAmount,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
