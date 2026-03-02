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
  const albumTheme =
    selectedAlbum.id === 'so-close-to-what'
      ? 'so-close'
      : selectedAlbum.id === 'think-later'
        ? 'think-later'
        : 'default';
  const isSoCloseToWhatTheme = albumTheme === 'so-close';
  const isThinkLaterTheme = albumTheme === 'think-later';
  const isDarkTheme = albumTheme !== 'default';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      className={
        isDarkTheme
          ? 'h-screen flex flex-col overflow-hidden bg-black text-white'
          : 'h-screen flex flex-col overflow-hidden'
      }
    >
      <Loader isLoading={isLoading} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={
            isDarkTheme
              ? 'lg:hidden fixed top-6 left-6 z-50 bg-black/45 backdrop-blur-xl text-white p-3 rounded-full shadow-xl border border-white/20'
              : 'lg:hidden fixed top-6 left-6 z-50 bg-black/30 backdrop-blur-xl text-white p-3 rounded-full shadow-xl border border-white/10'
          }
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
            albumTheme={albumTheme}
            isDarkTheme={isDarkTheme}
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
            className={
              isDarkTheme
                ? 'lg:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-30'
                : 'lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30'
            }
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden relative">
          {/* Base album mood gradient (applies to all pages) */}
          <div className="absolute inset-0 bg-gradient-to-b from-accent/22 via-accent/10 to-background/55" />

          {/* Album-specific base gradient */}
          <div
            className={
              isSoCloseToWhatTheme
                ? 'absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black'
                : isThinkLaterTheme
                  ? 'absolute inset-0 bg-gradient-to-b from-black via-accent/10 to-black'
                : 'absolute inset-0 bg-gradient-to-b from-accent/10 via-background to-background'
            }
          />

          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${selectedAlbum.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: isThinkLaterTheme ? 'center 28%' : isSoCloseToWhatTheme ? 'center 18%' : 'center',
              opacity: isThinkLaterTheme ? 0.62 : isSoCloseToWhatTheme ? 0.4 : 0.34,
              filter: isThinkLaterTheme ? 'saturate(1.25) contrast(1.08)' : 'saturate(1.06)',
            }}
          />

          <div
            className={
              isDarkTheme
                ? 'absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/78'
                : 'absolute inset-0 bg-gradient-to-b from-background/55 via-background/75 to-background/90'
            }
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
              <RecentlyPlayed albumTheme={albumTheme} />
            ) : (
              <SongList album={selectedAlbum} albumTheme={albumTheme} />
            )}
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <PlayerBar albumTheme={albumTheme} />
    </main>
  );
}
