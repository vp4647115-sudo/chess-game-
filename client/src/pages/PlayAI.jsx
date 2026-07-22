import React, { useEffect, useState } from 'react';
import { Bot, Lightbulb, RotateCcw, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { ChessScene } from '../components/3d/ChessScene';
import { TimerDisplay } from '../components/ui/TimerDisplay';
import { MoveHistory } from '../components/ui/MoveHistory';
import { GameControls } from '../components/ui/GameControls';
import { CapturedPieces } from '../components/ui/CapturedPieces';
import { useGameStore } from '../store/useGameStore';
import { useAuthStore } from '../store/useAuthStore';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

export const PlayAI = () => {
  const { user } = useAuthStore();
  const {
    fen,
    turn,
    setGameMode,
    aiDifficulty,
    setAIDifficulty,
    makeMove,
    undoMove,
    resetGame,
    isGameOver,
    gameOverReason,
    suggestedHint,
    setHint,
    evalScore,
    setEvalScore
  } = useGameStore();

  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    setGameMode('ai');
    useGameStore.getState().setTimerActive(true);
  }, []);

  // Trigger AI move when turn changes to Black ('b')
  useEffect(() => {
    if (turn === 'b' && !isGameOver) {
      setLoadingAI(true);
      fetch(`${SERVER_URL}/api/ai/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen, difficulty: aiDifficulty })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.result?.move) {
            makeMove(data.result.move);
            if (data.result.eval) setEvalScore(data.result.eval);
          }
        })
        .catch((err) => console.warn('AI API error, fallback local move', err))
        .finally(() => setLoadingAI(false));
    }
  }, [turn, fen, isGameOver, aiDifficulty]);

  const handleGetHint = () => {
    fetch(`${SERVER_URL}/api/ai/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen, difficulty: 'hard' })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setHint({
            text: data.result.hint || `Best move: ${data.result.move?.from} to ${data.result.move?.to}`,
            from: data.result.move?.from,
            to: data.result.move?.to
          });
        }
      })
      .catch((err) => console.error("Error fetching hint:", err));
  };

  const handleResign = () => {
    useGameStore.setState({
      isGameOver: true,
      gameOverReason: 'You resigned. You lost the game!',
      winner: 'b'
    });
    const { adjustStats } = useAuthStore.getState();
    if (adjustStats) {
      adjustStats('loss');
    }
  };

  return (
    <div className="max-w-[1920px] mx-auto p-4 lg:p-6 space-y-4">
      {/* Top Header Difficulty Controls */}
      <div className="flex flex-wrap items-center justify-between p-4 glass-panel rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Stockfish AI Mode</h2>
            <span className="text-[10px] text-slate-400">Position Evaluation: {evalScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Difficulty:</span>
          {['easy', 'medium', 'hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setAIDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                aiDifficulty === diff
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>


      {/* Main Game Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-10rem)]">
        {/* Left Column: AI Timer + 3D Board Canvas + Player Timer */}
        <div className="lg:col-span-8 flex flex-col space-y-3 h-full">
          <div className="flex items-center justify-between">
            <TimerDisplay
              color="b"
              playerInfo={{ username: `Stockfish AI (${aiDifficulty.toUpperCase()})`, rating: 2800, avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=250&q=80' }}
            />
            <CapturedPieces color="b" />
          </div>

          {/* 3D Board with game over overlay */}
          <div className="relative flex-1">
            {isGameOver && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
                <div className="text-center space-y-4 p-8">
                  <h3 className="text-3xl font-extrabold text-amber-400">🏆 Game Over</h3>
                  <p className="text-sm text-slate-300">{gameOverReason}</p>
                  <button
                    onClick={() => resetGame()}
                    className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm rounded-2xl transition-all"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}

            {/* Float hint overlay over canvas */}
            {suggestedHint && (
              <div className="absolute top-4 left-4 z-10 p-3 bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl flex items-center gap-3 text-xs text-amber-300 shadow-xl max-w-sm">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">{typeof suggestedHint === 'string' ? suggestedHint : suggestedHint.text}</span>
                <button onClick={() => setHint(null)} className="text-[10px] font-bold text-amber-400 hover:underline shrink-0 ml-auto pl-2 border-l border-slate-700">
                  Dismiss
                </button>
              </div>
            )}

            <ChessScene />
          </div>

          <div className="flex items-center justify-between">
            <TimerDisplay color="w" playerInfo={user} />
            <CapturedPieces color="w" />
          </div>

          <GameControls
            onResign={handleResign}
            onDraw={() => alert('AI accepts draw')}
            onGetHint={handleGetHint}
          />
        </div>

        {/* Right Column: Move Notation Panel */}
        <div className="lg:col-span-4 h-full">
          <MoveHistory />
        </div>
      </div>
    </div>
  );
};
