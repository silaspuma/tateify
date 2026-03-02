const fs = require('fs/promises');
const path = require('path');
const { parseBuffer } = require('music-metadata');

const COVER_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
// Folders that contain individual singles/EPs — use embedded artwork per track
const SINGLE_FOLDERS = new Set(['singles']);
const PREFERRED_ALBUMS = [
  { folder: 'so-close-to-what', name: 'so close to what???' },
  { folder: 'think-later', name: 'think later' },
  { folder: 'i-used-to-think-i-could-fly', name: 'i used to think i could fly' },
  { folder: 'singles', name: 'singles & eps' },
];

const formatTitleFromFile = (fileName) => {
  // Remove track numbers and file extensions
  return fileName
    .replace(/\.mp3$/i, '')
    .replace(/\.flac$/i, '')
    .replace(/^songs_\d+_/, '')
    .replace(/^\d+\s*-\s*/, '')
    .replace(/Tate McRae\s*-\s*/i, '')
    .trim();
};

const resolveCoverPath = async (albumFolder) => {
  for (const extension of COVER_EXTENSIONS) {
    const candidatePath = path.join(process.cwd(), 'public', 'covers', `${albumFolder}.${extension}`);
    try {
      const stats = await fs.stat(candidatePath);
      if (stats.isFile()) {
        return `/covers/${albumFolder}.${extension}`;
      }
    } catch {
      // Ignore missing files and try next extension.
    }
  }
  return '/covers/all-songs.png';
};

const getSongsFromFolder = async (albumFolder) => {
  const audioDir = path.join(process.cwd(), 'public', 'audio', albumFolder);
  const files = await fs.readdir(audioDir);
  const audioFiles = files.filter((file) =>
    file.toLowerCase().endsWith('.mp3') || file.toLowerCase().endsWith('.flac')
  );
  const defaultCover = await resolveCoverPath(albumFolder);

  // Ensure per-song cover output directory exists for single folders
  if (SINGLE_FOLDERS.has(albumFolder)) {
    const singlesCoversDir = path.join(process.cwd(), 'public', 'covers', albumFolder);
    await fs.mkdir(singlesCoversDir, { recursive: true });
  }

  const songs = await Promise.all(
    audioFiles.map(async (file) => {
      const filePath = path.join(audioDir, file);

      try {
        const fileBuffer = await fs.readFile(filePath);
        const metadata = await parseBuffer(fileBuffer, {
          mimeType: file.toLowerCase().endsWith('.mp3') ? 'audio/mpeg' : 'audio/flac',
          path: filePath,
        });

        const duration = metadata.format.duration || 0;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const title = metadata.common.title || formatTitleFromFile(file);

        let cover = defaultCover;
        if (SINGLE_FOLDERS.has(albumFolder) && metadata.common.picture && metadata.common.picture.length > 0) {
          const pic = metadata.common.picture[0];
          const ext = pic.format.includes('png') ? 'png' : 'jpg';
          const safeName = file.replace(/\.[^.]+$/, '').replace(/[^\w\-]/g, '_');
          const coverFileName = `${safeName}.${ext}`;
          const coverFilePath = path.join(process.cwd(), 'public', 'covers', albumFolder, coverFileName);
          await fs.writeFile(coverFilePath, pic.data);
          cover = `/covers/${albumFolder}/${coverFileName}`;
        }

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
          cover: defaultCover,
          trackNumber: 0,
        };
      }
    })
  );

  return songs.sort((a, b) => a.trackNumber - b.trackNumber || a.title.localeCompare(b.title));
};

const formatAlbumName = (folderName) => {
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

async function generateManifest() {
  console.log('🎵 Generating music manifest...');

  const audioRoot = path.join(process.cwd(), 'public', 'audio');
  const entries = await fs.readdir(audioRoot, { withFileTypes: true });
  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const folderSet = new Set(folders);
  const preferredOrder = PREFERRED_ALBUMS.filter((album) => folderSet.has(album.folder));
  const remainingFolders = folders
    .filter((folder) => !PREFERRED_ALBUMS.some((album) => album.folder === folder))
    .sort((a, b) => a.localeCompare(b));

  // Create albums array
  const albums = [
    {
      id: 'all-songs',
      name: 'All Songs',
      cover: '/covers/all-songs.png',
      folder: 'all-songs',
    },
  ];

  // Add preferred albums in exact order
  for (const album of preferredOrder) {
    const cover = await resolveCoverPath(album.folder);
    albums.push({
      id: album.folder,
      name: album.name,
      cover,
      folder: album.folder,
    });
  }

  // Add any other discovered folders
  for (const folder of remainingFolders) {
    const cover = await resolveCoverPath(folder);
    albums.push({
      id: folder,
      name: formatAlbumName(folder),
      cover,
      folder,
    });
  }

  // Generate songs by folder
  const songsByFolder = {};
  for (const folder of folders) {
    console.log(`  Scanning ${folder}...`);
    songsByFolder[folder] = await getSongsFromFolder(folder);
  }

  const manifest = {
    albums,
    songsByFolder,
    generatedAt: new Date().toISOString(),
  };

  const outputPath = path.join(process.cwd(), 'src', 'data', 'manifest.json');
  await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2));

  console.log(`✅ Manifest generated at ${outputPath}`);
  console.log(`   ${albums.length} albums, ${Object.values(songsByFolder).flat().length} total songs`);
}

generateManifest().catch((error) => {
  console.error('❌ Error generating manifest:', error);
  process.exit(1);
});
