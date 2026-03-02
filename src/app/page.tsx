'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SongList from '@/components/SongList';
import RecentlyPlayed from '@/components/RecentlyPlayed';
import PlayerBar from '@/components/PlayerBar';
import Loader from '@/components/Loader';
import { albums } from '@/data/albums';
import { usePlayer } from '@/context/PlayerContext';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [selectedAlbumId, setSelectedAlbumId] = useState(albums[0].id);
  const [activeView, setActiveView] = useState<'recently-played' | 'album'>('album');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentSong } = usePlayer();

  const selectedAlbum = albums.find((album) => album.id === selectedAlbumId) || albums[0];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Loader isLoading={isLoading} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden fixed top-6 left-6 z-50 bg-black/30 backdrop-blur-xl text-white p-3 rounded-full shadow-xl border border-white/10"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <div
          className={`
            fixed lg:relative inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <Sidebar
            selectedAlbumId={selectedAlbumId}
            activeView={activeView}
            onSelectRecentlyPlayed={() => {
              setActiveView('recently-played');
              setIsMobileMenuOpen(false);
            }}
            onSelectAlbum={(id) => {
              setSelectedAlbumId(id);
              setActiveView('album');
              setIsMobileMenuOpen(false);
            }}
          />
        </div>

        {/* Overlay for mobile menu */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Gradient Background */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-accent/10 via-background to-background"
          />
          
          {/* Optional: Blurred background when playing */}
          {currentSong && (
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                backgroundImage: `url(${currentSong.cover})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(100px)',
                opacity: 0.08,
              }}
            />
          )}

          <div className="relative z-10 h-full overflow-y-auto">
            {activeView === 'recently-played' ? (
              <RecentlyPlayed />
            ) : (
              <SongList album={selectedAlbum} />
            )}
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <PlayerBar />
    </main>
  );
}
