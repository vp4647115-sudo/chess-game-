import { create } from 'zustand';
import { supabase } from '../utils/supabaseClient';

export const useAuthStore = create((set) => ({
  user: {
    id: 'guest_user_001',
    username: 'Grandmaster_Guest',
    email: 'guest@chess.3d',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    rating: 1250,
    wins: 14,
    losses: 6,
    draws: 2,
    isGuest: true
  },
  session: null,
  isAuthenticated: true,

  setSession: async (session) => {
    if (session?.user) {
      let dbUser = null;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (data) dbUser = data;
      } catch (err) {
        console.warn("Could not query user stats from public.users table:", err);
      }

      set({
        session,
        isAuthenticated: true,
        user: {
          id: session.user.id,
          username: dbUser?.username || session.user.user_metadata?.username || session.user.email.split('@')[0],
          email: session.user.email,
          avatar: dbUser?.avatar || session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          rating: dbUser?.rating || 1200,
          wins: dbUser?.wins || 0,
          losses: dbUser?.losses || 0,
          draws: dbUser?.draws || 0,
          isGuest: false
        }
      });
    } else {
      set({ session: null });
    }
  },

  loginAsGuest: () => {
    set({
      isAuthenticated: true,
      user: {
        id: `guest_${Math.floor(Math.random() * 10000)}`,
        username: `Guest_${Math.floor(Math.random() * 1000)}`,
        email: 'guest@chess3d.io',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        rating: 1200,
        wins: 5,
        losses: 2,
        draws: 1,
        isGuest: true
      }
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      session: null,
      isAuthenticated: false,
      user: null
    });
  },

  adjustStats: (winOrLoss) => {
    set((state) => {
      if (!state.user) return {};
      const deltaRating = winOrLoss === 'win' ? 15 : winOrLoss === 'loss' ? -15 : 0;
      const newRating = Math.max(100, state.user.rating + deltaRating);
      const wins = winOrLoss === 'win' ? state.user.wins + 1 : state.user.wins;
      const losses = winOrLoss === 'loss' ? state.user.losses + 1 : state.user.losses;

      // Update Supabase metadata if not guest
      if (!state.user.isGuest && state.session?.user) {
        supabase.auth.updateUser({
          data: {
            rating: newRating,
            wins,
            losses
          }
        }).catch(() => {});
      }

      return {
        user: {
          ...state.user,
          rating: newRating,
          wins,
          losses
        }
      };
    });
  }
}));
