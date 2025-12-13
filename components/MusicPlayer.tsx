import React, { useEffect, useRef, useState } from 'react';
import { Track } from '../types';
import { Play, Pause, SkipBack, SkipForward, Volume2, Disc } from 'lucide-react';

interface MusicPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks,
  currentTrackIndex,
  setCurrentTrackIndex,
  isPlaying,
  setIsPlaying
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Play error:", error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, setIsPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleTrackEnd = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
  };

  const handleNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const manualChange = Number(e.target.value);
      audioRef.current.currentTime = (audioRef.current.duration / 100) * manualChange;
      setProgress(manualChange);
    }
  };

  return (
    <div className="bg-black border-2 border-glitch-magenta p-1 shadow-[5px_5px_0_#00ffff]">
      <div className="border border-gray-800 p-4 relative">
        {/* Corner Decals */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-glitch-magenta"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-glitch-magenta"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-glitch-magenta"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-glitch-magenta"></div>

        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleTrackEnd}
        />

        <div className="flex flex-col gap-4">
          
          {/* Metadata Display */}
          <div className="flex gap-4 items-center">
             <div className={`w-12 h-12 bg-glitch-magenta flex items-center justify-center border-2 border-white ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                <Disc className="text-black" />
             </div>
             <div className="flex-1 overflow-hidden font-terminal">
                <div className="text-xs text-gray-500 uppercase tracking-widest">Now_Executing:</div>
                <div className="text-xl text-glitch-cyan truncate leading-none">{currentTrack.title}</div>
                <div className="text-sm text-white truncate">{currentTrack.artist}</div>
             </div>
          </div>

          {/* Fake Visualizer */}
          <div className="flex items-end justify-between h-8 gap-0.5 opacity-80">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="w-full bg-glitch-yellow transition-all duration-75"
                style={{
                  height: isPlaying ? `${Math.random() * 100}%` : '5%',
                }}
              />
            ))}
          </div>

          {/* Scrubber */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleProgressChange}
            className="w-full h-2 bg-gray-900 appearance-none cursor-pointer border border-gray-700 hover:border-glitch-cyan [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-glitch-magenta"
          />

          {/* Controls Row */}
          <div className="flex items-center justify-between">
            
            {/* Volume */}
            <div className="flex items-center gap-2">
               <Volume2 size={14} className="text-gray-500" />
               <div className="flex gap-0.5">
                  {[0.2, 0.4, 0.6, 0.8, 1.0].map((step) => (
                    <div 
                      key={step} 
                      onClick={() => setVolume(step)}
                      className={`w-2 h-4 cursor-pointer border border-gray-800 ${volume >= step ? 'bg-glitch-cyan' : 'bg-black'}`}
                    ></div>
                  ))}
               </div>
            </div>

            {/* Transport */}
            <div className="flex items-center gap-6">
              <button onClick={handlePrev} className="text-gray-400 hover:text-white hover:scale-110 active:scale-90 transition-transform">
                <SkipBack size={20} />
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)} 
                className="w-10 h-10 flex items-center justify-center border-2 border-white bg-black hover:bg-white hover:text-black transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button onClick={handleNext} className="text-gray-400 hover:text-white hover:scale-110 active:scale-90 transition-transform">
                <SkipForward size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;