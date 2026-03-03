'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator &&
        (window.navigator as Navigator & { standalone: boolean }).standalone === true);

    if (!isPWA) return;

    const checkConnectivity = async () => {
      try {
        await fetch('/manifest.webmanifest', { cache: 'no-store' });
        setIsOffline(false);
      } catch {
        setIsOffline(true);
      }
    };

    checkConnectivity();

    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 bg-gray-900 text-white text-sm py-2 px-4 shadow-lg">
      <WifiOff size={16} />
      <span>offline mode</span>
    </div>
  );
};

export default OfflineBanner;
