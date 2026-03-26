/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00ffff] flex flex-col items-center justify-center p-4 font-mono relative crt-flicker uppercase">
      <div className="scanlines"></div>
      
      <header className="mb-8 text-center z-10 flex flex-col items-center screen-tear">
        <h1 
          className="text-5xl md:text-7xl font-bold glitch-text tracking-widest" 
          data-text="SYS.SNAKE_PROTOCOL"
        >
          SYS.SNAKE_PROTOCOL
        </h1>
        <div className="mt-6 px-4 py-1 border-2 border-[#ff00ff] bg-black text-[#00ffff] shadow-[4px_4px_0px_#00ffff]">
          <p className="text-xl tracking-widest">
            DATA_RECOVERED: <span className="text-[#ff00ff] font-bold">{score}</span>
          </p>
        </div>
      </header>

      <main className="z-10 flex flex-col items-center gap-10 w-full max-w-4xl">
        <div className="relative p-1 bg-[#ff00ff] screen-tear">
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-[#00ffff]"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-[#00ffff]"></div>
          <div className="bg-black border-2 border-[#00ffff] p-1">
            <SnakeGame onScoreChange={setScore} />
          </div>
        </div>

        <MusicPlayer />
      </main>
      
      <div className="fixed bottom-2 left-2 text-xs text-[#ff00ff] opacity-70 z-10">
        STATUS: ONLINE // CONNECTION: UNSTABLE
      </div>
    </div>
  );
}

