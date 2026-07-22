-- Seed initial demo grandmasters into Users & Leaderboard
INSERT INTO public.users (id, username, email, avatar, rating, wins, losses, draws)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Magnus_V', 'magnus@chess.3d', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=250&q=80', 2850, 1420, 180, 210),
    ('22222222-2222-2222-2222-222222222222', 'Hikaru_N', 'hikaru@chess.3d', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', 2820, 1380, 205, 195),
    ('33333333-3333-3333-3333-333333333333', 'Alireza_F', 'alireza@chess.3d', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80', 2790, 950, 210, 130),
    ('44444444-4444-4444-4444-444444444444', 'Judit_P', 'judit@chess.3d', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80', 2735, 890, 190, 160),
    ('55555555-5555-5555-5555-555555555555', 'Garry_K', 'garry@chess.3d', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80', 2851, 1540, 120, 230)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.leaderboard (player_id, rating, wins, losses, draws)
VALUES 
    ('55555555-5555-5555-5555-555555555555', 2851, 1540, 120, 230),
    ('11111111-1111-1111-1111-111111111111', 2850, 1420, 180, 210),
    ('22222222-2222-2222-2222-222222222222', 2820, 1380, 205, 195),
    ('33333333-3333-3333-3333-333333333333', 2790, 950, 210, 130),
    ('44444444-4444-4444-4444-444444444444', 2735, 890, 190, 160)
ON CONFLICT (player_id) DO NOTHING;
