import React from 'react';
import { RotateCcw, Lightbulb, Flag, Scale, Trophy } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export const GameControls = ({ onResign, onDraw, onGetHint }) => {
  const { gameMode, undoMove, resetGame, isGameOver, gameOverReason, winner } = useGameStore();

  return (
    <div className="space-y-2">
      {/* Game Over Banner */}
      {isGameOver && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          winner === 'w'
            ? 'bg-emerald-500/10 border-emerald-500/40'
            : winner === 'b'
            ? 'bg-red-500/10 border-red-500/40'
            : 'bg-amber-500/10 border-amber-500/40'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${
              winner === 'w' ? 'bg-emerald-500/20 text-emerald-400' :
              winner === 'b' ? 'bg-red-500/20 text-red-400' :
              'bg-amber-500/20 text-amber-400'
            }`}>
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-extrabold text-slate-100">
                {winner === 'w' ? '🏆 White Wins!' : winner === 'b' ? '🏆 Black Wins!' : '🤝 Draw!'}
              </span>
              <span className="block text-[11px] text-slate-400">{gameOverReason}</span>
            </div>
          </div>
          <button
            onClick={() => resetGame()}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-extrabold rounded-xl transition-all"
          >
            New Game
          </button>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-2 p-3 glass-panel rounded-2xl">
        {/* Undo — AI only */}
        {gameMode === 'ai' && (
          <button
            onClick={undoMove}
            disabled={isGameOver}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold text-slate-200 rounded-xl transition-all"
            title="Undo Move"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            Undo
          </button>
        )}

        {/* Hint — available in ALL modes */}
        {onGetHint && (
          <button
            onClick={onGetHint}
            disabled={isGameOver}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 text-xs font-semibold text-amber-300 rounded-xl border border-amber-500/30 transition-all"
            title="Get Hint"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Hint
          </button>
        )}

        <button
          onClick={onDraw}
          disabled={isGameOver}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold text-slate-200 rounded-xl transition-all"
          title="Offer Draw"
        >
          <Scale className="w-3.5 h-3.5 text-yellow-400" />
          Draw
        </button>

        <button
          onClick={onResign}
          disabled={isGameOver}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 text-xs font-semibold text-red-300 rounded-xl border border-red-500/30 transition-all"
          title="Resign Match"
        >
          <Flag className="w-3.5 h-3.5 text-red-400" />
          Resign
        </button>

        <button
          onClick={() => resetGame()}
          className="py-2 px-3 bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold rounded-xl transition-all"
        >
          New Game
        </button>
      </div>
    </div>
  );
};
