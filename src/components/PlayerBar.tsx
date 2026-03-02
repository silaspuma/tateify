'use client';

import React, { useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface PlayerBarProps {
  albumTheme?: 'default' | 'so-close' | 'think-later';
}

const PlayerBar: React.FC<PlayerBarProps> = ({ albumTheme = 'default' }) => {
  const isSoCloseToWhatTheme = albumTheme === 'so-close';
  const isThinkLaterTheme = albumTheme === 'think-later';
  const isDarkTheme = albumTheme !== 'default';

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
  } = usePlayer();

  const progressBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  if (!currentSong) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={
        isSoCloseToWhatTheme
          ? 'fixed bottom-0 left-0 right-0 bg-black/65 backdrop-blur-2xl border-t border-white/10 px-6 py-4 shadow-2xl'
          : isThinkLaterTheme
            ? 'fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-2xl border-t border-accent/30 px-6 py-4 shadow-2xl'
          : 'fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-2xl border-t border-black/20 px-6 py-4 shadow-2xl'
      }
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Song Info */}
        <div className="flex items-center gap-4 w-1/4 min-w-[280px]">
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="w-20 h-20 rounded-lg shadow-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p
              className={
                isDarkTheme
                  ? 'font-bold text-lg text-white truncate'
                  : 'font-bold text-lg text-text truncate'
              }
            >
              {currentSong.title}
            </p>
            <p className={isDarkTheme ? 'text-white/60 text-sm' : 'text-text/60 text-sm'}>Tate McRae</p>
          </div>
        </div>

        {/* Center: Player Controls */}
        <div className="flex flex-col items-center w-2/4 max-w-3xl">
          {/* Buttons */}
          <div className="flex items-center gap-6 mb-3">
            <button
              onClick={playPrevious}
              className={
                isDarkTheme
                  ? 'text-white/70 hover:text-white hover:scale-110 transition-all'
                  : 'text-text/70 hover:text-text hover:scale-110 transition-all'
              }
            >
              <SkipBack size={32} fill="currentColor" />
            </button>

            <button
              onClick={togglePlayPause}
              className="bg-white hover:bg-white/90 text-black rounded-full p-4 hover:scale-105 shadow-xl transition-all"
            >
              {isPlaying ? (
                <Pause size={28} fill="currentColor" strokeWidth={0} />
              ) : (
                <Play size={28} fill="currentColor" strokeWidth={0} className="ml-0.5" />
              )}
            </button>

            <button
              onClick={playNext}
              className={
                isDarkTheme
                  ? 'text-white/70 hover:text-white hover:scale-110 transition-all'
                  : 'text-text/70 hover:text-text hover:scale-110 transition-all'
              }
            >
              <SkipForward size={32} fill="currentColor" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 w-full">
            <span
              className={
                isDarkTheme
                  ? 'text-sm text-white/60 min-w-[48px] text-right font-medium'
                  : 'text-sm text-text/60 min-w-[48px] text-right font-medium'
              }
            >
              {formatTime(currentTime)}
            </span>
            <div
              ref={progressBarRef}
              onClick={handleProgressClick}
              className={
                isSoCloseToWhatTheme
                  ? 'flex-1 h-2 bg-white/25 rounded-full cursor-pointer group relative overflow-hidden'
                  : isThinkLaterTheme
                    ? 'flex-1 h-2 bg-white/30 rounded-full cursor-pointer group relative overflow-hidden'
                  : 'flex-1 h-2 bg-white/20 rounded-full cursor-pointer group relative overflow-hidden'
              }
            >
              <div
                className="h-full bg-accent rounded-full relative transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg" />
              </div>
            </div>
            <span className={isDarkTheme ? 'text-sm text-white/60 min-w-[48px] font-medium' : 'text-sm text-text/60 min-w-[48px] font-medium'}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume Control */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px]">
          {volume === 0 ? (
            <VolumeX size={24} className={isDarkTheme ? 'text-white/70' : 'text-text/70'} />
          ) : (
            <Volume2 size={24} className={isDarkTheme ? 'text-white/70' : 'text-text/70'} />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-32 h-2 bg-white/20 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #f19e31 0%, #f19e31 ${volume * 100}%, rgba(255, 255, 255, 0.2) ${volume * 100}%, rgba(255, 255, 255, 0.2) 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
