import { NextResponse } from 'next/server';
import { getFirebaseDatabase } from '@/lib/firebase';
import { ref, get, runTransaction } from 'firebase/database';

export async function GET() {
  try {
    const database = getFirebaseDatabase();
    const streamsRef = ref(database, 'totalStreams');
    const snapshot = await get(streamsRef);
    const count = snapshot.exists() ? snapshot.val() : 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching stream count:', error);
    return NextResponse.json({ error: 'Failed to fetch stream count' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const database = getFirebaseDatabase();
    const streamsRef = ref(database, 'totalStreams');
    const result = await runTransaction(streamsRef, (current) => (current || 0) + 1);
    const newCount = result.snapshot.val() ?? 0;
    return NextResponse.json({ count: newCount });
  } catch (error) {
    console.error('Error incrementing stream count:', error);
    return NextResponse.json({ error: 'Failed to increment stream count' }, { status: 500 });
  }
}
