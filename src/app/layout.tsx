import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { PlayerProvider } from '@/context/PlayerContext';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import OfflineBanner from '@/components/OfflineBanner';
import PWAInstallBanner from '@/components/PWAInstallBanner';

const horizon = localFont({
  src: '../../horizon.ttf',
  variable: '--font-horizon',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TATEIFY',
  description: 'Stream every song.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'TATEIFY',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/loader.gif" as="image" type="image/gif" />
        <link rel="apple-touch-icon" href="/appicon.png" />
        <meta name="theme-color" content="#f19e31" />
      </head>
      <body className={horizon.className}>
        <PlayerProvider>
          <ServiceWorkerRegistration />
          <OfflineBanner />
          <PWAInstallBanner />
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}
