'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Clock3, Play, Pause } from 'lucide-react';

interface RecentlyPlayedProps {
  albumTheme?: 'default' | 'so-close' | 'think-later';
}

const RecentlyPlayed: React.FC<RecentlyPlayedProps> = ({ albumTheme = 'default' }) => {
  const isDarkTheme = albumTheme !== 'default';

  const { recentSongs, currentSong, isPlaying, playSong, togglePlayPause } = usePlayer();

  return (
    <div className="flex flex-col">
      <div className={isDarkTheme ? 'p-10 pb-6 bg-gradient-to-b from-black/60 via-accent/10 to-transparent' : 'p-10 pb-6 bg-gradient-to-b from-accent/20 to-transparent'}>
        <div className={isDarkTheme ? 'flex items-center gap-3 text-white/80 mb-4' : 'flex items-center gap-3 text-text/80 mb-4'}>
          <Clock3 size={24} strokeWidth={2} />
          <span className="text-base font-semibold uppercase tracking-wider">Page</span>
        </div>
        <h1 className={isDarkTheme ? 'text-6xl font-black leading-none text-white' : 'text-6xl font-black leading-none'}>Recently Played</h1>
      </div>

      <div className="px-10 pb-8">
        {recentSongs.length === 0 ? (
          <div className={isDarkTheme ? 'h-full flex items-center justify-center text-white/60 text-xl font-medium' : 'h-full flex items-center justify-center text-text/60 text-xl font-medium'}>
            Play a song to see it here.
          </div>
        ) : (
          <div className="space-y-2">
            {recentSongs.map(({ song, album }, index) => {
              const isCurrentSong = currentSong?.file === song.file;

              return (
                <button
                  key={`${song.file}-${index}`}
                  onClick={() => {
                    if (isCurrentSong) {
                      togglePlayPause();
                    } else {
                      playSong(song, album, [song], 0);
                    }
                  }}
                  className={`
                    w-full grid grid-cols-[48px_1fr_auto] items-center gap-4 px-6 py-4 rounded-xl text-left
                    ${isCurrentSong ? (isDarkTheme ? 'bg-white/15' : 'bg-white/20') : (isDarkTheme ? 'hover:bg-white/10' : 'hover:bg-white/10')}
                  `}
                >
                  <div className="flex items-center justify-center text-accent">
                    {isCurrentSong && isPlaying ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-lg font-semibold truncate ${isCurrentSong ? 'text-accent' : (isDarkTheme ? 'text-white' : 'text-text')}`}>
                      {song.title}
                    </div>
                    <div className={isDarkTheme ? 'text-sm text-white/60 truncate' : 'text-sm text-text/60 truncate'}>{album.name}</div>
                  </div>
                  <div className={isDarkTheme ? 'text-white/60 text-sm' : 'text-text/60 text-sm'}>{song.duration}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyPlayed;
