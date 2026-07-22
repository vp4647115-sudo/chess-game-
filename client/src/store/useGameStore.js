import { create } from 'zustand';
import { Chess } from 'chess.js';

// Helper to calculate captured pieces from current FEN
const calculateCapturedPieces = (chess) => {
  const initial = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };
  const current = { w: { ...initial }, b: { ...initial } };

  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        current[piece.color][piece.type]--;
      }
    }
  }

  const captured = { w: [], b: [] };
  const pieceTypes = ['q', 'r', 'b', 'n', 'p'];

  pieceTypes.forEach((type) => {
    // Pieces white lost
    for (let i = 0; i < current.w[type]; i++) captured.w.push(type);
    // Pieces black lost
    for (let i = 0; i < current.b[type]; i++) captured.b.push(type);
  });

  return captured;
};

export const useGameStore = create((set, get) => {
  const initialChess = new Chess();

  return {
    chess: initialChess,
    fen: initialChess.fen(),
    pgn: initialChess.pgn(),
    turn: initialChess.turn(),
    history: [],
    selectedSquare: null,
    legalMoves: [],
    lastMove: null,
    checkSquare: null,
    isGameOver: false,
    gameOverReason: '',
    winner: null,
    capturedPieces: { w: [], b: [] },
    
    // Mode & Online/AI configuration
    gameMode: 'ai', // 'ai', 'online', 'local'
    aiDifficulty: 'medium', // 'easy', 'medium', 'hard'
    playerColor: 'w',
    evalScore: '0.0',
    suggestedHint: null,
    
    // Timer state (seconds) — 10 minutes
    clocks: { w: 600, b: 600 },
    timerActive: false,

    // Actions
    resetGame: (fen = null) => {
      const newChess = new Chess(fen || undefined);
      set({
        chess: newChess,
        fen: newChess.fen(),
        pgn: newChess.pgn(),
        turn: newChess.turn(),
        history: [],
        selectedSquare: null,
        legalMoves: [],
        lastMove: null,
        checkSquare: null,
        isGameOver: false,
        gameOverReason: '',
        winner: null,
        capturedPieces: { w: [], b: [] },
        clocks: { w: 600, b: 600 },
        timerActive: false,
        suggestedHint: null,
        evalScore: '0.0'
      });
    },

    setGameMode: (mode) => set({ gameMode: mode }),
    setAIDifficulty: (diff) => set({ aiDifficulty: diff }),
    setPlayerColor: (color) => set({ playerColor: color }),

    selectSquare: (square) => {
      const { chess, turn, isGameOver, playerColor, gameMode } = get();
      if (isGameOver) return;
      
      // In online mode, verify player's turn
      if (gameMode === 'online' && turn !== playerColor) return;

      const piece = chess.get(square);

      // If clicking own piece, update legal moves
      if (piece && piece.color === turn) {
        const moves = chess.moves({ square, verbose: true });
        set({
          selectedSquare: square,
          legalMoves: moves.map((m) => m.to)
        });
        return;
      }

      // If a square was previously selected, attempt move
      const { selectedSquare, legalMoves } = get();
      if (selectedSquare && legalMoves.includes(square)) {
        get().makeMove({ from: selectedSquare, to: square, promotion: 'q' });
        set({ selectedSquare: null, legalMoves: [] });
      } else {
        set({ selectedSquare: null, legalMoves: [] });
      }
    },

    makeMove: (moveObj) => {
      const { chess } = get();
      try {
        const result = chess.move(moveObj);
        if (result) {
          const isCheck = chess.inCheck();
          const isCheckmate = chess.isCheckmate();
          const isDraw = chess.isDraw();

          let checkSq = null;
          if (isCheck) {
            // Find king square of current turn
            const board = chess.board();
            for (let r = 0; r < 8; r++) {
              for (let c = 0; c < 8; c++) {
                const p = board[r][c];
                if (p && p.type === 'k' && p.color === chess.turn()) {
                  checkSq = String.fromCharCode(97 + c) + (8 - r);
                }
              }
            }
          }

          let gameOver = isCheckmate || isDraw;
          let reason = '';
          let win = null;

          if (isCheckmate) {
            win = chess.turn() === 'w' ? 'b' : 'w';
            reason = `Checkmate! ${win === 'w' ? 'White' : 'Black'} wins!`;
          } else if (isDraw) {
            reason = 'Game Draw!';
          }

          set({
            fen: chess.fen(),
            pgn: chess.pgn(),
            turn: chess.turn(),
            history: chess.history({ verbose: true }),
            lastMove: { from: result.from, to: result.to },
            checkSquare: checkSq,
            isGameOver: gameOver,
            gameOverReason: reason,
            winner: win,
            capturedPieces: calculateCapturedPieces(chess),
            suggestedHint: null,
            timerActive: !gameOver
          });

          return result;
        }
      } catch (err) {
        return null;
      }
      return null;
    },

    undoMove: () => {
      const { chess } = get();
      chess.undo();
      if (get().gameMode === 'ai') {
        chess.undo(); // Undo AI response as well
      }
      set({
        fen: chess.fen(),
        pgn: chess.pgn(),
        turn: chess.turn(),
        history: chess.history({ verbose: true }),
        selectedSquare: null,
        legalMoves: [],
        lastMove: null,
        checkSquare: null,
        isGameOver: false,
        capturedPieces: calculateCapturedPieces(chess),
        suggestedHint: null
      });
    },

    setHint: (hint) => set({ suggestedHint: hint }),
    setEvalScore: (score) => set({ evalScore: score }),
    setClocks: (clocks) => set({ clocks }),
    setTimerActive: (active) => set({ timerActive: active }),
    
    tickTimer: () => {
      const { clocks, turn, isGameOver, timerActive } = get();
      if (isGameOver || !timerActive) return;

      const currentSecs = clocks[turn] || 0;
      if (currentSecs > 0) {
        set({
          clocks: {
            ...clocks,
            [turn]: currentSecs - 1
          }
        });
      } else {
        const winner = turn === 'w' ? 'b' : 'w';
        set({
          isGameOver: true,
          gameOverReason: `Time out! ${winner === 'w' ? 'White' : 'Black'} wins on time!`,
          winner,
          timerActive: false
        });
      }
    }
  };
});
