import React from 'react';
import { Settings as SettingsIcon, Palette, Sliders, Volume2, VolumeX, Moon, Sun, Check } from 'lucide-react';
import { useThemeStore, THEMES } from '../store/useThemeStore';
import { useGraphicsStore } from '../store/useGraphicsStore';
import { useSoundStore } from '../store/useSoundStore';

export const Settings = () => {
  const { activeThemeId, setTheme } = useThemeStore();
  const { quality, setQuality } = useGraphicsStore();
  const { soundEnabled, musicEnabled, soundVolume, musicVolume, toggleSound, toggleMusic, setSoundVolume, setMusicVolume } = useSoundStore();

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6 text-left">
      <div className="flex items-center gap-3 p-6 glass-panel rounded-3xl border border-slate-800">
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Platform Settings</h1>
          <p className="text-xs text-slate-400">Configure visual 3D themes, graphics renderer, and audio volume</p>
        </div>
      </div>

      {/* Themes Configuration */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-400" /> Active 3D Board Theme
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.values(THEMES).map((th) => (
            <button
              key={th.id}
              onClick={() => setTheme(th.id)}
              className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                activeThemeId === th.id
                  ? 'border-amber-400 bg-amber-500/10 text-amber-400'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {th.name}
            </button>
          ))}
        </div>
      </div>

      {/* Graphics Quality */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" /> Graphics Pipeline Quality
        </h2>

        <div className="grid grid-cols-4 gap-3">
          {['low', 'medium', 'high', 'ultra'].map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              className={`py-2 text-xs font-bold uppercase rounded-2xl border transition-all ${
                quality === q
                  ? 'bg-cyan-500 text-black border-cyan-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Sound Volume Controls */}
      <div className="glass-panel rounded-3xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-emerald-400" /> Sound & Audio Volume
        </h2>

        <div className="space-y-4 max-w-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Sound Effects</span>
            <button
              onClick={toggleSound}
              className={`px-3 py-1 text-xs font-bold rounded-xl ${
                soundEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {soundEnabled ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-semibold">Sound Volume ({Math.round(soundVolume * 100)}%)</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
              className="w-full accent-emerald-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
