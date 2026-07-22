-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

-- Users RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.users FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE USING (auth.uid() = id);

-- Games RLS Policies
CREATE POLICY "Games are viewable by everyone" 
ON public.games FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create games" 
ON public.games FOR INSERT WITH CHECK (auth.uid() = white_player OR auth.uid() = black_player);

-- Moves RLS Policies
CREATE POLICY "Moves are viewable by everyone" 
ON public.moves FOR SELECT USING (true);

CREATE POLICY "Players can insert moves for their games" 
ON public.moves FOR INSERT WITH CHECK (true);

-- Leaderboard RLS Policies
CREATE POLICY "Leaderboard viewable by everyone" 
ON public.leaderboard FOR SELECT USING (true);

-- Friends RLS Policies
CREATE POLICY "Users can view their friends and sent requests" 
ON public.friends FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can add friends" 
ON public.friends FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friend statuses" 
ON public.friends FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);
