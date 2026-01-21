import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vehicle Tracker",
  description: "Track fuel and maintenance",
  manifest: "/manifest.json",
  icons: {
    icon: '/icon.png',
    apple: '/icon.png', // For iOS Home Screen
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vehicle Tracker",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { I18nProvider } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <I18nProvider>
          <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 9999 }}>
            <LanguageSwitcher />
          </div>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
