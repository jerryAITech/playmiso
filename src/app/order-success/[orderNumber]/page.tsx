import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  Calendar,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

export const revalidate = 0;

interface OrderSuccessProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderNumber } = await params;

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  // Estimated delivery date (3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        
        {/* Celebration Hero Card */}
        <div className="bg-white rounded-4xl p-6 sm:p-10 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-18 h-18 sm:w-20 sm:h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl mx-auto shadow-inner animate-bounce-subtle">
            🎉
          </div>
          <div>
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              Cash on Delivery Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">
              Thank You, {order.customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Your joyful toys are being packed with care. You can pay{' '}
              <strong className="text-slate-900">₹{order.totalAmount}</strong> in cash or UPI when delivered.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl text-xs font-bold text-slate-800">
            <span>Order ID:</span>
            <span className="font-mono text-toy-orange text-sm font-black">{order.orderNumber}</span>
          </div>
        </div>

        {/* Order Progress Tracker */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-toy-orange" />
            <span>Delivery Status & Estimate</span>
          </h3>

          <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span className="text-slate-700">Estimated Delivery:</span>
            </div>
            <span className="font-black text-slate-900">{formattedDeliveryDate}</span>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-4 gap-2 pt-2 text-center text-[10px] sm:text-xs">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mx-auto shadow-sm">
                ✓
              </div>
              <span className="font-bold text-emerald-700">Placed</span>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-toy-orange text-white flex items-center justify-center font-bold mx-auto shadow-sm animate-pulse-subtle">
                2
              </div>
              <span className="font-bold text-slate-800">Packing</span>
            </div>
            <div className="space-y-1 opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold mx-auto">
                3
              </div>
              <span className="text-slate-500">Shipped</span>
            </div>
            <div className="space-y-1 opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold mx-auto">
                4
              </div>
              <span className="text-slate-500">Delivered</span>
            </div>
          </div>
        </div>

        {/* Delivery Details & Items */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Shipping Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Recipient</span>
              <p className="font-bold text-slate-800">{order.customerName}</p>
              <p className="text-slate-600 flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{order.phone}</span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Delivery Address</span>
              <p className="text-slate-700 leading-relaxed">
                {order.address}, {order.city}, {order.state} - {order.postalCode}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <span className="text-slate-400 font-bold uppercase text-[10px] block mb-3">
              Ordered Toys ({order.items.length})
            </span>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="40px" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-800 truncate max-w-xs">{item.title}</h4>
                      <span className="text-[11px] text-slate-500">Quantity: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline text-sm">
            <span className="font-extrabold text-slate-900">Total COD Amount:</span>
            <span className="text-xl font-black text-toy-orange">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* WhatsApp Order Receipt Action */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 sm:p-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-emerald-800 font-black text-sm">
            <span className="text-xl">💬</span>
            <span>Get Live Updates on WhatsApp</span>
          </div>
          <p className="text-xs text-emerald-700 max-w-md mx-auto">
            Save your order receipt or chat directly with our PlayMiso Support team for express dispatch tracking!
          </p>
          <a
            href={`https://wa.me/919876543210?text=${encodeURIComponent(
              `Hi PlayMiso! 🎉 I just placed COD Order #${order.orderNumber} for ₹${order.totalAmount}. Please confirm my order dispatch to ${order.city}!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm py-3.5 px-8 rounded-2xl shadow-md tap-bounce transition-all"
          >
            <span>📱 Send Order Receipt to WhatsApp</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/shop"
            className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl text-center text-xs sm:text-sm tap-bounce shadow-sm transition-all"
          >
            Continue Shopping
          </Link>
          <Link
            href="/admin/orders"
            className="w-full sm:flex-1 bg-white hover:bg-slate-50 text-slate-800 font-bold py-3.5 px-6 rounded-2xl text-center text-xs sm:text-sm border border-slate-300 tap-bounce transition-all"
          >
            View in Admin Dashboard
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}
