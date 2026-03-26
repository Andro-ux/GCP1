import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "AUDIO_STREAM_01.WAV",
    artist: "UNKNOWN_ENTITY",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "CORRUPTED_SECTOR.MP3",
    artist: "SYS_ADMIN",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "VOID_TRANSMISSION.DAT",
    artist: "NULL_POINTER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        setIsPlaying(false);
      });
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-2 border-[#00ffff] p-4 relative screen-tear">
      {/* Glitchy corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#ff00ff]"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#ff00ff]"></div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      <div className="flex items-center gap-4 mb-4 border-b-2 border-[#ff00ff] pb-4 border-dashed">
        <div 
          className="w-12 h-12 bg-black border-2 border-[#00ffff] flex items-center justify-center relative overflow-hidden"
        >
          {isPlaying && (
            <div className="absolute inset-0 bg-[#ff00ff] opacity-50 animate-pulse"></div>
          )}
          <span className="text-[#00ffff] font-bold text-xl z-10">
            {isPlaying ? '>>' : '||'}
          </span>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="text-[#fff] font-bold truncate text-xl uppercase tracking-widest">
            {currentTrack.title}
          </h3>
          <p className="text-[#ff00ff] text-md truncate uppercase tracking-widest">
            SRC: {currentTrack.artist}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="text-[#00ffff] hover:text-[#ff00ff] transition-colors focus:outline-none"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-20 h-2 bg-[#111] appearance-none cursor-pointer accent-[#ff00ff] focus:outline-none border border-[#00ffff]"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className="w-full h-4 bg-[#111] mb-4 cursor-pointer overflow-hidden border border-[#00ffff] relative"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-[#ff00ff] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
        {/* Static overlay on progress bar */}
        <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpi2rV7928Gxv///2EAAgwA2EwJ108x8HAAAAAASUVORK5CYII=')] opacity-30 pointer-events-none"></div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4">
        <button 
          onClick={playPrev} 
          className="text-[#00ffff] hover:text-[#ff00ff] transition-all focus:outline-none flex items-center gap-2 uppercase tracking-widest"
        >
          <SkipBack size={20} /> [PREV]
        </button>
        <button
          onClick={togglePlay}
          className="px-6 py-2 bg-[#00ffff] text-black font-bold uppercase tracking-widest hover:bg-[#ff00ff] hover:text-white transition-all focus:outline-none"
        >
          {isPlaying ? 'HALT' : 'EXECUTE'}
        </button>
        <button 
          onClick={playNext} 
          className="text-[#00ffff] hover:text-[#ff00ff] transition-all focus:outline-none flex items-center gap-2 uppercase tracking-widest"
        >
          [NEXT] <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
}
