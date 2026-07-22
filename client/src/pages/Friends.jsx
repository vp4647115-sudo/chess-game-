import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, UserMinus, Swords, Check, Search } from 'lucide-react';

const mockFriends = [
  { id: 'f1', name: 'Magnus_V', rating: 2850, status: 'Online', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=250&q=80' },
  { id: 'f2', name: 'Alireza_F', rating: 2790, status: 'In Match', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80' },
  { id: 'f3', name: 'Judit_P', rating: 2735, status: 'Offline', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80' },
];

export const Friends = () => {
  const [friendsList, setFriendsList] = useState(mockFriends);
  const [newFriendInput, setNewFriendInput] = useState('');

  const handleAddFriend = (e) => {
    e.preventDefault();
    if (!newFriendInput.trim()) return;
    const newFriend = {
      id: `f_${Date.now()}`,
      name: newFriendInput.trim(),
      rating: 1200,
      status: 'Online',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'
    };
    setFriendsList([...friendsList, newFriend]);
    setNewFriendInput('');
  };

  const handleRemoveFriend = (id) => {
    setFriendsList(friendsList.filter((f) => f.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass-panel rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100">Friends & Challenges</h1>
            <p className="text-xs text-slate-400">Connect with fellow players and challenge them to 3D matches</p>
          </div>
        </div>

        <form onSubmit={handleAddFriend} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={newFriendInput}
            onChange={(e) => setNewFriendInput(e.target.value)}
            placeholder="Username..."
            className="bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded-2xl transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {friendsList.map((friend) => (
          <div
            key={friend.id}
            className="p-4 glass-panel rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <img src={friend.avatar} alt={friend.name} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
              <div>
                <span className="font-bold text-slate-100 block">{friend.name}</span>
                <span className="text-[10px] text-amber-400 block font-semibold">⚡ {friend.rating} ELO</span>
                <span
                  className={`text-[10px] font-bold ${
                    friend.status === 'Online'
                      ? 'text-emerald-400'
                      : friend.status === 'In Match'
                      ? 'text-amber-400'
                      : 'text-slate-500'
                  }`}
                >
                  ● {friend.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/play-online"
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] rounded-xl transition-all flex items-center gap-1"
              >
                <Swords className="w-3.5 h-3.5 fill-black" /> Invite
              </Link>

              <button
                onClick={() => handleRemoveFriend(friend.id)}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
                title="Remove Friend"
              >
                <UserMinus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
