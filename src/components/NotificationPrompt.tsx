'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; i++) {
    view[i] = rawData.charCodeAt(i);
  }
  return view;
}

const NotificationPrompt = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) return;

    // Only prompt when running as an installed PWA
    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator &&
        (window.navigator as Navigator & { standalone: boolean }).standalone === true);

    if (!isPWA) return;

    // Don't re-prompt if already decided
    if (Notification.permission !== 'default') return;
    if (localStorage.getItem('notification-prompt-dismissed') === 'true') return;

    setShow(true);
  }, []);

  const handleAllow = async () => {
    setShow(false);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const registration = await navigator.serviceWorker.ready;
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error('NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set');
        return;
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      });
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notification-prompt-dismissed', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm bg-black/90 backdrop-blur-xl border border-white/15 rounded-2xl text-white px-4 py-4 shadow-2xl">
      <div className="flex items-start gap-3">
        <div className="bg-accent rounded-xl p-2 shrink-0 mt-0.5">
          <Bell size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm leading-tight">Enable notifications</p>
          <p className="mt-1 text-xs text-white/70">
            Get notified when new music drops or something exciting happens.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAllow}
              className="bg-accent hover:opacity-90 transition-opacity text-white text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Allow
            </button>
            <button
              onClick={handleDismiss}
              className="text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white/40 hover:text-white transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default NotificationPrompt;
