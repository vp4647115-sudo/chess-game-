import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/ui/Navbar';
import { Sidebar } from './components/ui/Sidebar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PlayOnline } from './pages/PlayOnline';
import { PlayAI } from './pages/PlayAI';
import { Leaderboard } from './pages/Leaderboard';
import { GameHistory } from './pages/GameHistory';
import { Friends } from './pages/Friends';
import { Settings } from './pages/Settings';
import { Instructions } from './pages/Instructions';
import { About } from './pages/About';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { useThemeStore } from './store/useThemeStore';
import { useAuthStore } from './store/useAuthStore';
import { supabase } from './utils/supabaseClient';

export function App() {
  const theme = useThemeStore((state) => state.theme);
  const { setSession } = useAuthStore();

  React.useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSession(session);
    });

    // Listen for state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className={`min-h-screen flex flex-col bg-gradient-to-b ${theme.bgGradient || 'from-slate-950 to-black'} text-slate-100`}>
        <Navbar />

        <div className="flex-1 flex w-full">
          <Sidebar />

          <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-x-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/play-online" element={<PlayOnline />} />
              <Route path="/play-ai" element={<PlayAI />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/history" element={<GameHistory />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/instructions" element={<Instructions />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
