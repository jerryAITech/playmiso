import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { isDefault: 'desc' },
    });

    return NextResponse.json(addresses);
  } catch (error: any) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, street, city, state, postalCode, isDefault } = body;

    if (!fullName || !phone || !street || !city || !postalCode) {
      return NextResponse.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    // If setting as default, unset previous default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        fullName,
        phone,
        street,
        city,
        state: state || 'Maharashtra',
        postalCode,
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error: any) {
    console.error('Error adding address:', error);
    return NextResponse.json({ error: error.message || 'Failed to add address' }, { status: 500 });
  }
}
