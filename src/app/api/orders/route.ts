import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { sendOrderConfirmationNotification } from '@/lib/email';

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
    console.error('Error fetching orders, returning empty list:', error);
    return NextResponse.json([]);
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
      paymentMethod = 'COD',
    } = body;

    if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required customer delivery information or items' }, { status: 400 });
    }

    const orderNumber = `TOY-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Order with nested items in a safe transaction
    const createdOrder = await prisma.$transaction(async (tx) => {
      // 1. Verify if user actually exists in the database to prevent foreign key violation
      let validUserId: string | null = null;
      if (user?.id) {
        try {
          const userExists = await tx.user.findUnique({
            where: { id: user.id },
            select: { id: true },
          });
          if (userExists) validUserId = userExists.id;
        } catch {
          validUserId = null;
        }
      }

      // 2. Verify each product ID to avoid foreign key violation on OrderItem.productId
      const itemDataPromises = items.map(async (item: any) => {
        let validProductId: string | null = null;
        if (item.id) {
          try {
            const prodExists = await tx.product.findUnique({
              where: { id: item.id },
              select: { id: true },
            });
            if (prodExists) validProductId = prodExists.id;
          } catch {
            validProductId = null;
          }
        }
        return {
          productId: validProductId,
          title: item.title,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity) || 1,
          image: item.image || null,
        };
      });

      const safeItems = await Promise.all(itemDataPromises);

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: validUserId,
          customerName: customerName || user.name,
          email: email || user.email,
          phone,
          address,
          city: city || 'Local',
          state: state || 'State',
          postalCode: postalCode || '000000',
          paymentMethod: paymentMethod === 'RAZORPAY' ? 'RAZORPAY' : 'COD',
          subtotal: parseFloat(subtotal),
          couponCode: couponCode || null,
          couponDiscount: parseFloat(couponDiscount || 0),
          shippingFee: parseFloat(shippingFee || 0),
          totalAmount: parseFloat(totalAmount),
          status: paymentMethod === 'RAZORPAY' ? 'PROCESSING' : 'PENDING',
          notes: notes || null,
          items: {
            create: safeItems,
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

      // Reduce product stock safely
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
            // Non-blocking if product ID was synthetic/fallback
          }
        }
      }

      return order;
    });

    // Trigger free email & notification dispatcher (non-blocking)
    sendOrderConfirmationNotification({
      orderNumber: createdOrder.orderNumber,
      customerName: createdOrder.customerName,
      email: createdOrder.email,
      phone: createdOrder.phone,
      totalAmount: createdOrder.totalAmount,
      paymentMethod: createdOrder.paymentMethod,
      items: items.map((i: any) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price,
      })),
      address: createdOrder.address,
      city: createdOrder.city,
      postalCode: createdOrder.postalCode,
    }).catch((err) => console.error('Notification error:', err));

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}
