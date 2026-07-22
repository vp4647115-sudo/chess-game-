import React from 'react';
import { Clock } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

const formatTime = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const TimerDisplay = ({ color, playerInfo }) => {
  const { turn, clocks, timerActive, tickTimer, gameMode } = useGameStore();

  React.useEffect(() => {
    // Only run local clock interval for local/AI modes (Online uses socket server ticks)
    if (gameMode !== 'online' && timerActive) {
      const timer = setInterval(() => {
        tickTimer();
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerActive, gameMode, tickTimer]);

  const isCurrentTurn = turn === color;
  const timeSeconds = clocks[color] !== undefined ? clocks[color] : 300;

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
        isCurrentTurn
          ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
          : 'bg-slate-900/60 border-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <img
          src={playerInfo?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
          alt={playerInfo?.username || 'Player'}
          className="w-9 h-9 rounded-full border border-slate-700 object-cover"
        />
        <div>
          <span className="block text-xs font-bold text-slate-200">
            {playerInfo?.username || (color === 'w' ? 'White Player' : 'Black Player')}
          </span>
          <span className="block text-[10px] text-slate-400 font-medium">
            Rating: {playerInfo?.rating || 1200}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Clock className={`w-4 h-4 ${isCurrentTurn ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
        <span
          className={`font-mono text-lg font-extrabold tracking-wider ${
            timeSeconds < 30
              ? 'text-red-400 animate-bounce'
              : isCurrentTurn
              ? 'text-amber-400'
              : 'text-slate-300'
          }`}
        >
          {formatTime(timeSeconds)}
        </span>
      </div>
    </div>
  );
};
