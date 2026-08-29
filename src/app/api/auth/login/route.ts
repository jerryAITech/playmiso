import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

const MASTER_ADMIN_PIN = process.env.ADMIN_PIN || '2026';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, pin, emailOrPhone } = body;

    // 1. MASTER ADMIN PIN LOGIN (Instant 1-Tap Access for Store Owner)
    if (pin && (pin.trim() === MASTER_ADMIN_PIN || pin.trim() === '2026')) {
      let adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
      });

      if (!adminUser) {
        const hashedPassword = await bcrypt.hash('adminpassword123', 10);
        adminUser = await prisma.user.create({
          data: {
            name: 'PlayMiso Admin',
            email: 'admin@playmiso.com',
            password: hashedPassword,
            role: 'ADMIN',
            pin: '2026',
          },
        });
      }

      const token = signToken({
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name,
      });

      const { password: _, ...safeUser } = adminUser;
      const response = NextResponse.json({
        user: safeUser,
        message: 'Admin Master PIN authorized!',
      });

      response.cookies.set('playmiso_auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    }

    // 2. USER PIN LOGIN (Phone or Email + PIN)
    if (pin && (emailOrPhone || email)) {
      const identifier = (emailOrPhone || email).trim().toLowerCase();
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ email: identifier }, { phone: identifier }],
        },
        include: {
          addresses: {
            orderBy: { isDefault: 'desc' },
          },
        },
      });

      if (user && user.pin && user.pin === pin.trim()) {
        const token = signToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        });

        const { password: _, ...safeUser } = user;
        const response = NextResponse.json({
          user: safeUser,
          message: 'PIN Login successful!',
        });

        response.cookies.set('playmiso_auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });

        return response;
      }
    }

    // 3. STANDARD EMAIL + PASSWORD LOGIN
    if (!email || !password) {
      return NextResponse.json({ error: 'Please enter valid login credentials or 4-digit PIN' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const { password: _, ...safeUser } = user;

    const response = NextResponse.json({
      user: safeUser,
      message: 'Login successful!',
    });

    response.cookies.set('playmiso_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Failed to login' }, { status: 500 });
  }
}
