import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { PlayerProvider } from '@/context/PlayerContext';

const horizon = localFont({
  src: '../../horizon.ttf',
  variable: '--font-horizon',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TATEIFY',
  description: 'Stream every song.',
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
      </head>
      <body className={horizon.className}>
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}
