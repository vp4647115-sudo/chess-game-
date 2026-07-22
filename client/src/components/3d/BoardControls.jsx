import React from 'react';
import { Camera, RotateCcw, Eye, ArrowUpDown, Maximize2 } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';

export const BoardControls = ({ controlsRef }) => {
  const { playerColor, setPlayerColor } = useGameStore();

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleFlipBoard = () => {
    setPlayerColor(playerColor === 'w' ? 'b' : 'w');
  };

  const handleWhiteView = () => {
    setPlayerColor('w');
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 7, 7);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleBlackView = () => {
    setPlayerColor('b');
    if (controlsRef.current) {
      controlsRef.current.object.position.set(0, 7, -7);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full glass-panel z-10">
      <button
        onClick={handleWhiteView}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-cyan-500 hover:text-black transition-all"
        title="White View"
      >
        <Eye className="w-3.5 h-3.5" />
        White
      </button>

      <button
        onClick={handleBlackView}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/80 hover:bg-cyan-500 hover:text-black transition-all"
        title="Black View"
      >
        <Eye className="w-3.5 h-3.5" />
        Black
      </button>

      <div className="w-px h-5 bg-slate-700 mx-1" />

      <button
        onClick={handleFlipBoard}
        className="p-2 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-all"
        title="Flip Board"
      >
        <ArrowUpDown className="w-4 h-4" />
      </button>

      <button
        onClick={handleResetCamera}
        className="p-2 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-all"
        title="Reset Camera"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
