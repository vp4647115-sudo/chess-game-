const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const { setupSocketHandlers } = require('./socket/gameHandler');
const { getAIMove } = require('./engine/stockfishHandler');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Stockfish AI Move Endpoint
app.post('/api/ai/move', (req, res) => {
  const { fen, difficulty } = req.body;
  if (!fen) {
    return res.status(400).json({ error: 'FEN string is required' });
  }

  try {
    const aiResult = getAIMove(fen, difficulty || 'medium');
    res.json({ success: true, result: aiResult });
  } catch (err) {
    res.status(500).json({ error: 'Failed to evaluate AI move', details: err.message });
  }
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`3D Chess Platform Server running on port ${PORT}`);
});
