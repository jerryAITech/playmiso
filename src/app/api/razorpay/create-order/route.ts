import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    // Razorpay Key ID (Test key from env or dummy test key)
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag';
    const dummyOrderId = `order_rp_${Math.random().toString(36).substring(2, 12)}`;

    // Return dummy/test order details for Razorpay checkout script
    return NextResponse.json({
      id: dummyOrderId,
      amount: Math.round(amount * 100), // in paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      keyId,
      status: 'created',
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
  }
}
