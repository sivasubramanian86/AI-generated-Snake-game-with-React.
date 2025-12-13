import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { TRACKS } from './constants';
import { Gamepad2, Terminal, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-black text-glitch-cyan font-terminal selection:bg-glitch-magenta selection:text-white flex flex-col relative">
      
      {/* CRT Overlay */}
      <div className="scanlines"></div>
      
      {/* Static Noise Overlay (simulated via CSS pattern) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-40" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Header */}
      <header className="relative z-50 p-6 border-b-4 border-glitch-magenta bg-black flex flex-col md:flex-row justify-between items-center gap-4 shadow-[0_0_15px_rgba(255,0,255,0.5)]">
        <div className="flex items-center gap-4 group">
           <div className="relative">
             <div className="absolute inset-0 bg-glitch-cyan blur-sm opacity-50 animate-pulse"></div>
             <Gamepad2 className="text-white relative z-10 w-10 h-10" />
           </div>
           <div>
             <h1 className="text-4xl font-pixel text-white glitch-text tracking-tighter" data-text="NEON_SNAKE">
               NEON_SNAKE
             </h1>
             <div className="text-xs text-glitch-magenta font-bold tracking-[0.5em] uppercase">System_Failure_Imminent</div>
           </div>
        </div>
        
        <div className="flex gap-8 font-pixel text-sm">
           <div className="flex flex-col items-end border-r-4 border-glitch-cyan pr-4">
              <span className="text-glitch-yellow text-[10px] mb-1">CURRENT_SCORE</span>
              <span className="text-2xl text-white drop-shadow-[2px_2px_0_#ff00ff]">{score.toString().padStart(6, '0')}</span>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-gray-500 text-[10px] mb-1">HIGH_SCORE</span>
              <span className="text-xl text-gray-400">{highScore.toString().padStart(6, '0')}</span>
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col xl:flex-row items-start justify-center p-6 gap-10">
        
        {/* Game Section */}
        <div className="flex-1 w-full max-w-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-glitch-cyan mb-2 border-b border-dashed border-glitch-cyan pb-1 w-fit">
            <Zap size={16} />
            <span className="text-sm font-bold tracking-widest">VISUAL_INTERFACE</span>
          </div>
          
          <div className="relative p-1 bg-glitch-cyan">
             <div className="bg-black p-1 border-2 border-black">
                <SnakeGame onScoreChange={handleScoreUpdate} />
             </div>
          </div>

          <div className="flex justify-between items-start mt-4 text-xs font-mono text-gray-400">
             <div className="border border-gray-800 p-2">
               <p className="text-glitch-yellow mb-1">CONTROLS:</p>
               <p>[W/A/S/D] :: NAVIGATE</p>
               <p>[ARROWS] :: NAVIGATE</p>
             </div>
             <div className="border border-gray-800 p-2 text-right">
               <p className="text-glitch-magenta mb-1">STATUS:</p>
               <p>RENDERING: CANVAS_2D</p>
               <p>FPS: UNSTABLE</p>
             </div>
          </div>
        </div>

        {/* Music Section */}
        <div className="w-full max-w-md flex flex-col gap-4">
           <div className="flex items-center gap-2 text-glitch-magenta mb-2 border-b border-dashed border-glitch-magenta pb-1 w-fit">
              <Terminal size={16} />
              <span className="text-sm font-bold tracking-widest">AUDIO_SUBSYSTEM</span>
           </div>
           
           <MusicPlayer 
             tracks={TRACKS}
             currentTrackIndex={currentTrackIndex}
             setCurrentTrackIndex={setCurrentTrackIndex}
             isPlaying={isPlaying}
             setIsPlaying={setIsPlaying}
           />

           {/* Raw Data Playlist */}
           <div className="mt-4 border-2 border-gray-800 bg-black p-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-1 bg-gray-800 text-[10px] text-white">PLAYLIST.JSON</div>
              <ul className="space-y-3 mt-4">
                 {TRACKS.map((track, idx) => (
                    <li 
                      key={track.id} 
                      onClick={() => {
                        setCurrentTrackIndex(idx);
                        setIsPlaying(true);
                      }}
                      className={`cursor-pointer transition-all duration-100 flex items-center justify-between p-2 font-mono text-sm border-l-4 ${idx === currentTrackIndex ? 'border-glitch-magenta bg-glitch-magenta/10 text-white' : 'border-transparent text-gray-500 hover:text-glitch-cyan hover:border-glitch-cyan'}`}
                    >
                       <span>{idx.toString().padStart(2, '0')} :: {track.title.toUpperCase()}</span>
                       {idx === currentTrackIndex && isPlaying && <span className="animate-pulse text-glitch-magenta">◄ PLAYING</span>}
                    </li>
                 ))}
              </ul>
           </div>
        </div>

      </main>

      <footer className="relative z-50 p-4 border-t border-gray-800 bg-black text-center">
         <p className="text-[10px] text-gray-600 font-pixel">
           SYSTEM_ID: 0x4829A // MEMORY_LEAK_DETECTED // <span className="text-glitch-cyan">REBOOT_REQUIRED</span>
         </p>
      </footer>

    </div>
  );
};

export default App;