import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user: user || null }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user profile, returning null safely:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
