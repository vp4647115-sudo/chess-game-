import React from 'react';
import { BookOpen, Shield, Crown, Swords, Zap, HelpCircle } from 'lucide-react';

export const Instructions = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6 text-left">
      <div className="flex items-center gap-3 p-6 glass-panel rounded-3xl border border-slate-800">
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Chess Rules & Platform Guide</h1>
          <p className="text-xs text-slate-400">Master piece movements, special moves, and 3D camera controls</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Piece Movements */}
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" /> Piece Movements
          </h2>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <strong className="text-amber-400 block font-bold mb-1">Pawn (♟)</strong>
              Moves forward 1 square (or 2 squares on initial move). Captures diagonally forward.
            </li>
            <li className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <strong className="text-amber-400 block font-bold mb-1">Knight (♞)</strong>
              Moves in an "L-shape" (2 squares in one direction and 1 perpendicular). Can jump over other pieces.
            </li>
            <li className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <strong className="text-amber-400 block font-bold mb-1">Bishop (♝)</strong>
              Moves any number of vacant squares diagonally.
            </li>
            <li className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <strong className="text-amber-400 block font-bold mb-1">Rook (♜)</strong>
              Moves any number of vacant squares horizontally or vertically.
            </li>
          </ul>
        </div>

        {/* Special Rules & 3D Controls */}
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" /> Special Rules & 3D Controls
          </h2>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <strong className="text-cyan-400 block font-bold mb-1">Castling (O-O / O-O-O)</strong>
              Move King 2 squares towards a Rook while the Rook moves to the square the King crossed.
            </li>
            <li className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <strong className="text-cyan-400 block font-bold mb-1">En Passant</strong>
              Special pawn capture immediately after an opponent advances a pawn 2 squares.
            </li>
            <li className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <strong className="text-cyan-400 block font-bold mb-1">Pawn Promotion</strong>
              Reaching the 8th rank transforms a pawn into a Queen, Rook, Bishop, or Knight.
            </li>
            <li className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <strong className="text-cyan-400 block font-bold mb-1">3D Orbit Controls</strong>
              Drag left-click to orbit camera, scroll wheel to zoom, click preset buttons to flip board.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
