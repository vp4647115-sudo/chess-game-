import React, { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { Swords, Users, Copy, Check, Lock, Loader2, Play, Square, LogOut, AlertCircle, Lightbulb } from 'lucide-react';
import { ChessScene } from '../components/3d/ChessScene';
import { TimerDisplay } from '../components/ui/TimerDisplay';
import { MoveHistory } from '../components/ui/MoveHistory';
import { ChatBox } from '../components/ui/ChatBox';
import { GameControls } from '../components/ui/GameControls';
import { CapturedPieces } from '../components/ui/CapturedPieces';
import { useGameStore } from '../store/useGameStore';
import { useAuthStore } from '../store/useAuthStore';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

export const PlayOnline = () => {
  const { user } = useAuthStore();
  const {
    fen,
    setGameMode,
    setPlayerColor,
    makeMove,
    resetGame,
    setClocks,
    setTimerActive,
    isGameOver,
    gameOverReason,
    turn,
    selectedSquare,
    legalMoves,
    suggestedHint,
    setHint
  } = useGameStore();

  const [socket, setSocket] = useState(null);
  const [phase, setPhase] = useState('lobby'); // 'lobby' | 'waiting' | 'playing' | 'gameover'
  const [roomId, setRoomId] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [whitePlayer, setWhitePlayer] = useState(null);
  const [blackPlayer, setBlackPlayer] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [gameOverInfo, setGameOverInfo] = useState(null);

  useEffect(() => {
    setGameMode('online');
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Chess Socket server');
    });

    newSocket.on('matchmaking_status', (data) => {
      setIsSearching(data.queued);
    });

    newSocket.on('room_created', (data) => {
      setRoomId(data.roomId);
      setPhase('waiting');
      setWhitePlayer(data.roomState.white?.user || user);
      setPlayerColor('w');
      resetGame();
    });

    newSocket.on('game_started', (data) => {
      setRoomId(data.roomId);
      setPhase('playing');
      setIsSearching(false);
      setWhitePlayer(data.white);
      setBlackPlayer(data.black);

      if (newSocket && data.whiteSocketId === newSocket.id) {
        setPlayerColor('w');
      } else {
        setPlayerColor('b');
      }
      resetGame(data.fen);
      if (data.clocks) setClocks(data.clocks);
      setTimerActive(true);
    });

    newSocket.on('move_executed', (data) => {
      // Apply opponent's move to local chess state
      const chess = useGameStore.getState().chess;
      const localFen = chess.fen();
      // Only apply if it's not our own move echoed back
      if (data.fen && data.fen !== localFen) {
        makeMove(data.move);
      }
      if (data.clocks) setClocks(data.clocks);

      if (data.gameOverReason) {
        setGameOverInfo({ reason: data.gameOverReason });
        setPhase('gameover');

        const playerColor = useGameStore.getState().playerColor;
        const { adjustStats } = useAuthStore.getState();
        if (adjustStats) {
          const updatedChess = useGameStore.getState().chess;
          if (updatedChess.isCheckmate()) {
            const loserColor = updatedChess.turn();
            if (loserColor === playerColor) {
              adjustStats('loss');
            } else {
              adjustStats('win');
            }
          }
        }
      }
    });

    newSocket.on('clock_tick', (clocks) => {
      setClocks(clocks);
    });

    newSocket.on('game_over', (data) => {
      setGameOverInfo(data);
      setPhase('gameover');
      setTimerActive(false);

      const playerColor = useGameStore.getState().playerColor;
      const { adjustStats } = useAuthStore.getState();
      if (adjustStats && data.winner) {
        if (data.winner === playerColor) {
          adjustStats('win');
        } else if (data.winner !== 'draw') {
          adjustStats('loss');
        }
      }
    });

    newSocket.on('chat_received', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    newSocket.on('error_message', (msg) => {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    });

    newSocket.on('joined_as_spectator', (data) => {
      setRoomId(data.roomId);
      setPhase('playing');
      if (data.fen) resetGame(data.fen);
      if (data.clocks) setClocks(data.clocks);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Intercept moves and emit to server
  useEffect(() => {
    if (phase !== 'playing' || !socket || !roomId) return;

    const unsubscribe = useGameStore.subscribe((state, prevState) => {
      if (state.lastMove && state.lastMove !== prevState.lastMove) {
        const playerColor = useGameStore.getState().playerColor;
        // Only emit if it was OUR move (previous turn was our color)
        if (prevState.turn === playerColor) {
          socket.emit('make_move', {
            roomId,
            move: state.lastMove
          });
        }
      }
    });

    return () => unsubscribe();
  }, [phase, socket, roomId]);

  const handleStartMatchmaking = () => {
    if (socket) {
      setIsSearching(true);
      setErrorMsg('');
      socket.emit('join_matchmaking', user || { username: `Guest_${Date.now().toString(36)}`, rating: 1200 });
    }
  };

  const handleCancelMatchmaking = () => {
    if (socket) {
      setIsSearching(false);
      socket.emit('cancel_matchmaking');
    }
  };

  const handleCreateRoom = () => {
    if (socket) {
      setErrorMsg('');
      socket.emit('create_room', {
        userData: user || { username: `Guest_${Date.now().toString(36)}`, rating: 1200 },
        timeControl: 600
      });
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (socket && joinCodeInput.trim()) {
      setErrorMsg('');
      socket.emit('join_room', {
        roomId: joinCodeInput.trim().toUpperCase(),
        userData: user || { username: `Guest_${Date.now().toString(36)}`, rating: 1200 }
      });
    }
  };

  const handleLeaveRoom = () => {
    if (socket && roomId) {
      socket.emit('leave_room', { roomId });
    }
    setPhase('lobby');
    setRoomId('');
    setWhitePlayer(null);
    setBlackPlayer(null);
    setChatMessages([]);
    setGameOverInfo(null);
    setIsSearching(false);
    resetGame();
    setTimerActive(false);
  };

  const handleSendChat = (message) => {
    if (socket && roomId) {
      socket.emit('send_chat', { roomId, message, sender: user?.username || 'Player' });
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleNewGame = () => {
    setPhase('lobby');
    setRoomId('');
    setWhitePlayer(null);
    setBlackPlayer(null);
    setChatMessages([]);
    setGameOverInfo(null);
    resetGame();
    setTimerActive(false);
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // LOBBY PHASE — Find/Create/Join game
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (phase === 'lobby') {
    return (
      <div className="max-w-2xl mx-auto p-4 lg:p-6 my-8">
        <div className="glass-panel rounded-3xl p-8 space-y-6 text-left border border-slate-800">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Swords className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-100">Play Online Multiplayer</h2>
            <p className="text-xs text-slate-400">Match against online opponents or invite a friend</p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-2xl flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400" />
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={isSearching ? handleCancelMatchmaking : handleStartMatchmaking}
              className={`p-6 rounded-3xl text-left space-y-3 transition-all group border ${
                isSearching
                  ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'glass-panel-glow hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <Swords className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-all" />
                {isSearching && <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />}
              </div>
              <h3 className="text-base font-bold text-slate-100">
                {isSearching ? 'Searching... (Click to Cancel)' : 'Random Matchmaking'}
              </h3>
              <p className="text-xs text-slate-400">Find an opponent with similar Elo rating instantly.</p>
            </button>

            <button
              onClick={handleCreateRoom}
              className="p-6 glass-panel hover:border-cyan-400 rounded-3xl text-left space-y-3 transition-all group border border-slate-800"
            >
              <Lock className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-all" />
              <h3 className="text-base font-bold text-slate-100">Create Private Room</h3>
              <p className="text-xs text-slate-400">Generate a room code to play with friends.</p>
            </button>
          </div>

          {/* Join Room Form */}
          <form onSubmit={handleJoinRoom} className="pt-4 border-t border-slate-800 space-y-2">
            <label className="block text-xs font-bold text-slate-400">Join Existing Private Room</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                placeholder="Enter Room Code (e.g. ROOM12)"
                className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-slate-100 uppercase focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs rounded-2xl transition-all"
              >
                Join Room
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // WAITING PHASE — Room created, waiting for opponent
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (phase === 'waiting') {
    return (
      <div className="max-w-lg mx-auto p-4 lg:p-6 my-12">
        <div className="glass-panel rounded-3xl p-8 space-y-6 text-center border border-slate-800">
          <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-slate-100">Waiting for Opponent</h2>
            <p className="text-xs text-slate-400">Share the room code below with your friend to start the game</p>
          </div>

          {/* Room Code Display */}
          <div className="bg-slate-900 rounded-2xl p-4 border border-slate-700 space-y-2">
            <span className="block text-xs text-slate-400 font-medium">Room Code</span>
            <span className="block text-3xl font-mono font-extrabold text-amber-400 tracking-[0.3em]">{roomId}</span>
          </div>

          <button
            onClick={copyRoomCode}
            className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm rounded-2xl transition-all"
          >
            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedCode ? 'Copied to Clipboard!' : 'Copy Room Code'}
          </button>

          <button
            onClick={handleLeaveRoom}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold text-sm rounded-2xl border border-red-500/30 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Leave Room
          </button>
        </div>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GAME OVER PHASE — show result overlay
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const gameOverOverlay = (phase === 'gameover' || isGameOver) && (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
      <div className="text-center space-y-4 p-8">
        <h3 className="text-2xl font-extrabold text-amber-400">Game Over</h3>
        <p className="text-sm text-slate-300">
          {gameOverInfo?.reason || gameOverReason || 'The game has ended.'}
        </p>
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={handleNewGame}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm rounded-2xl transition-all"
          >
            New Game
          </button>
          <button
            onClick={handleLeaveRoom}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-2xl transition-all"
          >
            Back to Lobby
          </button>
        </div>
      </div>
    </div>
  );

  const handleGetHint = () => {
    const currentFen = useGameStore.getState().fen;
    fetch(`${SERVER_URL}/api/ai/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen: currentFen, difficulty: 'hard' })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setHint({
            text: data.result.hint || `Best move: ${data.result.move?.from} to ${data.result.move?.to}`,
            from: data.result.move?.from,
            to: data.result.move?.to
          });
        }
      })
      .catch(() => {});
  };

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PLAYING PHASE — Active 3D Game Room
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return (
    <div className="max-w-[1920px] mx-auto p-4 lg:p-6 space-y-4">
      {/* Error Banner */}
      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-2xl flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 text-red-400" />
          {errorMsg}
        </div>
      )}

      {/* Float hint overlay over canvas */}
      {suggestedHint && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-2xl flex items-center justify-between text-xs text-amber-300">
          <span className="flex items-center gap-2 font-semibold">
            <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" /> {typeof suggestedHint === 'string' ? suggestedHint : suggestedHint.text}
          </span>
          <button onClick={() => setHint(null)} className="text-[10px] font-bold text-amber-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-8rem)]">
        {/* Left Column: Black Timer + 3D Board + White Timer */}
        <div className="lg:col-span-8 flex flex-col space-y-3 h-full">
          <div className="flex items-center justify-between">
            <TimerDisplay color="b" playerInfo={blackPlayer} />
            <CapturedPieces color="b" />
          </div>

          {/* Room Code Badge */}
          <div className="flex items-center justify-between px-3 py-1.5 glass-panel rounded-xl text-xs">
            <span className="text-slate-400">Room: <strong className="text-amber-400 font-mono">{roomId}</strong></span>
            <div className="flex items-center gap-3">
              <button onClick={copyRoomCode} className="text-cyan-400 hover:underline flex items-center gap-1 font-bold">
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleLeaveRoom}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                Leave
              </button>
            </div>
          </div>

          {/* 3D Board with game over overlay */}
          <div className="relative flex-1">
            {gameOverOverlay}
            
            {/* Float hint overlay over canvas */}
            {suggestedHint && (
              <div className="absolute top-4 left-4 z-10 p-3 bg-slate-900/95 backdrop-blur-md border border-amber-500/40 rounded-2xl flex items-center gap-3 text-xs text-amber-300 shadow-xl max-w-sm">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-semibold">{typeof suggestedHint === 'string' ? suggestedHint : suggestedHint.text}</span>
                <button onClick={() => setHint(null)} className="text-[10px] font-bold text-amber-400 hover:underline shrink-0 ml-auto pl-2 border-l border-slate-700">
                  Dismiss
                </button>
              </div>
            )}

            <ChessScene />
          </div>

          <div className="flex items-center justify-between">
            <TimerDisplay color="w" playerInfo={whitePlayer} />
            <CapturedPieces color="w" />
          </div>

          <GameControls
            onResign={() => {
              socket?.emit('resign_game', { roomId, playerColor: useGameStore.getState().playerColor });
              setGameOverInfo({ reason: 'You resigned. You lost the game!' });
              setPhase('gameover');
              const { adjustStats } = useAuthStore.getState();
              if (adjustStats) {
                adjustStats('loss');
              }
            }}
            onDraw={() => socket?.emit('send_chat', { roomId, message: '🤝 Offers a draw.', sender: user?.username })}
            onGetHint={handleGetHint}
          />
        </div>

        {/* Right Column: Move Notation & Live Chat */}
        <div className="lg:col-span-4 flex flex-col space-y-4 h-full">
          <div className="h-1/2">
            <MoveHistory />
          </div>
          <div className="h-1/2">
            <ChatBox messages={chatMessages} onSendMessage={handleSendChat} />
          </div>
        </div>
      </div>
    </div>
  );
};
