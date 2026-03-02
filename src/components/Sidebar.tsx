'use client';

import React from 'react';
import { albums } from '@/data/albums';

interface SidebarProps {
  selectedAlbumId: string;
  onSelectAlbum: (albumId: string) => void;
  activeView: 'recently-played' | 'album';
  onSelectRecentlyPlayed: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedAlbumId,
  onSelectAlbum,
  activeView,
  onSelectRecentlyPlayed,
}) => {
  return (
    <div className="w-80 bg-black/20 backdrop-blur-xl h-full flex flex-col border-r border-black/10">
      {/* Logo */}
      <div className="p-8 pb-6">
        <button onClick={onSelectRecentlyPlayed} className="block w-full text-left">
          <img
            src="/logo.png"
            alt="Tateify"
            className="w-full h-auto max-w-[260px] object-contain"
          />
        </button>
      </div>

      {/* Albums Section */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-1">
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => onSelectAlbum(album.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-lg group
                ${
                  activeView === 'album' && selectedAlbumId === album.id
                    ? 'bg-accent/20 text-text'
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
      </div>
    </div>
  );
};

export default Sidebar;
