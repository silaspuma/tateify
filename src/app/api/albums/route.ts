import { NextResponse } from 'next/server';
import manifest from '@/data/manifest.json';

export interface Album {
  id: string;
  name: string;
  cover: string;
  folder: string;
}

export async function GET() {
  try {
    return NextResponse.json({ albums: manifest.albums });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums', albums: [] },
      { status: 500 }
    );
  }
}
