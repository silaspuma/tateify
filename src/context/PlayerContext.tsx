'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Song, Album } from '@/data/albums';

interface PlayerContextType {
  currentSong: Song | null;
  currentAlbum: Album | null;
  recentSongs: { song: Song; album: Album }[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Song[];
  currentIndex: number;
  playSong: (song: Song, album: Album, queue: Song[], index: number) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [recentSongs, setRecentSongs] = useState<{ song: Song; album: Album }[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const setMediaSessionActionHandler = (
    action: MediaSessionAction,
    handler: MediaSessionActionHandler | null
  ) => {
    try {
      navigator.mediaSession.setActionHandler(action, handler);
    } catch {
      // Ignore unsupported actions.
    }
  };

  // Update Media Session API
  useEffect(() => {
    if ('mediaSession' in navigator && currentSong && currentAlbum) {
      // Determine image type - support both data URLs and file paths
      let imageType = 'image/jpeg';
      if (currentSong.cover.startsWith('data:')) {
        // Extract type from data URL
        const typeMatch = currentSong.cover.match(/^data:([^;]+)/);
        imageType = typeMatch ? typeMatch[1] : 'image/jpeg';
      } else if (currentSong.cover.toLowerCase().endsWith('.png')) {
        imageType = 'image/png';
      }

      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: 'Tate McRae',
        album: currentAlbum.name,
        artwork: [
          { src: currentSong.cover, sizes: '512x512', type: imageType },
        ],
      });

      setMediaSessionActionHandler('play', () => {
        audioRef.current?.play();
        setIsPlaying(true);
      });

      setMediaSessionActionHandler('pause', () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });

      setMediaSessionActionHandler('nexttrack', playNext);
      setMediaSessionActionHandler('previoustrack', playPrevious);
      setMediaSessionActionHandler('seekforward', null);
      setMediaSessionActionHandler('seekbackward', null);
      setMediaSessionActionHandler('seekto', null);
    }
  }, [currentSong, currentAlbum]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = currentSong
        ? isPlaying
          ? 'playing'
          : 'paused'
        : 'none';

      if (
        currentSong &&
        typeof navigator.mediaSession.setPositionState === 'function' &&
        Number.isFinite(duration) &&
        duration > 0
      ) {
        try {
          navigator.mediaSession.setPositionState({
            duration,
            playbackRate: 1,
            position: Math.min(currentTime, duration),
          });
        } catch {
          // Ignore unsupported or invalid state updates.
        }
      }
    }
  }, [currentSong, isPlaying, currentTime, duration]);

  // Update audio time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  const playSong = (song: Song, album: Album, songQueue: Song[], index: number) => {
    setCurrentSong(song);
    setCurrentAlbum(album);
    setQueue(songQueue);
    setCurrentIndex(index);
    setIsPlaying(true);

    setRecentSongs((previous) => {
      const deduped = previous.filter((item) => item.song.file !== song.file);
      return [{ song, album }, ...deduped].slice(0, 20);
    });
  };

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.file;
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (queue.length === 0) return;
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(queue[nextIndex]);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    if (currentTime > 3) {
      seekTo(0);
    } else {
      const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(queue[prevIndex]);
      setIsPlaying(true);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        currentAlbum,
        recentSongs,
        isPlaying,
        currentTime,
        duration,
        volume,
        queue,
        currentIndex,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
        seekTo,
        setVolume,
        audioRef,
      }}
    >
      {children}
      <audio ref={audioRef} />
    </PlayerContext.Provider>
  );
};
