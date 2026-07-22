import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, Mail, Lock, LogIn, Github, Sparkles, UserCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../utils/supabaseClient';

export const Login = () => {
  const navigate = useNavigate();
  const { loginAsGuest, setSession } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (err) throw err;

      if (data.session) {
        setSession(data.session);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Try again or enter as Guest.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-800 shadow-2xl space-y-6 text-left">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-1">
            <Crown className="w-8 h-8 fill-amber-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Welcome Back</h2>
          <p className="text-xs text-slate-400">Sign in to sync your ELO rating and match history</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
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
            <LogIn className="w-4 h-4 fill-black" />
            {loading ? 'Signing In...' : 'Sign In with Email'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
            <span className="bg-slate-900 px-3 py-0.5 rounded-full">Or Continue With</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleGuestLogin}
            className="py-2.5 px-4 glass-panel hover:bg-slate-800 rounded-2xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            Guest Play
          </button>

          <button
            onClick={handleGuestLogin}
            className="py-2.5 px-4 glass-panel hover:bg-slate-800 rounded-2xl text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <Github className="w-4 h-4" />
            GitHub
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber-400 font-bold hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
};
