import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { getFirebaseDatabase } from '@/lib/firebase';
import { subscriptionKey } from '@/lib/subscriptionKey';
import { ref, get, remove } from 'firebase/database';

function getWebPushConfig() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@tateify.app';

  if (!publicKey || !privateKey) {
    throw new Error(
      'VAPID keys are not configured. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in your environment variables.'
    );
  }

  return { publicKey, privateKey, subject };
}

export async function POST(request: NextRequest) {
  // Simple admin auth via secret header or body field
  const adminSecret = process.env.ADMIN_SECRET;
  const authHeader = request.headers.get('x-admin-secret');

  if (!adminSecret || authHeader !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, body, url } = await request.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'title and body are required' }, { status: 400 });
    }

    const { publicKey, privateKey, subject } = getWebPushConfig();
    webpush.setVapidDetails(subject, publicKey, privateKey);

    const database = getFirebaseDatabase();
    const snapshot = await get(ref(database, 'pushSubscriptions'));

    if (!snapshot.exists()) {
      return NextResponse.json({ sent: 0, message: 'No subscribers' });
    }

    const subscriptions = Object.values(snapshot.val()) as PushSubscriptionJSON[];
    const payload = JSON.stringify({ title, body, url: url || '/' });

    let sent = 0;
    const staleKeys: string[] = [];

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub as webpush.PushSubscription, payload);
          sent++;
        } catch (err: unknown) {
          const statusCode = (err as { statusCode?: number }).statusCode;
          // 410 Gone / 404 Not Found means the subscription is no longer valid
          if (statusCode === 410 || statusCode === 404) {
            staleKeys.push(subscriptionKey(sub.endpoint!));
          } else {
            console.error('Push error for subscription:', err);
          }
        }
      })
    );

    // Remove stale subscriptions
    await Promise.all(
      staleKeys.map((key) => remove(ref(database, `pushSubscriptions/${key}`)))
    );

    return NextResponse.json({ sent, staleRemoved: staleKeys.length });
  } catch (error) {
    console.error('Error sending push notifications:', error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
