import { NextResponse } from 'next/server';
import { parseBuffer } from 'music-metadata';
import { readdir, readFile } from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const albumFolder = searchParams.get('folder');

  if (!albumFolder) {
    return NextResponse.json({ error: 'Album folder required' }, { status: 400 });
  }

  try {
    const audioDir = path.join(process.cwd(), 'public', 'audio', albumFolder);
    const files = await readdir(audioDir);
    const mp3Files = files.filter(file => file.toLowerCase().endsWith('.mp3'));

    const songs = await Promise.all(
      mp3Files.map(async (file) => {
        const filePath = path.join(audioDir, file);
        
        try {
          const fileBuffer = await readFile(filePath);
          const metadata = await parseBuffer(fileBuffer, {
            mimeType: 'audio/mpeg',
            path: filePath,
          });
          
          // Format duration as M:SS or MM:SS
          const duration = metadata.format.duration || 0;
          const minutes = Math.floor(duration / 60);
          const seconds = Math.floor(duration % 60);
          const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

          // Get title from metadata or use filename
          const title = metadata.common.title || 
                       file.replace('.mp3', '').replace(/-/g, ' ');

          return {
            title,
            file: `/audio/${albumFolder}/${file}`,
            duration: formattedDuration,
            cover: `/covers/${albumFolder}.jpg`,
            trackNumber: metadata.common.track?.no || 0,
          };
        } catch (error) {
          console.error(`Error reading metadata for ${file}:`, error);
          return {
            title: file.replace('.mp3', '').replace(/-/g, ' '),
            file: `/audio/${albumFolder}/${file}`,
            duration: '0:00',
            cover: `/covers/${albumFolder}.jpg`,
            trackNumber: 0,
          };
        }
      })
    );

    // Sort by track number
    songs.sort((a, b) => a.trackNumber - b.trackNumber);

    return NextResponse.json({ songs });
  } catch (error) {
    console.error('Error reading album folder:', error);
    return NextResponse.json({ 
      error: 'Failed to read album folder',
      songs: [] 
    }, { status: 500 });
  }
}
