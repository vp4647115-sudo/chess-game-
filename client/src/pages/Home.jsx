import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swords, Bot, Trophy, Shield, Cpu, Sparkles, Flame, Play } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ChessBoard3D } from '../components/3d/ChessBoard3D';
import { useAuthStore } from '../store/useAuthStore';

export const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-slate-950">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 space-y-6 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen 3D Chess Experience
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Master Chess in a <br />
            <span className="bg-gradient-to-r from-amber-400 via-yellow-200 to-cyan-400 bg-clip-text text-transparent">
              Visual 3D Dimension
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-xl">
            Challenge players worldwide in real-time or face our advanced Stockfish AI engine. Featuring procedural 3D materials, high-framerate rendering, customizable graphics, and competitive global leaderboards.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/play-online"
              className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-sm rounded-2xl shadow-xl shadow-amber-500/25 hover:scale-105 transition-all flex items-center gap-2"
            >
              <Swords className="w-4 h-4 fill-black" />
              Play Online Now
            </Link>

            <Link
              to="/play-ai"
              className="px-6 py-3.5 glass-panel text-slate-100 font-extrabold text-sm rounded-2xl hover:bg-slate-800 hover:border-slate-700 transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              Challenge Stockfish AI
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80">
            <div>
              <span className="block text-2xl font-extrabold text-amber-400">100K+</span>
              <span className="text-xs text-slate-400">Active Players</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-cyan-400">60 FPS</span>
              <span className="text-xs text-slate-400">Web3D Engine</span>
            </div>
            <div>
              <span className="block text-2xl font-extrabold text-emerald-400">Stockfish</span>
              <span className="text-xs text-slate-400">Grandmaster AI</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column Interactive 3D Preview Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 h-[420px] w-full glass-panel-glow rounded-3xl relative overflow-hidden"
        >
          <Canvas camera={{ position: [0, 8, 8], fov: 40 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} />
            <ChessBoard3D />
            <OrbitControls autoRotate autoRotateSpeed={1.5} enableZoom={false} />
          </Canvas>

          <div className="absolute bottom-4 left-4 right-4 p-3 glass-panel rounded-2xl flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" /> 3D Realtime Board Preview
            </span>
            <span className="text-cyan-400 font-mono font-bold">PRO GRAPHICS</span>
          </div>
        </motion.div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Engineered for Modern Grandmasters
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Every move synchronized with sub-millisecond precision, wrapped in a high-performance 3D ambient design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Swords,
              title: 'Socket.IO Multiplayer',
              desc: 'Ranked Elo matchmaking, private rooms, spectator mode, and real-time server synchronized timers.',
              color: 'text-amber-400'
            },
            {
              icon: Cpu,
              title: 'Stockfish 16 Engine',
              desc: 'Practice against multiple AI difficulties, request tactical hints, and review real-time positional evaluation.',
              color: 'text-cyan-400'
            },
            {
              icon: Shield,
              title: 'Supabase Realtime & RLS',
              desc: 'Secure authentication, game history logs, PGN/FEN exports, and live updated leaderboards.',
              color: 'text-emerald-400'
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 glass-panel rounded-3xl border border-slate-800 hover:border-slate-700 transition-all text-left space-y-3"
              >
                <div className={`p-3 w-fit rounded-2xl bg-slate-900 ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-100">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
