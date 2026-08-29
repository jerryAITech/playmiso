/**
 * Centralized PlayMiso Store Configuration
 * Update support contact, WhatsApp number, and store branding here or via Environment Variables.
 */

export const STORE_CONFIG = {
  name: 'PlayMiso',
  tagline: 'Discover the Magic of Play',
  domain: 'playmiso.vercel.app',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210', // 10 or 12 digit number with country code (91)
  whatsappDisplay: process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY || '+91 98765 43210',
  supportEmail: 'support@playmiso.in',
  operatingHours: 'Mon-Sat, 9AM-7PM IST',
  officeAddress: 'MG Road, Mumbai, Maharashtra 400001, India',
};
