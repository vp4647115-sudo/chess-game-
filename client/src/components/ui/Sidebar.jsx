import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Swords, Bot, Trophy, History, Users, Settings, BookOpen, Info, User } from 'lucide-react';

export const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/play-online', label: 'Play Online', icon: Swords },
    { path: '/play-ai', label: 'Play AI', icon: Bot },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/history', label: 'Match History', icon: History },
    { path: '/friends', label: 'Friends', icon: Users },
    { path: '/profile', label: 'My Profile', icon: User },
    { path: '/instructions', label: 'Instructions', icon: BookOpen },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/about', label: 'About Project', icon: Info },
  ];

  return (
    <aside className="w-64 glass-panel hidden lg:flex flex-col p-4 border-r border-slate-800/80 min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-400 border border-amber-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
