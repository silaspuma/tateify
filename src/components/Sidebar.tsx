'use client';

import React, { useState, useEffect } from 'react';
import { Album } from '@/data/albums';

interface SidebarProps {
  selectedAlbumId: string;
  onSelectAlbum: (albumId: string) => void;
  activeView: 'recently-played' | 'album';
  onSelectRecentlyPlayed: () => void;
  albumTheme?: 'default' | 'so-close' | 'think-later';
  isDarkTheme?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedAlbumId,
  onSelectAlbum,
  activeView,
  onSelectRecentlyPlayed,
  albumTheme = 'default',
  isDarkTheme = false,
}) => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
  const isSoCloseToWhatTheme = albumTheme === 'so-close';
  const isThinkLaterTheme = albumTheme === 'think-later';

    useEffect(() => {
      const fetchAlbums = async () => {
        try {
          const response = await fetch('/api/albums');
          const data = await response.json();
          setAlbums(data.albums || []);
        } catch (error) {
          console.error('Error fetching albums:', error);
          setAlbums([]);
        } finally {
          setLoading(false);
        }
      };

      fetchAlbums();
    }, []);

  return (
    <div
      className={
        isDarkTheme
          ? 'w-80 bg-black/40 backdrop-blur-xl h-full flex flex-col border-r border-white/10'
          : 'w-80 bg-black/20 backdrop-blur-xl h-full flex flex-col border-r border-black/10'
      }
    >
      {/* Logo */}
      <div className="p-8 pb-6">
        <button onClick={onSelectRecentlyPlayed} className="block w-full text-left">
          <img
            src={isDarkTheme ? '/logo-white.png' : '/logo.png'}
            alt="Tateify"
            className="w-full h-auto max-w-[260px] object-contain"
          />
        </button>
      </div>

      {/* Albums Section */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <img
                src="/loader.gif"
                alt="Loading..."
                className="w-12 h-12 opacity-90"
              />
            </div>
          ) : (
        <div className="space-y-1">
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => onSelectAlbum(album.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-lg group
                ${
                  activeView === 'album' && selectedAlbumId === album.id
                    ? isSoCloseToWhatTheme
                      ? 'bg-white/12 text-white'
                      : isThinkLaterTheme
                        ? 'bg-accent/20 text-white'
                      : 'bg-accent/20 text-text'
                    : isSoCloseToWhatTheme
                      ? 'hover:bg-white/8 text-white/75'
                      : isThinkLaterTheme
                        ? 'hover:bg-white/10 text-white/80'
                      : 'hover:bg-white/10 text-text/80'
                }
              `}
            >
              <img
                src={album.cover}
                alt={album.name}
                className="w-14 h-14 rounded-md object-cover shadow-lg"
              />
              <span className="font-semibold text-base text-left flex-1">
                {album.name}
              </span>
            </button>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
