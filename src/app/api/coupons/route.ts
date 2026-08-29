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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (coupons && coupons.length > 0) {
      return NextResponse.json(coupons);
    }

    return NextResponse.json(defaultCoupons);
  } catch (error: any) {
    console.error('Error fetching coupons, returning default fallback:', error);
    return NextResponse.json(defaultCoupons);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, description, discountType, discountValue, minOrderAmount, maxDiscount, validUntil } = body;

    if (!code || discountValue === undefined) {
      return NextResponse.json({ error: 'Coupon code and discount value are required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json({ error: 'Coupon with this code already exists' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        description: description || '',
        discountType: discountType || 'PERCENTAGE',
        discountValue: parseFloat(discountValue),
        minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive: true,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return NextResponse.json({ error: error.message || 'Failed to create coupon' }, { status: 500 });
  }
}
