import { NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import path from 'path';

export interface Album {
  id: string;
  name: string;
  cover: string;
  folder: string;
}

interface AlbumMetadata {
  folder: string;
  name: string;
}

const COVER_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const PREFERRED_ALBUMS: AlbumMetadata[] = [
  { folder: 'so-close-to-what', name: 'so close to what???' },
  { folder: 'think-later', name: 'think later' },
  { folder: 'i-used-to-think-i-could-fly', name: 'i used to think i could fly' },
  { folder: 'singles', name: 'singles & eps' },
];

const resolveCoverPath = async (albumFolder: string): Promise<string> => {
  for (const extension of COVER_EXTENSIONS) {
    const candidatePath = path.join(process.cwd(), 'public', 'covers', `${albumFolder}.${extension}`);
    try {
      const stats = await stat(candidatePath);
      if (stats.isFile()) {
        return `/covers/${albumFolder}.${extension}`;
      }
    } catch {
      // Ignore missing files and try next extension.
    }
  }

  return '/covers/all-songs.png';
};

const formatAlbumName = (folderName: string): string => {
  // Convert folder names to readable titles
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getAudioFolders = async (): Promise<string[]> => {
  const audioRoot = path.join(process.cwd(), 'public', 'audio');
  try {
    const entries = await readdir(audioRoot, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    console.error('Error reading audio folders:', error);
    return [];
  }
};

export async function GET() {
  try {
    const folders = await getAudioFolders();
    const folderSet = new Set(folders);
    const preferredOrder = PREFERRED_ALBUMS.filter((album) => folderSet.has(album.folder));
    const remainingFolders = folders
      .filter((folder) => !PREFERRED_ALBUMS.some((album) => album.folder === folder))
      .sort((a, b) => a.localeCompare(b));
    
    // Create "All Songs" album as the first item
    const albums: Album[] = [
      {
        id: 'all-songs',
        name: 'All Songs',
        cover: '/covers/all-songs.png',
        folder: 'all-songs',
      },
    ];

    // Add preferred albums in exact order and labels
    for (const album of preferredOrder) {
      const cover = await resolveCoverPath(album.folder);
      albums.push({
        id: album.folder,
        name: album.name,
        cover,
        folder: album.folder,
      });
    }

    // Add any other discovered folders after preferred albums
    for (const folder of remainingFolders) {
      const cover = await resolveCoverPath(folder);
      albums.push({
        id: folder,
        name: formatAlbumName(folder),
        cover,
        folder,
      });
    }

    return NextResponse.json({ albums });
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums', albums: [] },
      { status: 500 }
    );
  }
}
