import { create } from 'zustand';

export const THEMES = {
  wood: {
    id: 'wood',
    name: 'Classic Wood',
    lightSquare: '#e8d5a8',
    darkSquare: '#6b3a20',
    border: '#3e2210',
    whitePiece: '#f0e2cc',
    blackPiece: '#1a1008',
    highlightMove: '#8fa760',
    highlightSelect: '#baca44',
    roughness: 0.45,
    metalness: 0.05,
    bgGradient: 'from-amber-950/40 via-stone-950 to-slate-950'
  },
  marble: {
    id: 'marble',
    name: 'Carrara Marble',
    lightSquare: '#f0f4f8',
    darkSquare: '#475569',
    border: '#1e293b',
    whitePiece: '#ffffff',
    blackPiece: '#1e293b',
    highlightMove: '#38bdf8',
    highlightSelect: '#0284c7',
    roughness: 0.15,
    metalness: 0.2,
    bgGradient: 'from-slate-900 via-slate-950 to-zinc-950'
  },
  glass: {
    id: 'glass',
    name: 'Frosted Glass',
    lightSquare: 'rgba(255, 255, 255, 0.7)',
    darkSquare: 'rgba(56, 189, 248, 0.4)',
    border: '#0284c7',
    whitePiece: '#e0f2fe',
    blackPiece: '#0369a1',
    highlightMove: '#38bdf8',
    highlightSelect: '#7dd3fc',
    roughness: 0.1,
    metalness: 0.8,
    transmission: 0.6,
    bgGradient: 'from-sky-950/50 via-slate-950 to-black'
  },
  gold: {
    id: 'gold',
    name: 'Royal Gold',
    lightSquare: '#fef08a',
    darkSquare: '#854d0e',
    border: '#a16207',
    whitePiece: '#fef9c3',
    blackPiece: '#713f12',
    highlightMove: '#eab308',
    highlightSelect: '#facc15',
    roughness: 0.2,
    metalness: 0.9,
    bgGradient: 'from-yellow-950/40 via-stone-950 to-slate-950'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk 2099',
    lightSquare: '#1e1b4b',
    darkSquare: '#4c1d95',
    border: '#00ffcc',
    whitePiece: '#00ffcc',
    blackPiece: '#ff007f',
    highlightMove: '#00ffcc',
    highlightSelect: '#ff007f',
    roughness: 0.3,
    metalness: 0.6,
    bgGradient: 'from-purple-950/60 via-slate-950 to-cyan-950/40'
  },
  neon: {
    id: 'neon',
    name: 'Neon Matrix',
    lightSquare: '#064e3b',
    darkSquare: '#022c22',
    border: '#10b981',
    whitePiece: '#34d399',
    blackPiece: '#065f46',
    highlightMove: '#10b981',
    highlightSelect: '#6ee7b7',
    roughness: 0.2,
    metalness: 0.7,
    bgGradient: 'from-emerald-950/50 via-slate-950 to-black'
  },
  fantasy: {
    id: 'fantasy',
    name: 'Dragon Fantasy',
    lightSquare: '#991b1b',
    darkSquare: '#450a0a',
    border: '#dc2626',
    whitePiece: '#fca5a5',
    blackPiece: '#7f1d1d',
    highlightMove: '#ef4444',
    highlightSelect: '#f87171',
    roughness: 0.35,
    metalness: 0.4,
    bgGradient: 'from-red-950/50 via-slate-950 to-stone-950'
  },
  dark: {
    id: 'dark',
    name: 'Obsidian Dark',
    lightSquare: '#334155',
    darkSquare: '#0f172a',
    border: '#475569',
    whitePiece: '#cbd5e1',
    blackPiece: '#020617',
    highlightMove: '#64748b',
    highlightSelect: '#94a3b8',
    roughness: 0.25,
    metalness: 0.5,
    bgGradient: 'from-slate-950 via-zinc-950 to-black'
  }
};

export const useThemeStore = create((set) => ({
  activeThemeId: 'wood',
  theme: THEMES.wood,
  setTheme: (themeId) => {
    if (THEMES[themeId]) {
      set({ activeThemeId: themeId, theme: THEMES[themeId] });
    }
  }
}));
