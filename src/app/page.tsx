'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SongList from '@/components/SongList';
import RecentlyPlayed from '@/components/RecentlyPlayed';
import PlayerBar from '@/components/PlayerBar';
import Loader from '@/components/Loader';
import { Album } from '@/data/albums';
import { usePlayer } from '@/context/PlayerContext';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState('all-songs');
  const [activeView, setActiveView] = useState<'recently-played' | 'album'>('album');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentSong } = usePlayer();

    useEffect(() => {
      const fetchAlbums = async () => {
        try {
          const response = await fetch('/api/albums');
          const data = await response.json();
          const fetchedAlbums = data.albums || [];
          setAlbums(fetchedAlbums);
          if (fetchedAlbums.length > 0 && !selectedAlbumId) {
            setSelectedAlbumId(fetchedAlbums[0].id);
          }
        } catch (error) {
          console.error('Error fetching albums:', error);
          setAlbums([]);
        }
      };

      fetchAlbums();
    }, []);

      const selectedAlbum = albums.find((album) => album.id === selectedAlbumId);
  const albumTheme =
        selectedAlbum?.id === 'so-close-to-what'
      ? 'so-close'
          : selectedAlbum?.id === 'think-later'
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
          ? 'min-h-screen flex flex-col bg-black text-white pb-64 lg:pb-36'
          : 'min-h-screen flex flex-col pb-64 lg:pb-36'
      }
    >
      <Loader isLoading={isLoading} />

      <div className="flex flex-1">
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
        <div className="flex-1 relative">
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
                backgroundImage: selectedAlbum ? `url(${selectedAlbum.cover})` : 'none',
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

          <div className="relative z-10">
            {activeView === 'recently-played' ? (
              <RecentlyPlayed albumTheme={albumTheme} />
              ) : selectedAlbum ? (
                <SongList album={selectedAlbum} albumTheme={albumTheme} />
            ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <img
                    src="/loader.gif"
                    alt="Loading..."
                    className="w-16 h-16 opacity-90"
                  />
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <PlayerBar albumTheme={albumTheme} />
    </main>
  );
}
