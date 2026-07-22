import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Swords, Bot, Trophy, Flame, Users, History, ArrowUpRight, Award, Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const Dashboard = () => {
  const { user } = useAuthStore();

  const winRate = user
    ? Math.round((user.wins / (user.wins + user.losses + user.draws || 1)) * 100)
    : 70;

  return (
    <div className="space-y-8 text-left max-w-7xl mx-auto p-4 lg:p-6">
      {/* Player Header Banner */}
      <div className="p-6 lg:p-8 glass-panel-glow rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 z-10">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={user?.username}
              className="w-20 h-20 rounded-full border-2 border-amber-400 shadow-xl object-cover"
            />
            <span className="absolute bottom-0 right-0 p-1.5 bg-amber-400 text-black rounded-full shadow-lg">
              <Crown className="w-4 h-4 fill-black" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-100">{user?.username || 'Player'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO RANK
              </span>
            </div>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-amber-400" /> {user?.rating || 1200} Elo Rating
              </span>
              <span className="text-xs font-semibold text-cyan-400">
                Global Rank #42
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Play Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto z-10">
          <Link
            to="/play-online"
            className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Swords className="w-4 h-4 fill-black" />
            Play Online
          </Link>
          <Link
            to="/play-ai"
            className="flex-1 md:flex-none px-6 py-3 glass-panel text-slate-100 font-extrabold text-xs rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            Play AI
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Rating ELO', val: user?.rating || 1200, color: 'text-amber-400', icon: Trophy },
          { label: 'Total Wins', val: user?.wins || 14, color: 'text-emerald-400', icon: Award },
          { label: 'Total Losses', val: user?.losses || 6, color: 'text-red-400', icon: Flame },
          { label: 'Win Percentage', val: `${winRate}%`, color: 'text-cyan-400', icon: Zap },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="p-5 glass-panel rounded-3xl space-y-2 text-left">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase">{stat.label}</span>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <span className={`block text-2xl font-extrabold ${stat.color}`}>{stat.val}</span>
            </div>
          );
        })}
      </div>

      {/* Dashboard Main Grid (Recent Matches & Friends) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Matches Column */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" /> Recent Matches
            </h3>
            <Link to="/history" className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {[
              { opponent: 'Grandmaster_Garry', result: 'Victory', mode: 'Online Rated', elo: '+16', time: '2 hours ago' },
              { opponent: 'Stockfish_Hard', result: 'Defeat', mode: 'AI Mode', elo: '-8', time: '1 day ago' },
              { opponent: 'Hikaru_N', result: 'Draw', mode: 'Online Blitz', elo: '+2', time: '2 days ago' },
            ].map((match, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 transition-all text-xs"
              >
                <div>
                  <span className="font-bold text-slate-200 block">{match.opponent}</span>
                  <span className="text-[10px] text-slate-400">{match.mode} • {match.time}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold block ${
                      match.result === 'Victory'
                        ? 'text-emerald-400'
                        : match.result === 'Defeat'
                        ? 'text-red-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {match.result}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{match.elo} ELO</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Friends Column */}
        <div className="lg:col-span-4 glass-panel rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Active Friends
            </h3>
            <Link to="/friends" className="text-xs font-bold text-cyan-400 hover:underline">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Magnus_V', status: 'In Match', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=250&q=80' },
              { name: 'Alireza_F', status: 'Online', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
              { name: 'Judit_P', status: 'Offline', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80' },
            ].map((friend, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/40 border border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <img src={friend.avatar} alt={friend.name} className="w-8 h-8 rounded-full border border-slate-700 object-cover" />
                  <div>
                    <span className="block text-xs font-bold text-slate-200">{friend.name}</span>
                    <span
                      className={`block text-[10px] font-semibold ${
                        friend.status === 'Online'
                          ? 'text-emerald-400'
                          : friend.status === 'In Match'
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {friend.status}
                    </span>
                  </div>
                </div>

                <Link
                  to="/play-online"
                  className="px-2.5 py-1 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all"
                >
                  Invite
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
