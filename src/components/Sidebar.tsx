'use client';

import React from 'react';
import { albums } from '@/data/albums';
import { Home, Music, Heart, Clock } from 'lucide-react';

interface SidebarProps {
  selectedAlbumId: string;
  onSelectAlbum: (albumId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedAlbumId, onSelectAlbum }) => {
  return (
    <div className="w-80 bg-black/20 backdrop-blur-xl h-full flex flex-col border-r border-black/10">
      {/* Logo */}
      <div className="p-8 pb-6">
        <img
          src="/logo.png"
          alt="Tateify"
          className="w-full h-auto max-w-[200px]"
        />
      </div>

      {/* Navigation Items */}
      <div className="px-6 mb-8">
        <nav className="space-y-2">
          <button className="w-full flex items-center gap-4 px-4 py-3 text-text/70 hover:text-text rounded-lg hover:bg-white/10 font-medium text-lg">
            <Home size={28} strokeWidth={2} />
            <span>Home</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-text/70 hover:text-text rounded-lg hover:bg-white/10 font-medium text-lg">
            <Music size={28} strokeWidth={2} />
            <span>Your Library</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-text/70 hover:text-text rounded-lg hover:bg-white/10 font-medium text-lg">
            <Heart size={28} strokeWidth={2} />
            <span>Liked Songs</span>
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-text/70 hover:text-text rounded-lg hover:bg-white/10 font-medium text-lg">
            <Clock size={28} strokeWidth={2} />
            <span>Recently Played</span>
          </button>
        </nav>
      </div>

      <div className="h-px bg-black/10 mx-6 mb-6"></div>

      {/* Albums Section */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-text/50 mb-4 px-4">
          Albums
        </h2>
        <div className="space-y-1">
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => onSelectAlbum(album.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-lg group
                ${
                  selectedAlbumId === album.id
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
