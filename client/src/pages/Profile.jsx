import React, { useState } from 'react';
import { User, Crown, Mail, Shield, Save, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export const Profile = () => {
  const { user } = useAuthStore();
  const [username, setUsername] = useState(user?.username || 'Grandmaster_Guest');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-6 space-y-6 text-left">
      <div className="flex items-center gap-3 p-6 glass-panel rounded-3xl border border-slate-800">
        <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Player Profile</h1>
          <p className="text-xs text-slate-400">Update your avatar, username, and view grandmaster stats</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl p-6 space-y-6">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
            alt={user?.username}
            className="w-20 h-20 rounded-full border-2 border-amber-400 object-cover shadow-xl"
          />
          <div>
            <span className="text-lg font-bold text-slate-100 block">{user?.username}</span>
            <span className="text-xs text-amber-400 font-bold block">⚡ {user?.rating || 1200} Elo Rating</span>
            <span className="text-[10px] text-slate-400 block">{user?.email}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1">Display Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-2xl transition-all flex items-center gap-2"
          >
            {saved ? <Check className="w-4 h-4 text-black" /> : <Save className="w-4 h-4" />}
            {saved ? 'Profile Saved' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};
