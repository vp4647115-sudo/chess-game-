import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../utils/supabaseClient';

export const Register = () => {
  const navigate = useNavigate();
  const { setSession, loginAsGuest } = useAuthStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (err) throw err;

      if (data.session) {
        setSession(data.session);
        navigate('/dashboard');
      } else {
        // Guest fallback if email confirmation is required by Supabase
        loginAsGuest();
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6 text-left">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
            <Crown className="w-8 h-8 fill-amber-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Create Player Account</h2>
          <p className="text-xs text-slate-400">Join the 3D Multiplayer Chess Platform</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Grandmaster_99"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="grandmaster@chess.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-xs rounded-2xl shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-amber-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
