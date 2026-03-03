import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseDatabase } from '@/lib/firebase';
import { subscriptionKey } from '@/lib/subscriptionKey';
import { ref, set, remove } from 'firebase/database';

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();

    if (!subscription?.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    const database = getFirebaseDatabase();
    const key = subscriptionKey(subscription.endpoint);
    await set(ref(database, `pushSubscriptions/${key}`), subscription);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
    }

    const database = getFirebaseDatabase();
    const key = subscriptionKey(endpoint);
    await remove(ref(database, `pushSubscriptions/${key}`));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing push subscription:', error);
    return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 });
  }
}
