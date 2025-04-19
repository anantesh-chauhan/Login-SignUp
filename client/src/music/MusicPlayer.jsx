import React, { useRef, useState, useEffect } from 'react';
import song1 from './song1.mp3';
import song2 from './song2.mp3';
import song3 from './song3.mp3';

const tracks = [
  { name: 'Track 1', file: song1 },
  { name: 'Track 2', file: song2 },
  { name: 'Track 3', file: song3 },
];

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrackIndex]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleProgressChange = (e) => {
    const value = e.target.value;
    const audio = audioRef.current;
    audio.currentTime = (audio.duration * value) / 100;
    setProgress(value);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [currentTrackIndex]);

  return (
    <div className="w-full fixed bottom-0 z-50 bg-gradient-to-r from-green-700 via-green-500 to-green-600 text-white px-4 py-3 shadow-xl">
      <audio ref={audioRef} src={tracks[currentTrackIndex].file} />

      <div className="flex flex-col w-full items-center">
        {/* All in one row */}
        <div className="w-full flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-[150px]">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-green-700 font-bold">
              {tracks[currentTrackIndex].name[0]}
            </div>
            <p className="text-sm font-semibold">{tracks[currentTrackIndex].name}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-5">
            <button onClick={handlePrev} className="hover:text-yellow-300 text-lg">⏮️</button>
            <button
              onClick={handlePlayPause}
              className="bg-white text-green-700 px-4 py-1 rounded-full shadow hover:bg-yellow-300 hover:text-green-800"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button onClick={handleNext} className="hover:text-yellow-300 text-lg">⏭️</button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2 min-w-[100px]">
            <span className="text-sm">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="accent-yellow-300 w-24"
            />
          </div>
        </div>

        {/* Wavy Progress Bar */}
        <div className="w-full mt-2 relative">
          <div className="absolute top-1/2 left-0 w-full h-2 overflow-hidden">
            <div
              className="w-full h-full bg-repeat-x"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 320' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23facc15' fill-opacity='0.3' d='M0,64L30,80C60,96,120,128,180,128C240,128,300,96,360,85.3C420,75,480,85,540,117.3C600,149,660,203,720,208C780,213,840,171,900,160C960,149,1020,171,1080,170.7C1140,171,1200,149,1260,122.7C1320,96,1380,64,1410,48L1440,32L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundSize: "200% 100%",
                animation: "wave 10s linear infinite",
              }}
            />
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-2 z-10 relative opacity-90 accent-yellow-300"
            style={{
              background: `linear-gradient(to right, #facc15 ${progress}%, #ffffff20 ${progress}%)`,
              borderRadius: "10px",
            }}
          />
        </div>
      </div>

      {/* Wave animation */}
      <style>
        {`
          @keyframes wave {
            0% { background-position: 0 0; }
            100% { background-position: 1440px 0; }
          }
        `}
      </style>
    </div>
  );
};

export default MusicPlayer;
