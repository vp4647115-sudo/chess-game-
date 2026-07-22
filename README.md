# 3D Multiplayer Chess Platform

A production-ready, scalable, responsive, visually stunning 3D Multiplayer Chess Platform built with modern web technologies.

![3D Chess Banner](https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=1200&q=80)

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **3D Graphics Engine**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling**: Tailwind CSS with custom theme design system
- **Animations**: Framer Motion, GSAP, Canvas Confetti
- **State Management**: Zustand
- **Chess Logic**: `chess.js`
- **Networking**: `socket.io-client`, `@supabase/supabase-js`
- **Icons**: `lucide-react`

### Backend
- **Runtime**: Node.js + Express.js
- **Realtime Communication**: Socket.IO
- **Chess Engine**: `chess.js` & Stockfish AI Engine Integration
- **Cross-Origin**: CORS & Dotenv

### Database & Authentication
- **Provider**: Supabase (PostgreSQL)
- **Features**: Row Level Security (RLS), Realtime Channels, Supabase Auth (Email, Google, GitHub, Guest fallback)

---

## Directory Structure

```
chess-3d/
├── client/                 # React 19 + Three.js + R3F Frontend
│   ├── src/
│   │   ├── components/     # 3D Canvas scenes & UI components
│   │   ├── pages/          # 14 platform pages
│   │   ├── store/          # Zustand state management
│   │   ├── utils/          # Web Audio sound engine & helpers
│   │   └── App.jsx
│   └── package.json
├── server/                 # Express + Socket.IO + Stockfish Engine
│   ├── socket/             # Room management, matchmaking, clock sync
│   ├── engine/             # Stockfish AI difficulty levels & hints
│   └── server.js
├── supabase/               # Database migrations, RLS policies, & seeds
│   ├── migrations/
│   ├── policies/
│   └── seed.sql
├── docker-compose.yml
└── README.md
```

---

## Features

1. **Immersive 3D Experience**:
   - High-quality 3D chess pieces (Pawn, Knight, Bishop, Rook, Queen, King).
   - Dynamic 3D lighting, OrbitControls, Camera view presets (White, Black, Flip, Top).
   - 8 unique themes: *Classic Wood*, *Marble*, *Glass*, *Gold*, *Cyberpunk*, *Neon*, *Fantasy*, *Dark*.
   - Customizable graphics settings (Bloom, SSAO/AO, Soft Shadows, FPS Cap, Quality).

2. **Realtime Socket.IO Multiplayer**:
   - Random Matchmaking & Elo-based pairing.
   - Private room creation & room code joining.
   - Spectator mode, In-game chat, and server-side clock sync with increment.
   - Auto-reconnect support.

3. **Stockfish AI Mode**:
   - 3 difficulty levels: Easy, Medium, Hard.
   - AI position evaluation bar, hints, suggested moves, replay, and move undo.

4. **Web Audio Sound Effects**:
   - Custom Web Audio API synthesizer for move execution, piece capture, check alert, checkmate fanfare, and UI clicks.

5. **Full Game Rules & Exports**:
   - En passant, Castling, Pawn Promotion, Check, Checkmate, Stalemate, Threefold repetition, Fifty-move rule.
   - FEN & PGN file export and interactive match replay viewer.

---

## Getting Started

### 1. Prerequisites
- Node.js >= v18.x
- npm or yarn

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

### 3. Server Setup
```bash
cd server
npm install
npm run start
```

### 4. Docker Deployment
```bash
docker-compose up --build
```
