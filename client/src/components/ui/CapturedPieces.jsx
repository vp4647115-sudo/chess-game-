import React from 'react';
import { useGameStore } from '../../store/useGameStore';

const pieceIcons = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
  k: '♚'
};

export const CapturedPieces = ({ color }) => {
  const { capturedPieces } = useGameStore();

  // If color === 'w', show pieces White has lost or captured
  const list = capturedPieces[color] || [];

  return (
    <div className="flex items-center gap-1 min-h-[24px] px-2 py-1 bg-slate-900/40 rounded-xl border border-slate-800/40">
      {list.length === 0 ? (
        <span className="text-[10px] text-slate-500 italic">No pieces captured</span>
      ) : (
        list.map((type, idx) => (
          <span key={idx} className="text-base text-slate-300">
            {pieceIcons[type]}
          </span>
        ))
      )}
    </div>
  );
};
