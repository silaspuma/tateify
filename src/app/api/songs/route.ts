import { NextResponse } from 'next/server';
import manifest from '@/data/manifest.json';

interface ApiSong {
  title: string;
  file: string;
  duration: string;
  cover: string;
  trackNumber: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const albumFolder = searchParams.get('folder');

  try {
    if (albumFolder) {
      const songs = manifest.songsByFolder[albumFolder] || [];
      return NextResponse.json({ songs });
    }

    // Return all songs from all folders
    const songs = Object.values(manifest.songsByFolder)
      .flat()
      .sort((a: any, b: any) => a.title.localeCompare(b.title));

    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Error reading songs:', error);
    return NextResponse.json({ 
      error: 'Failed to read songs',
      songs: [] 
    }, { status: 500 });
  }
}
