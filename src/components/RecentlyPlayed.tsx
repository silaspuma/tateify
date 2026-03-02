'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Clock3, Play, Pause } from 'lucide-react';

const RecentlyPlayed: React.FC = () => {
  const { recentSongs, currentSong, isPlaying, playSong, togglePlayPause } = usePlayer();

  return (
    <div className="h-full flex flex-col">
      <div className="p-10 pb-6 bg-gradient-to-b from-accent/20 to-transparent">
        <div className="flex items-center gap-3 text-text/80 mb-4">
          <Clock3 size={24} strokeWidth={2} />
          <span className="text-base font-semibold uppercase tracking-wider">Page</span>
        </div>
        <h1 className="text-6xl font-black leading-none">Recently Played</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-10 pb-32">
        {recentSongs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-text/60 text-xl font-medium">
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
                    ${isCurrentSong ? 'bg-white/20' : 'hover:bg-white/10'}
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
                    <div className={`text-lg font-semibold truncate ${isCurrentSong ? 'text-accent' : 'text-text'}`}>
                      {song.title}
                    </div>
                    <div className="text-sm text-text/60 truncate">{album.name}</div>
                  </div>
                  <div className="text-text/60 text-sm">{song.duration}</div>
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
