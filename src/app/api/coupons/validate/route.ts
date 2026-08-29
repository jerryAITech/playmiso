import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const defaultCoupons = [
  {
    id: 'cp1',
    code: 'PLAYMISO10',
    description: 'Flat 10% OFF on all toy orders',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscount: 500,
    isActive: true,
  },
  {
    id: 'cp2',
    code: 'FIRSTTOY',
    description: 'Flat ₹100 OFF for new parents',
    discountType: 'FIXED',
    discountValue: 100,
    minOrderAmount: 499,
    maxDiscount: null,
    isActive: true,
  },
  {
    id: 'cp3',
    code: 'FESTIVE20',
    description: 'Extra 20% OFF festive celebration',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minOrderAmount: 999,
    maxDiscount: 1000,
    isActive: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    let coupon: any = null;

    try {
      coupon = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });
    } catch {
      coupon = defaultCoupons.find((c) => c.code === cleanCode);
    }

    if (!coupon) {
      coupon = defaultCoupons.find((c) => c.code === cleanCode);
    }

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
    }

    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return NextResponse.json({ error: 'This coupon code has expired' }, { status: 400 });
    }

    const orderSubtotal = parseFloat(subtotal) || 0;

    if (coupon.minOrderAmount && orderSubtotal < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          error: `Coupon applies on minimum order value of ₹${coupon.minOrderAmount}. Add ₹${(
            coupon.minOrderAmount - orderSubtotal
          ).toFixed(0)} more!`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (orderSubtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      // FIXED
      discountAmount = Math.min(coupon.discountValue, orderSubtotal);
    }

    discountAmount = Math.round(discountAmount * 100) / 100;

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
      message: `🎉 Coupon "${coupon.code}" applied! You saved ₹${discountAmount}`,
    });
  } catch (error: any) {
    console.error('Coupon validation error, checking default coupons:', error);
    return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
  }
}
