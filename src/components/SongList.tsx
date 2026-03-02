'use client';

import React, { useState, useEffect } from 'react';
import { Album, Song } from '@/data/albums';
import { usePlayer } from '@/context/PlayerContext';
import { Play, Pause, Clock, Shuffle } from 'lucide-react';

interface SongListProps {
  album: Album;
  albumTheme?: 'default' | 'so-close' | 'think-later';
}

const SongList: React.FC<SongListProps> = ({ album, albumTheme = 'default' }) => {
  const isSoCloseToWhatTheme = albumTheme === 'so-close';
  const isThinkLaterTheme = albumTheme === 'think-later';
  const isDarkTheme = albumTheme !== 'default';
  const { playSong, currentSong, isPlaying, togglePlayPause } = usePlayer();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedSongIndex, setSelectedSongIndex] = useState<number | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        if (album.id === 'all-songs') {
          const response = await fetch('/api/songs', { cache: 'no-store' });
          const data = await response.json();
          setSongs(data.songs || []);
        } else {
          const response = await fetch(`/api/songs?folder=${album.folder}`, { cache: 'no-store' });
          const data = await response.json();
          setSongs(data.songs || []);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [album.id, album.folder]);

  const handleSongClick = (song: Song, index: number) => {
    if (currentSong?.file === song.file) {
      togglePlayPause();
    } else {
      playSong(song, album, songs, index);
    }
    setSelectedSongIndex(index);
  };

  const handlePlayAlbum = () => {
    if (songs.length > 0) {
      playSong(songs[0], album, songs, 0);
    }
  };

  const handleShuffleAll = () => {
    if (songs.length === 0) {
      return;
    }

    const shuffledSongs = [...songs];
    for (let i = shuffledSongs.length - 1; i > 0; i -= 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledSongs[i], shuffledSongs[randomIndex]] = [shuffledSongs[randomIndex], shuffledSongs[i]];
    }

    playSong(shuffledSongs[0], album, shuffledSongs, 0);
  };

  const isCurrentSong = (song: Song) => currentSong?.file === song.file;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <img
          src="/loader.gif"
          alt="Loading..."
          className="w-16 h-16 opacity-90"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Album Header */}
      <div
        className={
          isSoCloseToWhatTheme
            ? 'flex items-end gap-8 p-10 pb-8 bg-gradient-to-b from-black/70 via-black/30 to-transparent'
            : isThinkLaterTheme
              ? 'flex items-end gap-8 p-10 pb-8 bg-gradient-to-b from-black/40 via-accent/15 to-transparent'
            : 'flex items-end gap-8 p-10 pb-8 bg-gradient-to-b from-accent/20 to-transparent'
        }
      >
        <img
          src={album.id === 'singles' && selectedSongIndex !== null && songs[selectedSongIndex]
            ? songs[selectedSongIndex].cover
            : album.cover}
          alt={album.id === 'singles' && selectedSongIndex !== null && songs[selectedSongIndex]
            ? songs[selectedSongIndex].title
            : album.name}
          className="w-64 h-64 rounded-2xl shadow-2xl object-cover flex-shrink-0 ring-1 ring-accent/50 transition-all duration-300"
        />
        <div className="flex flex-col justify-end pb-2">
          <p
            className={
              isSoCloseToWhatTheme
                ? 'text-sm font-bold uppercase tracking-[0.2em] mb-3 text-white/75'
                : isThinkLaterTheme
                  ? 'text-sm font-bold uppercase tracking-[0.2em] mb-3 text-white/80'
                : 'text-sm font-bold uppercase tracking-wider mb-3'
            }
          >
            {album.id === 'singles' && selectedSongIndex !== null ? 'Single' : 'Album'}
          </p>
          <h1
            className={
              isDarkTheme
                ? 'text-7xl font-black mb-2 leading-none text-white transition-all duration-300'
                : 'text-7xl font-black mb-2 leading-none transition-all duration-300'
            }
          >
            {album.id === 'singles' && selectedSongIndex !== null && songs[selectedSongIndex]
              ? songs[selectedSongIndex].title
              : album.name}
          </h1>
        </div>
      </div>

      {/* Play Button and Controls */}
      <div className="px-10 py-8 flex items-center">
        <button
          onClick={handlePlayAlbum}
          className={
            isSoCloseToWhatTheme
              ? 'w-20 h-20 rounded-full bg-accent hover:bg-accent-light hover:scale-105 flex items-center justify-center shadow-2xl group ring-1 ring-white/20'
              : isThinkLaterTheme
                ? 'w-20 h-20 rounded-full bg-accent-light hover:bg-accent hover:scale-105 flex items-center justify-center shadow-2xl group ring-1 ring-accent/40'
              : 'w-20 h-20 rounded-full bg-accent hover:bg-accent-light hover:scale-105 flex items-center justify-center shadow-2xl group'
          }
        >
          <Play size={36} fill="white" className="text-white ml-1" strokeWidth={0} />
        </button>

        {album.id === 'all-songs' && (
          <button
            onClick={handleShuffleAll}
            className={
              isSoCloseToWhatTheme
                ? 'ml-4 h-14 px-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 font-semibold transition-colors'
                : isThinkLaterTheme
                  ? 'ml-4 h-14 px-6 rounded-full bg-white/12 hover:bg-white/22 text-white flex items-center gap-2 font-semibold transition-colors'
                : 'ml-4 h-14 px-6 rounded-full bg-black/10 hover:bg-black/20 text-text flex items-center gap-2 font-semibold transition-colors'
            }
          >
            <Shuffle size={18} />
            Shuffle All
          </button>
        )}
      </div>

      {/* Song List */}
      <div className="px-10 pb-8">
        {/* Header */}
        <div
          className={
            isSoCloseToWhatTheme
              ? 'grid grid-cols-[48px_1fr_120px] gap-4 px-6 py-3 text-sm font-medium text-white/60 border-b border-white/15 sticky top-0 bg-black/50 backdrop-blur-sm'
              : isThinkLaterTheme
                ? 'grid grid-cols-[48px_1fr_120px] gap-4 px-6 py-3 text-sm font-medium text-white/65 border-b border-white/20 sticky top-0 bg-black/45 backdrop-blur-sm'
              : 'grid grid-cols-[48px_1fr_120px] gap-4 px-6 py-3 text-sm font-medium text-text/50 border-b border-text/10 sticky top-0 bg-background/80 backdrop-blur-sm'
          }
        >
          <div className="text-center">#</div>
          <div>Title</div>
          <div className="flex items-center justify-end gap-2">
            <Clock size={16} />
          </div>
        </div>

        {/* Songs */}
        <div className="mt-2">
          {songs.map((song, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleSongClick(song, index)}
              className={`
                grid grid-cols-[48px_1fr_120px] gap-4 px-6 py-4 rounded-xl cursor-pointer group
                ${
                  isCurrentSong(song)
                    ? isSoCloseToWhatTheme
                      ? 'bg-white/12'
                      : isThinkLaterTheme
                        ? 'bg-accent/20'
                      : 'bg-white/20'
                    : isSoCloseToWhatTheme
                      ? 'hover:bg-white/8'
                      : isThinkLaterTheme
                        ? 'hover:bg-white/10'
                      : 'hover:bg-white/10'
                }
              `}
            >
              {/* Track Number / Play Button */}
              <div className="flex items-center justify-center">
                {hoveredIndex === index || isCurrentSong(song) ? (
                  <button className="text-accent hover:scale-110">
                    {isCurrentSong(song) && isPlaying ? (
                      <Pause size={20} fill="currentColor" />
                    ) : (
                      <Play size={20} fill="currentColor" />
                    )}
                  </button>
                ) : (
                  <span
                    className={`text-base ${
                      isCurrentSong(song)
                        ? 'text-accent font-bold'
                        : isDarkTheme
                          ? 'text-white/60'
                          : 'text-text/60'
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Song Title */}
              <div className="flex items-center min-w-0">
                <span
                  className={`font-medium text-lg truncate ${
                    isCurrentSong(song)
                      ? 'text-accent'
                      : isDarkTheme
                        ? 'text-white/90'
                        : 'text-text'
                  }`}
                >
                  {song.title}
                </span>
              </div>

              {/* Duration */}
              <div
                className={
                  isDarkTheme
                    ? 'flex items-center justify-end text-white/60 text-base'
                    : 'flex items-center justify-end text-text/60 text-base'
                }
              >
                {song.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SongList;
