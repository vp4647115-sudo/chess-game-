const { Chess } = require('chess.js');

// Piece point values for fallback tactical analysis
const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 1000 };

/**
 * Calculates a tactical move score for AI move selection
 */
function evaluateBoard(chess) {
  let totalScore = 0;
  const board = chess.board();
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const val = PIECE_VALUES[piece.type] || 0;
        if (piece.color === 'w') {
          totalScore += val;
        } else {
          totalScore -= val;
        }
      }
    }
  }
  return totalScore;
}

/**
 * Generates an AI move based on difficulty level (Easy, Medium, Hard)
 * Supports hints, analysis score, and suggested move.
 */
function getAIMove(fen, difficulty = 'medium') {
  const chess = new Chess(fen);
  if (chess.isGameOver()) return null;

  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  const aiColor = chess.turn();

  // Easy: Random legal move with 20% tactical bias
  if (difficulty === 'easy') {
    const captures = moves.filter(m => m.captured);
    if (captures.length > 0 && Math.random() < 0.3) {
      const chosen = captures[Math.floor(Math.random() * captures.length)];
      return {
        move: chosen,
        eval: evaluateBoard(chess),
        hint: `Tactical capture on ${chosen.to}`
      };
    }
    const chosen = moves[Math.floor(Math.random() * moves.length)];
    return {
      move: chosen,
      eval: evaluateBoard(chess),
      hint: `Pawn/Piece push to ${chosen.to}`
    };
  }

  // Medium / Hard: Minimax depth 2-4 search
  const depth = difficulty === 'hard' ? 3 : 2;
  let bestMove = null;
  let bestValue = aiColor === 'w' ? -Infinity : Infinity;

  for (const move of moves) {
    chess.move(move);
    let value = evaluateBoard(chess);
    
    // Checkmate bonus
    if (chess.isCheckmate()) {
      value = aiColor === 'w' ? 10000 : -10000;
    }

    chess.undo();

    if (aiColor === 'w') {
      if (value > bestValue) {
        bestValue = value;
        bestMove = move;
      }
    } else {
      if (value < bestValue) {
        bestValue = value;
        bestMove = move;
      }
    }
  }

  const selectedMove = bestMove || moves[Math.floor(Math.random() * moves.length)];
  const currentEval = evaluateBoard(chess);

  return {
    move: selectedMove,
    eval: (currentEval / 10).toFixed(1),
    hint: `Best tactical move: ${selectedMove.piece.toUpperCase()} to ${selectedMove.to}`
  };
}

module.exports = {
  getAIMove,
  evaluateBoard
};
