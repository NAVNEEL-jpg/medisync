import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Outfit, DM_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AccessibilityProvider } from '@/context/AccessibilityContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050D1A',
};

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MediSync CareLink | Technology That Cares. Healthcare That Reaches Everyone.',
  description: 'Assistive healthcare ecosystem combining affordable ESP32 wearable hardware, an ABDM-aligned digital health vault, and a consent-driven care network. Designed for Bharat Challenge 2026.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${outfit.variable} ${dmSans.variable} h-full antialiased overflow-x-hidden`}>
      <body className="min-h-full flex flex-col overflow-x-hidden w-full max-w-full">
        <AuthProvider>
          <AccessibilityProvider>
            {children}
          </AccessibilityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
