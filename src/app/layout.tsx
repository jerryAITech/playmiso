import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import { ThemeProvider } from '@/lib/theme-context';
import Header from '@/components/Header';
import SubNavbar from '@/components/SubNavbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import CartDrawer from '@/components/CartDrawer';
import Toast from '@/components/Toast';
import SmoothScroll from '@/components/SmoothScroll';
import JsonLdSchema from '@/components/JsonLdSchema';
import InteractiveScreenCar from '@/components/InteractiveScreenCar';
import FloatingParticles from '@/components/FloatingParticles';
import FestiveBackgroundVectors from '@/components/FestiveBackgroundVectors';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PlayMiso – Discover the Magic of Play (Cash On Delivery Toys)',
    template: '%s | PlayMiso',
  },
  description:
    'PlayMiso – Discover the Magic of Play. Shop safe, educational STEM kits, cuddly plushies, RC cars, puzzles and action figures for kids of all ages with Cash on Delivery (COD) across India.',
  keywords: [
    'playmiso',
    'toys online india',
    'buy toys online',
    'educational toys',
    'stem toys',
    'soft toys teddy bear',
    'rc cars for kids',
    'puzzles for children',
    'cod toys shopping',
  ],
  authors: [{ name: 'PlayMiso Store' }],
  icons: {
    icon: [
      { url: '/icon' },
    ],
    apple: [
      { url: '/apple-icon' },
    ],
  },
  openGraph: {
    title: 'PlayMiso – Discover the Magic of Play (Cash On Delivery)',
    description:
      'PlayMiso – Discover the Magic of Play. Shop safe, high quality toys, STEM kits, RC cars & plushies with Cash on Delivery across India.',
    url: 'https://playmiso.vercel.app',
    siteName: 'PlayMiso',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'PlayMiso Toys Store',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#FF7844',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full scroll-smooth ${inter.variable} ${poppins.variable}`}
    >
      <body className="font-sans flex flex-col min-h-full antialiased selection:bg-toy-orange selection:text-white pb-16 md:pb-0">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <JsonLdSchema />
              <Toast />
              <SmoothScroll />
              <FloatingParticles />
              <FestiveBackgroundVectors />
              <Header />
              <SubNavbar />
              <InteractiveScreenCar />
              <CartDrawer />
              <main className="flex-1">{children}</main>
              <MobileBottomNav />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
