'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import CouponBox from '@/components/CouponBox';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone,
  User,
  MapPin,
  Mail,
  Loader2,
  Plus,
  Minus,
  Trash2,
  LogIn,
  UserPlus,
  CreditCard,
  Banknote,
  Check,
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    originalMrpTotal,
    productDiscountSavings,
    couponDiscount,
    appliedCoupon,
    shippingFee,
    totalAmount,
    updateQuantity,
    removeFromCart,
    clearCart,
    showToast,
  } = useCart();
  const { user, loading: authLoading, addresses, addAddress } = useAuth();

  // Stepper state: 1 = Address, 2 = Order Review & Payment
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(true);

  // Payment mode: 'COD' | 'RAZORPAY'
  const [paymentMode, setPaymentMode] = useState<'COD' | 'RAZORPAY'>('COD');

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill from user profile or default address
  useEffect(() => {
    if (user) {
      if (addresses.length > 0) {
        const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
        setSelectedAddressId(defaultAddr.id);
        setFormData({
          customerName: defaultAddr.fullName || user.name,
          email: user.email,
          phone: defaultAddr.phone || user.phone || '',
          address: defaultAddr.street,
          city: defaultAddr.city,
          state: defaultAddr.state,
          postalCode: defaultAddr.postalCode,
          notes: '',
        });
        setUseNewAddress(false);
      } else {
        setFormData((prev) => ({
          ...prev,
          customerName: user.name,
          email: user.email,
          phone: user.phone || '',
        }));
        setUseNewAddress(true);
      }
    }
  }, [user, addresses]);

  const handleSelectAddress = (addrId: string) => {
    setSelectedAddressId(addrId);
    setUseNewAddress(false);
    const chosen = addresses.find((a) => a.id === addrId);
    if (chosen) {
      setFormData({
        customerName: chosen.fullName,
        email: user?.email || '',
        phone: chosen.phone,
        address: chosen.street,
        city: chosen.city,
        state: chosen.state,
        postalCode: chosen.postalCode,
        notes: '',
      });
      setErrors({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateAddress = () => {
    const errs: Record<string, string> = {};
    if (!formData.customerName.trim()) errs.customerName = 'Please enter your full name';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Enter valid 10-digit mobile number';
    if (!formData.address.trim()) errs.address = 'Please enter full delivery street address';
    if (!formData.city.trim()) errs.city = 'Please enter city';
    if (!formData.postalCode.trim() || formData.postalCode.length < 6) errs.postalCode = 'Enter 6-digit Pincode';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToStep2 = () => {
    if (!user) {
      showToast('🔒 Please sign in to choose delivery address', 'warning');
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!validateAddress()) {
      showToast('Please complete all delivery address details', 'warning');
      return;
    }

    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Place Final Order (COD or Razorpay)
  const handleFinalOrderSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!user) {
      showToast('🔒 Please sign in before placing your order', 'warning');
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!validateAddress()) {
      setCurrentStep(1);
      return;
    }

    if (cart.length === 0) {
      showToast('Your bag is empty!', 'warning');
      return;
    }

    setLoading(true);

    try {
      // If user added new address and checked save, save it
      if (user && useNewAddress && saveToProfile) {
        try {
          await addAddress({
            fullName: formData.customerName,
            phone: formData.phone,
            street: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            isDefault: addresses.length === 0,
          });
        } catch {}
      }

      // 1. RAZORPAY TEST PAYMENT FLOW
      if (paymentMode === 'RAZORPAY') {
        const orderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmount,
            receipt: `rcpt_${Date.now()}`,
          }),
        });

        const rpData = await orderRes.json();

        if (!orderRes.ok) {
          throw new Error(rpData.error || 'Failed to initialize Razorpay test payment');
        }

        // Open Razorpay Checkout Modal
        if (typeof window !== 'undefined' && window.Razorpay) {
          const options = {
            key: rpData.keyId || 'rzp_test_1DP5mmOlF5G5ag',
            amount: rpData.amount,
            currency: 'INR',
            name: 'PlayMiso Toys',
            description: `Payment for ${cart.length} toys`,
            image: '/icon',
            order_id: rpData.id,
            handler: async function (response: any) {
              await completeOrderPlacement('RAZORPAY', response.razorpay_payment_id);
            },
            prefill: {
              name: formData.customerName,
              email: formData.email,
              contact: formData.phone,
            },
            notes: {
              address: `${formData.address}, ${formData.city}`,
            },
            theme: {
              color: '#FF7844',
            },
            modal: {
              ondismiss: function () {
                setLoading(false);
                showToast('Payment window closed. You can complete anytime or choose COD.', 'info');
              },
            },
          };

          const rzpInstance = new window.Razorpay(options);
          rzpInstance.on('payment.failed', function (resp: any) {
            setLoading(false);
            showToast(`Payment failed: ${resp.error.description}`, 'warning');
          });
          rzpInstance.open();
          return;
        } else {
          // Fallback if script not ready: simulated test success
          await completeOrderPlacement('RAZORPAY', `pay_dummy_${Date.now()}`);
          return;
        }
      }

      // 2. CASH ON DELIVERY (COD) FLOW
      await completeOrderPlacement('COD');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Error processing order', 'warning');
      setLoading(false);
    }
  };

  const completeOrderPlacement = async (paidMethod: 'COD' | 'RAZORPAY', paymentId?: string) => {
    try {
      const payload = {
        userId: user?.id,
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        notes: paymentId ? `Razorpay Payment ID: ${paymentId}` : formData.notes,
        items: cart,
        subtotal,
        couponCode: appliedCoupon?.code || null,
        couponDiscount,
        shippingFee,
        totalAmount,
        paymentMethod: paidMethod,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      showToast('🎉 Order placed successfully!', 'success');
      router.push(`/order-success/${data.orderNumber}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to place order', 'warning');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-4xl mx-auto">
          🛍️
        </div>
        <h2 className="text-xl font-black text-slate-900">Your bag is empty</h2>
        <p className="text-xs text-slate-500">
          Add some joyful toys to your bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-toy-orange text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-toy-sm tap-bounce"
        >
          Explore Toys Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-16">
      {/* Load Razorpay Checkout Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/cart" className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-black text-slate-900 text-base">
              Play<span className="text-toy-orange">Miso</span> Checkout
            </span>
          </Link>

          {/* Stepper Pill Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                currentStep === 1
                  ? 'bg-white text-toy-orange shadow-xs font-black'
                  : 'text-emerald-700 hover:text-slate-900'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-toy-orange text-white text-[10px] flex items-center justify-center font-black">
                1
              </span>
              <span>Delivery Address</span>
            </button>

            <span className="text-slate-300">➔</span>

            <button
              type="button"
              onClick={() => handleProceedToStep2()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                currentStep === 2
                  ? 'bg-white text-toy-orange shadow-xs font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-black">
                2
              </span>
              <span>Order & Payment Mode</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Safe Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Full-View Checkout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* LOGIN GATE FOR GUEST USERS */}
        {!user && !authLoading && (
          <div className="bg-white rounded-4xl p-6 sm:p-10 border-2 border-toy-orange shadow-xl max-w-2xl mx-auto mb-8 text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-3xl bg-orange-100 text-toy-orange flex items-center justify-center text-3xl mx-auto shadow-inner">
              🔒
            </div>
            <div className="space-y-1">
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full uppercase">
                Login Required
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                Please Sign In to Complete Order
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Sign in to your PlayMiso account with fast 4-digit PIN or password to track your order.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              <Link
                href="/login?redirect=/checkout"
                className="w-full sm:flex-1 bg-toy-orange hover:bg-toy-orange/90 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce text-xs transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In (PIN / Password)</span>
              </Link>
              <Link
                href="/signup?redirect=/checkout"
                className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 tap-bounce text-xs transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
              </Link>
            </div>
          </div>
        )}

        {/* LOGGED IN 2-COLUMN FULL VIEW CHECKOUT */}
        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: SCROLLABLE STEPPER (7 COLS) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* STEP 1: CHOOSE DELIVERY ADDRESS */}
              <div
                className={`bg-white rounded-3xl border transition-all ${
                  currentStep === 1
                    ? 'border-toy-orange shadow-md p-5 sm:p-6'
                    : 'border-slate-200 shadow-xs p-4 sm:p-5 opacity-90'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                        currentStep === 1
                          ? 'bg-toy-orange text-white shadow-xs'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {currentStep > 1 ? '✓' : '1'}
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        1. Choose Delivery Address
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Doorstep delivery across all Indian PIN codes
                      </p>
                    </div>
                  </div>

                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-bold text-toy-orange hover:underline"
                    >
                      Change ✎
                    </button>
                  )}
                </div>

                {/* Active Step 1 Content */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-in fade-in">
                    {/* Saved Addresses Selector */}
                    {addresses.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Saved Addresses:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setUseNewAddress(!useNewAddress);
                              if (!useNewAddress) {
                                setFormData({
                                  customerName: user.name,
                                  email: user.email,
                                  phone: user.phone || '',
                                  address: '',
                                  city: '',
                                  state: 'Maharashtra',
                                  postalCode: '',
                                  notes: '',
                                });
                              }
                            }}
                            className="text-xs font-bold text-toy-orange hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{useNewAddress ? 'Select Saved Address' : '+ Add New Address'}</span>
                          </button>
                        </div>

                        {!useNewAddress && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {addresses.map((addr) => {
                              const isSelected = selectedAddressId === addr.id;
                              return (
                                <div
                                  key={addr.id}
                                  onClick={() => handleSelectAddress(addr.id)}
                                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                                    isSelected
                                      ? 'border-toy-orange bg-orange-50/40 shadow-xs'
                                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-black text-slate-900">{addr.fullName}</span>
                                    {isSelected && (
                                      <CheckCircle2 className="w-4 h-4 text-toy-orange shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-600 line-clamp-2">
                                    {addr.street}, {addr.city} - {addr.postalCode}
                                  </p>
                                  <span className="text-[11px] text-slate-500 font-medium block mt-1">
                                    📞 {addr.phone}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* New Address Input Form */}
                    {(addresses.length === 0 || useNewAddress) && (
                      <div className="space-y-3 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Recipient Full Name <span className="text-toy-red">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleInputChange}
                                placeholder="e.g. Pooja Sharma"
                                className={`w-full bg-slate-50 border rounded-2xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange ${
                                  errors.customerName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                                }`}
                              />
                              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Mobile Number (For Delivery SMS) <span className="text-toy-red">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="e.g. 9876543210"
                                maxLength={10}
                                className={`w-full bg-slate-50 border rounded-2xl py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange ${
                                  errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                                }`}
                              />
                              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Flat / House No., Building, Street Address <span className="text-toy-red">*</span>
                            </label>
                            <textarea
                              name="address"
                              rows={2}
                              value={formData.address}
                              onChange={handleInputChange}
                              placeholder="e.g. Flat 402, Sunshine Heights, MG Road"
                              className={`w-full bg-slate-50 border rounded-2xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange ${
                                errors.address ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              City <span className="text-toy-red">*</span>
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="e.g. Mumbai"
                              className={`w-full bg-slate-50 border rounded-2xl py-2.5 px-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange ${
                                errors.city ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                              }`}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              6-Digit PIN Code <span className="text-toy-red">*</span>
                            </label>
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              placeholder="e.g. 400001"
                              maxLength={6}
                              className={`w-full bg-slate-50 border rounded-2xl py-2.5 px-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-toy-orange ${
                                errors.postalCode ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Next Step Button */}
                    <button
                      type="button"
                      onClick={handleProceedToStep2}
                      className="w-full bg-toy-orange hover:bg-toy-orange/90 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-toy-sm tap-bounce text-xs uppercase tracking-wider transition-all mt-3"
                    >
                      <span>Proceed to Order & Payment ➔</span>
                    </button>
                  </div>
                )}

                {/* Collapsed Step 1 Summary */}
                {currentStep === 2 && (
                  <div className="text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-900">
                      📍 {formData.customerName} • 📞 {formData.phone}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {formData.address}, {formData.city} - {formData.postalCode}
                    </p>
                  </div>
                )}
              </div>

              {/* STEP 2: ORDER REVIEW & PAYMENT MODE */}
              <div
                className={`bg-white rounded-3xl border transition-all ${
                  currentStep === 2
                    ? 'border-toy-orange shadow-md p-5 sm:p-6'
                    : 'border-slate-200 shadow-xs p-4 sm:p-5 opacity-70'
                }`}
              >
                <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
                  <div
                    className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center ${
                      currentStep === 2
                        ? 'bg-toy-orange text-white shadow-xs'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      2. Order Review & Payment Mode
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Select Cash on Delivery or Instant Online Payment
                    </p>
                  </div>
                </div>

                {currentStep === 2 && (
                  <div className="space-y-6 animate-in fade-in">
                    {/* Item Breakdown List with + / - controls */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-700 block">
                        Items in Your Bag ({cart.length} toys):
                      </span>
                      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 no-scrollbar">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                          >
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200">
                              <Image
                                src={item.image || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b'}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {item.title}
                              </h4>
                              <span className="text-[11px] font-black text-toy-orange">
                                ₹{item.price}
                              </span>
                            </div>

                            {/* Live + / - Quantity Selector */}
                            <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-200 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-black text-slate-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Mode Selection */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-700 block">
                        Select Payment Method:
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* 1. Cash on Delivery (COD) */}
                        <div
                          onClick={() => setPaymentMode('COD')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            paymentMode === 'COD'
                              ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-base shadow-xs">
                                💵
                              </div>
                              <div>
                                <span className="text-xs font-black text-slate-900 block">
                                  Cash on Delivery (COD)
                                </span>
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                  100% Free
                                </span>
                              </div>
                            </div>
                            {paymentMode === 'COD' && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-2">
                            Pay in Cash or Scan UPI QR at the time of doorstep delivery.
                          </p>
                        </div>

                        {/* 2. Razorpay Online Payment (UPI, Cards, NetBanking) */}
                        <div
                          onClick={() => setPaymentMode('RAZORPAY')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            paymentMode === 'RAZORPAY'
                              ? 'border-toy-orange bg-orange-50/40 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-toy-blue to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                                ⚡
                              </div>
                              <div>
                                <span className="text-xs font-black text-slate-900 block">
                                  Razorpay Online
                                </span>
                                <span className="text-[10px] font-bold text-toy-orange bg-orange-100 px-1.5 py-0.2 rounded">
                                  UPI / Cards / NetBanking
                                </span>
                              </div>
                            </div>
                            {paymentMode === 'RAZORPAY' && (
                              <CheckCircle2 className="w-5 h-5 text-toy-orange shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-2">
                            Pay via Google Pay, PhonePe, Paytm, Debit/Credit Card or NetBanking.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 Back & Submit Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Address</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFinalOrderSubmit()}
                        disabled={loading}
                        className="flex-1 bg-toy-orange hover:bg-toy-orange/90 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce text-xs uppercase tracking-wider disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing Order...</span>
                          </>
                        ) : (
                          <>
                            <span>
                              {paymentMode === 'RAZORPAY'
                                ? `Pay ₹${totalAmount} with Razorpay`
                                : `Confirm COD Order (₹${totalAmount})`}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT COLUMN: FIXED / STICKY ORDER SUMMARY (5 COLS) */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
              
              {/* Coupon Box */}
              <CouponBox />

              {/* Price Details Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                  Price Breakdown ({cart.length} {cart.length === 1 ? 'toy' : 'toys'})
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Total MRP</span>
                    <span className="text-slate-400 line-through">₹{originalMrpTotal}</span>
                  </div>

                  {productDiscountSavings > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Product Discounts</span>
                      <span>-₹{productDiscountSavings}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">₹{subtotal}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon Savings ({appliedCoupon?.code})</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charges</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-black text-slate-900 block">Total Amount</span>
                      <span className="text-[10px] text-slate-400">
                        {paymentMode === 'RAZORPAY' ? 'Instant Online Payment' : 'Cash on Delivery'}
                      </span>
                    </div>
                    <span className="text-2xl font-black text-toy-orange">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Savings Highlight */}
                {productDiscountSavings + couponDiscount > 0 && (
                  <div className="bg-emerald-50 text-emerald-800 text-[11px] font-bold p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>You Save:</span>
                    </span>
                    <span className="font-black text-emerald-700">
                      ₹{(productDiscountSavings + couponDiscount).toFixed(0)}
                    </span>
                  </div>
                )}

                {/* Big Action CTA */}
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 1) {
                      handleProceedToStep2();
                    } else {
                      handleFinalOrderSubmit();
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-toy-orange hover:bg-toy-orange/90 text-white font-black py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-toy-colored tap-bounce text-xs uppercase tracking-wider disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {currentStep === 1
                          ? 'Proceed to Payment ➔'
                          : paymentMode === 'RAZORPAY'
                          ? `Pay ₹${totalAmount} with Razorpay`
                          : `Confirm COD Order (₹${totalAmount})`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>100% Kid Safe</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-toy-blue shrink-0" />
                    <span>Fast Pan-India Shipping</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
