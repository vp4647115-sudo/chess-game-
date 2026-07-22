import React from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export const MoveHistory = () => {
  const { history, fen, pgn } = useGameStore();
  const [copied, setCopied] = React.useState(false);

  const copyPGN = () => {
    navigator.clipboard.writeText(pgn || fen);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group moves into pairs (1. e4 e5, 2. Nf3 Nc6)
  const pairedMoves = [];
  for (let i = 0; i < history.length; i += 2) {
    pairedMoves.push({
      moveNum: Math.floor(i / 2) + 1,
      white: history[i]?.san || '',
      black: history[i + 1]?.san || ''
    });
  }

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl p-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" /> Move Notation
        </h3>
        <button
          onClick={copyPGN}
          className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-slate-300 hover:text-cyan-400 bg-slate-800/80 rounded-lg hover:bg-slate-700 transition-all"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied PGN' : 'Export PGN'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto my-3 space-y-1 pr-1">
        {pairedMoves.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 italic">
            No moves recorded yet. Make a move on the 3D board!
          </div>
        ) : (
          pairedMoves.map((item) => (
            <div
              key={item.moveNum}
              className="flex items-center text-xs font-mono py-1 px-2 rounded-lg odd:bg-slate-900/40 hover:bg-slate-800/60 transition-all"
            >
              <span className="w-8 text-slate-500 font-semibold">{item.moveNum}.</span>
              <span className="w-20 text-amber-300 font-medium">{item.white}</span>
              <span className="w-20 text-cyan-300 font-medium">{item.black}</span>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono truncate">
        FEN: {fen}
      </div>
    </div>
  );
};
