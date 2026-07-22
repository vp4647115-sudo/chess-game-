import React from 'react';
import { X, Check, Palette } from 'lucide-react';
import { useThemeStore, THEMES } from '../../store/useThemeStore';

export const ThemeSelector = ({ onClose }) => {
  const { activeThemeId, setTheme } = useThemeStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">Select 3D Chess Theme</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 max-h-[60vh] overflow-y-auto pr-1">
          {Object.values(THEMES).map((theme) => {
            const isSelected = activeThemeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`flex flex-col p-3 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-400/10 ring-2 ring-amber-400/40'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                {/* Theme Color Preview Tiles */}
                <div className="flex items-center gap-1 mb-3">
                  <div
                    className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                    style={{ backgroundColor: theme.lightSquare }}
                  />
                  <div
                    className="w-6 h-6 rounded-lg border border-white/20 shadow-sm"
                    style={{ backgroundColor: theme.darkSquare }}
                  />
                  <div
                    className="w-6 h-6 rounded-lg border border-white/20 shadow-sm ml-auto"
                    style={{ backgroundColor: theme.border }}
                  />
                </div>

                <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-all">
                  {theme.name}
                </span>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 font-bold text-xs bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
