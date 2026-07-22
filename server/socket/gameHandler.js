const { Chess } = require('chess.js');

// In-memory active game rooms & matchmaking queue
const activeRooms = new Map();
let matchmakingQueue = [];

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join Random Matchmaking
    socket.on('join_matchmaking', (userData) => {
      const player = {
        socketId: socket.id,
        user: userData || { username: `Guest_${socket.id.substring(0, 4)}`, rating: 1200 }
      };

      // Avoid duplicate queueing
      matchmakingQueue = matchmakingQueue.filter(p => p.socketId !== socket.id);
      matchmakingQueue.push(player);

      socket.emit('matchmaking_status', { queued: true, position: matchmakingQueue.length });

      // Match 2 players when queue has >= 2
      if (matchmakingQueue.length >= 2) {
        const player1 = matchmakingQueue.shift();
        const player2 = matchmakingQueue.shift();
        const roomId = `room_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const chess = new Chess();

        const roomState = {
          id: roomId,
          chess: chess,
          white: player1,
          black: player2,
          spectators: [],
          fen: chess.fen(),
          pgn: chess.pgn(),
          moveHistory: [],
          turn: 'w',
          status: 'playing', // 'playing', 'checkmate', 'draw', 'resigned'
          clocks: {
            w: 600, // 10 mins in seconds
            b: 600
          },
          increment: 0,
          timerInterval: null
        };

        activeRooms.set(roomId, roomState);

        const ioP1 = io.sockets.sockets.get(player1.socketId);
        const ioP2 = io.sockets.sockets.get(player2.socketId);

        if (ioP1) ioP1.join(roomId);
        if (ioP2) ioP2.join(roomId);

        io.to(roomId).emit('game_started', {
          roomId,
          white: player1.user,
          black: player2.user,
          whiteSocketId: player1.socketId,
          blackSocketId: player2.socketId,
          fen: roomState.fen,
          clocks: roomState.clocks
        });

        startClock(io, roomId);
      }
    });

    // Create Private Room
    socket.on('create_room', ({ userData, timeControl = 600, increment = 0 }) => {
      const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const chess = new Chess();

      const roomState = {
        id: roomId,
        chess: chess,
        white: { socketId: socket.id, user: userData },
        black: null,
        spectators: [],
        fen: chess.fen(),
        pgn: chess.pgn(),
        moveHistory: [],
        turn: 'w',
        status: 'waiting',
        clocks: { w: timeControl, b: timeControl },
        increment: increment
      };

      activeRooms.set(roomId, roomState);
      socket.join(roomId);

      const publicRoomState = {
        id: roomState.id,
        white: roomState.white,
        black: roomState.black,
        fen: roomState.fen,
        pgn: roomState.pgn,
        status: roomState.status,
        clocks: roomState.clocks
      };

      socket.emit('room_created', { roomId, roomState: publicRoomState });
    });

    // Join Private Room or Spectate
    socket.on('join_room', ({ roomId, userData, asSpectator = false }) => {
      const room = activeRooms.get(roomId);
      if (!room) {
        socket.emit('error_message', 'Room not found');
        return;
      }

      if (asSpectator || (room.white && room.black)) {
        room.spectators.push({ socketId: socket.id, user: userData });
        socket.join(roomId);
        socket.emit('joined_as_spectator', { roomId, fen: room.fen, clocks: room.clocks });
      } else {
        room.black = { socketId: socket.id, user: userData };
        room.status = 'playing';
        socket.join(roomId);

        io.to(roomId).emit('game_started', {
          roomId,
          white: room.white.user,
          black: room.black.user,
          whiteSocketId: room.white.socketId,
          blackSocketId: room.black.socketId,
          fen: room.fen,
          clocks: room.clocks
        });

        startClock(io, roomId);
      }
    });

    // Handle Chess Move
    socket.on('make_move', ({ roomId, move }) => {
      const room = activeRooms.get(roomId);
      if (!room || room.status !== 'playing') return;

      const chess = room.chess;

      try {
        const result = chess.move(move);
        if (result) {
          room.fen = chess.fen();
          room.pgn = chess.pgn();
          room.turn = chess.turn();
          room.moveHistory.push(result);

          // Apply increment if configured
          if (room.increment > 0) {
            const previousTurn = room.turn === 'w' ? 'b' : 'w';
            room.clocks[previousTurn] += room.increment;
          }

          let gameOverReason = null;
          if (chess.isCheckmate()) {
            room.status = 'checkmate';
            gameOverReason = `Checkmate! ${room.turn === 'w' ? 'Black' : 'White'} wins!`;
            stopClock(room);
          } else if (chess.isDraw()) {
            room.status = 'draw';
            gameOverReason = 'Game ended in a draw!';
            stopClock(room);
          }

          io.to(roomId).emit('move_executed', {
            move: result,
            fen: room.fen,
            turn: room.turn,
            clocks: room.clocks,
            isCheck: chess.inCheck(),
            isCheckmate: chess.isCheckmate(),
            isDraw: chess.isDraw(),
            gameOverReason
          });
        }
      } catch (err) {
        socket.emit('error_message', 'Invalid move');
      }
    });

    // In-game Chat Message
    socket.on('send_chat', ({ roomId, message, sender }) => {
      io.to(roomId).emit('chat_received', {
        id: Date.now(),
        sender,
        message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    });

    // Resign Game
    socket.on('resign_game', ({ roomId, playerColor }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        room.status = 'resigned';
        stopClock(room);
        io.to(roomId).emit('game_over', {
          reason: `${playerColor === 'w' ? 'White' : 'Black'} resigned.`,
          winner: playerColor === 'w' ? 'b' : 'w'
        });
      }
    });

    // Leave Room
    socket.on('leave_room', ({ roomId }) => {
      const room = activeRooms.get(roomId);
      if (room) {
        stopClock(room);
        io.to(roomId).emit('game_over', {
          reason: 'Opponent left the room.',
          winner: socket.id === room.white?.socketId ? 'b' : 'w'
        });
        activeRooms.delete(roomId);
      }
      socket.leave(roomId);
    });

    // Disconnect Handler
    socket.on('disconnect', () => {
      matchmakingQueue = matchmakingQueue.filter(p => p.socketId !== socket.id);
    });
  });
}

function startClock(io, roomId) {
  const room = activeRooms.get(roomId);
  if (!room) return;

  if (room.timerInterval) clearInterval(room.timerInterval);

  room.timerInterval = setInterval(() => {
    if (room.status !== 'playing') {
      clearInterval(room.timerInterval);
      return;
    }

    const turn = room.turn;
    if (room.clocks[turn] > 0) {
      room.clocks[turn]--;
      io.to(roomId).emit('clock_tick', room.clocks);
    } else {
      room.status = 'timeout';
      clearInterval(room.timerInterval);
      io.to(roomId).emit('game_over', {
        reason: `Time out! ${turn === 'w' ? 'Black' : 'White'} wins on time!`,
        winner: turn === 'w' ? 'b' : 'w'
      });
    }
  }, 1000);
}

function stopClock(room) {
  if (room && room.timerInterval) {
    clearInterval(room.timerInterval);
  }
}

module.exports = { setupSocketHandlers };
