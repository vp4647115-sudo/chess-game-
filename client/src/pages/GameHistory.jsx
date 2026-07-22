import React, { useState } from 'react';
import { History, Copy, Check, Play, Eye } from 'lucide-react';
import { ChessScene } from '../components/3d/ChessScene';
import { useGameStore } from '../store/useGameStore';

const mockHistory = [
  { id: 'g1', white: 'Magnus_V', black: 'Grandmaster_Guest', winner: 'Magnus_V', result: 'Checkmate', moves: 38, date: '2026-07-22', pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7', fen: 'r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 w kq - 4 6' },
  { id: 'g2', white: 'Grandmaster_Guest', black: 'Stockfish_Medium', winner: 'Grandmaster_Guest', result: 'Resignation', moves: 24, date: '2026-07-21', pgn: '1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6', fen: 'rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 0 5' },
];

export const GameHistory = () => {
  const { resetGame } = useGameStore();
  const [selectedGame, setSelectedGame] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleReplay = (game) => {
    setSelectedGame(game);
    resetGame(game.fen);
  };

  const copyPGN = (game) => {
    navigator.clipboard.writeText(game.pgn);
    setCopiedId(game.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-6 space-y-6 text-left">
      <div className="flex items-center gap-3 p-6 glass-panel rounded-3xl border border-slate-800">
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <History className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Match History & Replay Log</h1>
          <p className="text-xs text-slate-400">Review past games, export PGN/FEN files, and step through 3D replays</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Games List */}
        <div className="lg:col-span-6 space-y-3">
          {mockHistory.map((game) => (
            <div
              key={game.id}
              className={`p-4 glass-panel rounded-2xl border transition-all text-xs space-y-2 ${
                selectedGame?.id === game.id ? 'border-amber-400 bg-amber-500/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>{game.white} vs {game.black}</span>
                <span className="text-amber-400">{game.result}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Winner: <strong className="text-emerald-400">{game.winner}</strong></span>
                <span>{game.moves} moves • {game.date}</span>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleReplay(game)}
                  className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  3D Replay
                </button>

                <button
                  onClick={() => copyPGN(game)}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] rounded-xl transition-all flex items-center gap-1.5"
                >
                  {copiedId === game.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === game.id ? 'Copied PGN' : 'Export PGN'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Replay Canvas Viewer */}
        <div className="lg:col-span-6 h-[480px]">
          {selectedGame ? (
            <div className="h-full flex flex-col space-y-2">
              <div className="p-3 glass-panel rounded-2xl text-xs font-bold text-slate-200 flex justify-between items-center">
                <span>Replaying Game: {selectedGame.white} vs {selectedGame.black}</span>
                <span className="text-amber-400">{selectedGame.result}</span>
              </div>
              <ChessScene />
            </div>
          ) : (
            <div className="h-full glass-panel rounded-3xl flex flex-col items-center justify-center text-slate-500 text-xs p-8 text-center space-y-2">
              <Eye className="w-8 h-8 text-slate-600" />
              <span>Select a match on the left to launch the interactive 3D Board Replay viewer.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
