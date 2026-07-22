import React from 'react';
import { X, Sliders, Monitor, Sparkles, Eye, Zap } from 'lucide-react';
import { useGraphicsStore } from '../../store/useGraphicsStore';

export const GraphicsModal = ({ onClose }) => {
  const {
    quality,
    hdr,
    bloom,
    ambientOcclusion,
    reflections,
    shadows,
    fpsLimit,
    setQuality,
    toggleSetting,
    setFpsLimit
  } = useGraphicsStore();

  const qualities = ['low', 'medium', 'high', 'ultra'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">3D Graphics & Performance</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 my-6">
          {/* Quality Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quality Preset
            </label>
            <div className="grid grid-cols-4 gap-2">
              {qualities.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`py-2 text-xs font-bold uppercase rounded-xl border transition-all ${
                    quality === q
                      ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Individual Feature Toggles */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'HDR Environment', key: 'hdr', val: hdr, icon: Sparkles },
              { label: 'Bloom Lighting', key: 'bloom', val: bloom, icon: Zap },
              { label: 'Ambient Occlusion', key: 'ambientOcclusion', val: ambientOcclusion, icon: Eye },
              { label: 'Dynamic Shadows', key: 'shadows', val: shadows, icon: Monitor },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => toggleSetting(item.key)}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    item.val
                      ? 'bg-slate-900 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-950 border-slate-800/80 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      item.val ? 'bg-cyan-400 border-cyan-300' : 'bg-slate-800 border-slate-700'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* FPS Limiter Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
              <span>FPS Limit Target</span>
              <span className="text-cyan-400 font-mono">{fpsLimit} FPS</span>
            </div>
            <input
              type="range"
              min="30"
              max="144"
              step="30"
              value={fpsLimit}
              onChange={(e) => setFpsLimit(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-2"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
