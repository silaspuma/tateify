'use client';

import { useEffect, useState } from 'react';
import { Download, X, Wifi, Music, Radio } from 'lucide-react';

const PWAInstallBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as Navigator & { standalone: boolean }).standalone === true);

    const dismissed = localStorage.getItem('pwa-banner-dismissed') === 'true';

    if (!isPWA && !dismissed) {
      setShow(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('pwa-banner-dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] bg-black/85 backdrop-blur-xl border-t border-white/10 text-white px-4 py-4 shadow-2xl">
      <div className="max-w-lg mx-auto">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="bg-accent rounded-xl p-2 shrink-0 mt-0.5">
              <Download size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-base leading-tight">Add to Home Screen for more features</p>
              <ul className="mt-2 space-y-1.5">
                <li className="flex items-center gap-2 text-sm text-white/80">
                  <Wifi size={14} className="text-accent shrink-0" />
                  Offline mode
                </li>
                <li className="flex items-center gap-2 text-sm text-white/80">
                  <Music size={14} className="text-accent shrink-0" />
                  320kb/s audio
                </li>
                <li className="flex items-center gap-2 text-sm text-white/80">
                  <Radio size={14} className="text-accent shrink-0" />
                  Stream when app is closed
                </li>
              </ul>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/50 hover:text-white shrink-0 mt-0.5 transition-colors"
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
