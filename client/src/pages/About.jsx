import React from 'react';
import { Info, Code, ShieldCheck, Cpu, Layers } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6 text-left">
      <div className="flex items-center gap-3 p-6 glass-panel rounded-3xl border border-slate-800">
        <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">About 3D Chess Platform</h1>
          <p className="text-xs text-slate-400">Architectural breakdown and modern web tech stack</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 space-y-6">
        <div className="space-y-3">
          <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Layers className="w-5 h-5" /> Modern Stack Engineering
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Built as a production-grade, highly scalable web platform combining React 19, React Three Fiber, Three.js, Socket.IO, Stockfish 16, and Supabase PostgreSQL with RLS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-cyan-400 block">Frontend Technologies</span>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• React 19 + Vite</li>
              <li>• React Three Fiber & Drei</li>
              <li>• Tailwind CSS & Glassmorphism</li>
              <li>• GSAP & Framer Motion</li>
              <li>• Zustand State Management</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-400 block">Backend & Database</span>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Node.js & Express API</li>
              <li>• Socket.IO Realtime Engine</li>
              <li>• chess.js Rule Validation</li>
              <li>• Stockfish AI Evaluation</li>
              <li>• Supabase DB & Row Level Security</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
