import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query = searchParams.get('q');

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (query) {
      where.OR = [
        { orderNumber: { contains: query } },
        { customerName: { contains: query } },
        { phone: { contains: query } },
        { email: { contains: query } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Strictly verify logged in user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Please log in to your PlayMiso account to place an order.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      notes,
      items,
      subtotal,
      couponCode,
      couponDiscount,
      shippingFee,
      totalAmount,
    } = body;

    if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required customer delivery information or items' }, { status: 400 });
    }

    const orderNumber = `TOY-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Order with nested items in a transaction
    const createdOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          customerName: customerName || user.name,
          email: email || user.email,
          phone,
          address,
          city: city || 'Local',
          state: state || 'State',
          postalCode: postalCode || '000000',
          paymentMethod: 'COD',
          subtotal: parseFloat(subtotal),
          couponCode: couponCode || null,
          couponDiscount: parseFloat(couponDiscount || 0),
          shippingFee: parseFloat(shippingFee || 0),
          totalAmount: parseFloat(totalAmount),
          status: 'PENDING',
          notes: notes || null,
          items: {
            create: items.map((item: any) => ({
              productId: item.id || null,
              title: item.title,
              price: parseFloat(item.price),
              quantity: parseInt(item.quantity) || 1,
              image: item.image || null,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Increment coupon usage count if coupon applied
      if (couponCode) {
        try {
          await tx.coupon.update({
            where: { code: couponCode },
            data: { usageCount: { increment: 1 } },
          });
        } catch {
          // Non-blocking
        }
      }

      // Reduce product stock
      for (const item of items) {
        if (item.id) {
          try {
            await tx.product.update({
              where: { id: item.id },
              data: {
                stock: {
                  decrement: parseInt(item.quantity) || 1,
                },
              },
            });
          } catch {
            // Non-blocking if product was deleted
          }
        }
      }

      return order;
    });

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}
