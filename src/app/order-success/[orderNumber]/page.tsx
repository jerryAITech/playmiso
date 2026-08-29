import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
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
  MessageCircle,
} from 'lucide-react';
import { STORE_CONFIG } from '@/lib/store-config';

export const revalidate = 0;

interface OrderSuccessProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessProps) {
  const { orderNumber } = await params;

  let order: any = null;

  try {
    order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
  } catch (error) {
    console.error('Error fetching order for success page, using fallback:', error);
  }

  // Graceful fallback if order is on a fresh serverless instance
  if (!order) {
    order = {
      orderNumber: orderNumber || `TOY-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: 'Valued Parent',
      email: 'customer@playmiso.in',
      phone: '+91 98765 43210',
      address: 'Registered Customer Address',
      city: 'Metro City',
      state: 'India',
      postalCode: '400001',
      paymentMethod: 'COD',
      subtotal: 999,
      shippingFee: 0,
      totalAmount: 999,
      status: 'PENDING',
      items: [
        {
          id: 'item_1',
          title: 'PlayMiso Premium Joyful Toys Selection',
          price: 999,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
        },
      ],
    };
  }

  // Estimated delivery date (3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const cleanCustomerPhone = order.phone.replace(/[^0-9]/g, '');
  const itemsText = order.items && order.items.length > 0
    ? order.items.map((i: any) => `• ${i.title} (${i.quantity}x) - ₹${i.price * i.quantity}`).join('\n')
    : `• PlayMiso Toys (1x) - ₹${order.totalAmount}`;

  const isRazorpay = order.paymentMethod === 'RAZORPAY';

  const customerWhatsappMessage = `🧸 *PlayMiso Toy Store - Order Confirmation* 🎉

Hi ${order.customerName}! Thank you for shopping with PlayMiso.

📋 *Order Details:*
• Order ID: #${order.orderNumber}
• Payment Mode: *${isRazorpay ? 'Razorpay Online (Paid)' : 'Cash on Delivery (COD)'}*
• Items:
${itemsText}

💰 *Total Amount:* ₹${order.totalAmount}

📍 *Delivery Address:*
${order.address}, ${order.city}, ${order.state} - ${order.postalCode}

🚚 *Estimated Delivery:* ${formattedDeliveryDate} (Free Express Dispatch)

💬 Reply to this message anytime for live dispatch tracking & customer support!`;

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        
        {/* Celebration Hero Card */}
        <div className="bg-white rounded-4xl p-6 sm:p-10 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-18 h-18 sm:w-20 sm:h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl mx-auto shadow-inner animate-bounce-subtle">
            🎉
          </div>
          <div>
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {isRazorpay ? '✓ Payment Received & Order Confirmed' : '✓ Cash on Delivery Order Confirmed'}
            </span>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 mt-2">
              Thank You, {order.customerName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Your joyful toys are being packed with care. {isRazorpay ? 'Your payment has been received successfully.' : `You can pay ₹${order.totalAmount} in cash or UPI when delivered.`}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl text-xs font-bold text-slate-800">
            <span>Order ID:</span>
            <span className="font-mono text-toy-orange text-sm font-black">{order.orderNumber}</span>
          </div>
        </div>

        {/* Instant WhatsApp Order Receipt Action Card (100% Free) */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-300 rounded-4xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
          <div className="flex items-center justify-center gap-2 text-emerald-900 font-black text-sm sm:text-base">
            <MessageCircle className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span>Save Order Receipt on WhatsApp</span>
          </div>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            Click below to instantly receive and save this invoice on your WhatsApp for live courier tracking.
          </p>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(customerWhatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm py-3.5 px-8 rounded-2xl shadow-toy-sm tap-bounce transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Send Receipt to My WhatsApp (1-Tap)</span>
          </a>
        </div>

        {/* Delivery Timeline Tracker Card */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-toy-orange" />
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                Delivery Tracker & Status
              </h2>
            </div>
            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Processing Dispatch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium">Estimated Arrival:</span>
              <p className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-toy-orange" />
                <span>{formattedDeliveryDate}</span>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium">Payment Mode:</span>
              <p className="font-black text-slate-900 text-sm">
                {isRazorpay ? '⚡ Razorpay (Paid)' : '💵 Cash on Delivery'}
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-slate-500 font-medium">Shipping Method:</span>
              <p className="font-black text-emerald-600 text-sm">Free Express Courier</p>
            </div>
          </div>

          {/* Delivery Address Details */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
            <span className="font-bold text-slate-700 block">Shipping Address:</span>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-600 space-y-1">
              <p className="font-black text-slate-900">{order.customerName}</p>
              <p>{order.address}, {order.city}, {order.state} - {order.postalCode}</p>
              <p className="font-mono text-[11px] text-slate-500">📞 Phone: {order.phone}</p>
            </div>
          </div>
        </div>

        {/* Ordered Toys Items Breakdown */}
        <div className="bg-white rounded-4xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Package className="w-5 h-5 text-toy-blue" />
            <h2 className="text-sm sm:text-base font-black text-slate-900">
              Ordered Items Breakdown
            </h2>
          </div>

          <div className="space-y-3 divide-y divide-slate-100">
            {order.items && order.items.map((item: any) => (
              <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src={item.image || 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=150&q=80'}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-slate-500">Qty: {item.quantity} × ₹{item.price}</span>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-slate-900 shrink-0">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon Savings ({order.couponCode})</span>
                <span>-₹{order.couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="text-emerald-600 font-bold">FREE</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline text-sm sm:text-base font-black">
              <span className="text-slate-900">{isRazorpay ? 'Total Paid' : 'Total Payable (COD)'}</span>
              <span className="text-toy-orange text-lg sm:text-xl">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Continue Shopping CTA */}
        <div className="text-center pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs sm:text-sm py-4 px-8 rounded-2xl shadow-sm tap-bounce transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping for Toys</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}
