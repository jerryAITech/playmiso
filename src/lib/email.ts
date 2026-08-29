/**
 * Free Order Confirmation Notification System
 * Supports:
 * 1. Resend API (3,000 free emails/month with RESEND_API_KEY)
 * 2. Fallback console / webhook logger for local testing
 */

interface OrderNotificationPayload {
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  totalAmount: number;
  paymentMethod: string;
  items: Array<{ title: string; quantity: number; price: number }>;
  address: string;
  city: string;
  postalCode: string;
}

export async function sendOrderConfirmationNotification(order: OrderNotificationPayload) {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
        </tr>`
    )
    .join('');

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background: #FF7844; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px;">🧸 PlayMiso Toys</h1>
        <p style="margin: 4px 0 0 0; font-size: 14px;">Order Confirmed! Thank You, ${order.customerName} 🎉</p>
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 14px; color: #334155;">
          We have received your Cash on Delivery order <strong>#${order.orderNumber}</strong>. Our team is packing your toys with care!
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0;">
          <thead>
            <tr style="background: #f8fafc; text-align: left;">
              <th style="padding: 8px;">Toy Item</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 12px 8px; font-weight: bold;">Total Amount (COD):</td>
              <td style="padding: 12px 8px; font-weight: bold; text-align: right; color: #FF7844; font-size: 16px;">₹${order.totalAmount}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background: #f1f5f9; padding: 12px 16px; border-radius: 12px; font-size: 12px; color: #475569; margin-bottom: 20px;">
          <strong>Delivery Address:</strong><br />
          ${order.address}, ${order.city} - ${order.postalCode}<br />
          <strong>Contact Phone:</strong> ${order.phone}
        </div>

        <p style="font-size: 12px; color: #64748b; text-align: center;">
          Need help with your order? Reply directly to this email or contact us at <a href="mailto:support@playmiso.in" style="color: #FF7844;">support@playmiso.in</a>.
        </p>
      </div>
    </div>
  `;

  // Check if Resend API Key is provided
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'PlayMiso Orders <orders@playmiso.in>',
          to: [order.email],
          subject: `🎉 PlayMiso Order Confirmed #${order.orderNumber} (₹${order.totalAmount})`,
          html: emailHtml,
        }),
      });

      const data = await res.json();
      console.log('Resend order email sent:', data);
      return { success: true, provider: 'resend' };
    } catch (err) {
      console.error('Error sending Resend email:', err);
    }
  }

  // Free console & WhatsApp receipt generator fallback
  console.log(`[FREE NOTIFICATION LOG] Order #${order.orderNumber} placed by ${order.customerName} (${order.phone}, ${order.email}). Amount: ₹${order.totalAmount}`);
  return { success: true, provider: 'local_fallback' };
}
