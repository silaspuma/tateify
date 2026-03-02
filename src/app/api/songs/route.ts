import { NextResponse } from 'next/server';
import { parseBuffer } from 'music-metadata';
import { readdir, readFile, stat } from 'fs/promises';
import path from 'path';

interface ApiSong {
  title: string;
  file: string;
  duration: string;
  cover: string;
  trackNumber: number;
}

const COVER_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

const formatTitleFromFile = (fileName: string) =>
  fileName.replace(/\.mp3$/i, '').replace(/-/g, ' ');

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

const getSongsFromFolder = async (albumFolder: string): Promise<ApiSong[]> => {
  const audioDir = path.join(process.cwd(), 'public', 'audio', albumFolder);
  const files = await readdir(audioDir);
  const mp3Files = files.filter((file) => file.toLowerCase().endsWith('.mp3'));
  const cover = await resolveCoverPath(albumFolder);

  const songs = await Promise.all(
    mp3Files.map(async (file) => {
      const filePath = path.join(audioDir, file);

      try {
        const fileBuffer = await readFile(filePath);
        const metadata = await parseBuffer(fileBuffer, {
          mimeType: 'audio/mpeg',
          path: filePath,
        });

        const duration = metadata.format.duration || 0;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const title = metadata.common.title || formatTitleFromFile(file);

        return {
          title,
          file: `/audio/${albumFolder}/${file}`,
          duration: formattedDuration,
          cover,
          trackNumber: metadata.common.track?.no || 0,
        };
      } catch (error) {
        console.error(`Error reading metadata for ${file}:`, error);
        return {
          title: formatTitleFromFile(file),
          file: `/audio/${albumFolder}/${file}`,
          duration: '0:00',
          cover,
          trackNumber: 0,
        };
      }
    })
  );

  return songs.sort((a, b) => a.trackNumber - b.trackNumber || a.title.localeCompare(b.title));
};

const getAudioFolders = async (): Promise<string[]> => {
  const audioRoot = path.join(process.cwd(), 'public', 'audio');
  const entries = await readdir(audioRoot, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const albumFolder = searchParams.get('folder');

  try {
    if (albumFolder) {
      const songs = await getSongsFromFolder(albumFolder);
      return NextResponse.json({ songs });
    }

    const folders = await getAudioFolders();
    const songsByFolder = await Promise.all(folders.map((folder) => getSongsFromFolder(folder)));
    const songs = songsByFolder
      .flat()
      .sort((a, b) => a.title.localeCompare(b.title));

    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Error reading album folder:', error);
    return NextResponse.json({ 
      error: 'Failed to read album folder',
      songs: [] 
    }, { status: 500 });
  }
}
