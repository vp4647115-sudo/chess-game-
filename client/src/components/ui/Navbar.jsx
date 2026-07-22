import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Crown, Swords, Bot, Trophy, History, Users, Settings, HelpCircle, Info, User, LogOut, Palette, Sliders } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ThemeSelector } from './ThemeSelector';
import { GraphicsModal } from './GraphicsModal';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showGraphicsModal, setShowGraphicsModal] = useState(false);

  const navLinks = [
    { path: '/play-online', label: 'Play Online', icon: Swords },
    { path: '/play-ai', label: 'Play AI', icon: Bot },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/history', label: 'History', icon: History },
    { path: '/friends', label: 'Friends', icon: Users },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
              <Crown className="w-6 h-6 fill-black" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-yellow-200 to-cyan-400 bg-clip-text text-transparent">
                CHESS 3D
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                PRO PLATFORM
              </span>
            </div>
          </Link>

          {/* Center Nav Items */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowThemeModal(true)}
              className="p-2 text-slate-300 hover:text-amber-400 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-all"
              title="Themes"
            >
              <Palette className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowGraphicsModal(true)}
              className="p-2 text-slate-300 hover:text-cyan-400 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-all"
              title="Graphics Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <Link
              to="/settings"
              className="p-2 text-slate-300 hover:text-white rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition-all"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <Link to="/dashboard" className="flex items-center gap-2.5 group">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full border border-amber-500/50 group-hover:scale-105 transition-all"
                  />
                  <div className="hidden sm:block text-left">
                    <span className="block text-xs font-bold text-slate-200 group-hover:text-amber-400">
                      {user.username}
                    </span>
                    <span className="block text-[10px] text-amber-400 font-medium">
                      ⚡ {user.rating} ELO
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black rounded-xl shadow-md shadow-amber-500/20 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showThemeModal && <ThemeSelector onClose={() => setShowThemeModal(false)} />}
      {showGraphicsModal && <GraphicsModal onClose={() => setShowGraphicsModal(false)} />}
    </>
  );
};
