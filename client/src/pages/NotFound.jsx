import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Home, AlertOctagon } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
      <div className="p-4 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-400">
        <AlertOctagon className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-100">404 - Checkmate!</h1>
      <p className="text-xs text-slate-400 max-w-sm">
        The square you are trying to reach does not exist on this 3D chessboard.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
      >
        <Home className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
};
