'use client';

import React, { useState, useEffect } from 'react';
import { Album, Song } from '@/data/albums';
import { usePlayer } from '@/context/PlayerContext';
import { Play, Pause, Clock } from 'lucide-react';

interface SongListProps {
  album: Album;
}

const SongList: React.FC<SongListProps> = ({ album }) => {
  const { playSong, currentSong, isPlaying, togglePlayPause } = usePlayer();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/songs?folder=${album.folder}`);
        const data = await response.json();
        setSongs(data.songs || []);
      } catch (error) {
        console.error('Error fetching songs:', error);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [album.folder]);

  const handleSongClick = (song: Song, index: number) => {
    if (currentSong?.file === song.file) {
      togglePlayPause();
    } else {
      playSong(song, album, songs, index);
    }
  };

  const handlePlayAlbum = () => {
    if (songs.length > 0) {
      playSong(songs[0], album, songs, 0);
    }
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
    <div className="h-full flex flex-col">
      {/* Album Header */}
      <div className="flex items-end gap-8 p-10 pb-8 bg-gradient-to-b from-accent/20 to-transparent">
        <img
          src={album.cover}
          alt={album.name}
          className="w-64 h-64 rounded-2xl shadow-2xl object-cover flex-shrink-0"
        />
        <div className="flex flex-col justify-end pb-2">
          <p className="text-sm font-bold uppercase tracking-wider mb-3">
            Album
          </p>
          <h1 className="text-7xl font-black mb-2 leading-none">{album.name}</h1>
        </div>
      </div>

      {/* Play Button and Controls */}
      <div className="px-10 py-8 flex items-center">
        <button
          onClick={handlePlayAlbum}
          className="w-20 h-20 rounded-full bg-accent hover:bg-accent-light hover:scale-105 flex items-center justify-center shadow-2xl group"
        >
          <Play size={36} fill="white" className="text-white ml-1" strokeWidth={0} />
        </button>
      </div>

      {/* Song List */}
      <div className="flex-1 overflow-y-auto px-10 pb-32">
        {/* Header */}
        <div className="grid grid-cols-[48px_1fr_120px] gap-4 px-6 py-3 text-sm font-medium text-text/50 border-b border-text/10 sticky top-0 bg-background/80 backdrop-blur-sm">
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
                    ? 'bg-white/20'
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
                  <span className={`text-base ${isCurrentSong(song) ? 'text-accent font-bold' : 'text-text/60'}`}>
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Song Title */}
              <div className="flex items-center min-w-0">
                <span className={`font-medium text-lg truncate ${isCurrentSong(song) ? 'text-accent' : 'text-text'}`}>
                  {song.title}
                </span>
              </div>

              {/* Duration */}
              <div className="flex items-center justify-end text-text/60 text-base">
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
