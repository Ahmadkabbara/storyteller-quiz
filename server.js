const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 3000;
const QUESTIONS_FILE = path.join(__dirname, 'data', 'questions.json');

// Helper to load questions
function loadQuestionBank() {
  try {
    const raw = fs.readFileSync(QUESTIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading questions file:', err);
    return {};
  }
}

let questionBank = loadQuestionBank();

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API: Get list of stories
app.get('/api/stories', (req, res) => {
  questionBank = loadQuestionBank(); // reload in case updated
  const list = Object.keys(questionBank).map(key => ({
    key,
    title: questionBank[key].title,
    surah: questionBank[key].surah,
    questionCount: questionBank[key].questions ? questionBank[key].questions.length : 0
  }));
  res.json(list);
});

// API: Dynamic QR Code generator for quick phone scanning
app.get('/api/qrcode', async (req, res) => {
  const pin = req.query.pin || '';
  const host = req.get('host');
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const joinUrl = `${protocol}://${host}/?pin=${pin}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(joinUrl, {
      margin: 2,
      width: 320,
      color: {
        dark: '#1E1B4B',
        light: '#FFFFFF'
      }
    });
    res.json({ qrDataUrl, joinUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Real-time Games State
// Key: pin string -> Room Object
const rooms = new Map();

function generatePin() {
  let pin;
  do {
    pin = Math.floor(100000 + Math.random() * 900000).toString();
  } while (rooms.has(pin));
  return pin;
}

io.on('connection', (socket) => {
  // ================= HOST EVENTS =================
  socket.on('host:create_game', ({ storyKey }, callback) => {
    questionBank = loadQuestionBank();
    const story = questionBank[storyKey] || Object.values(questionBank)[0];

    if (!story || !story.questions || story.questions.length === 0) {
      return callback({ success: false, error: 'No questions found for this story.' });
    }

    const pin = generatePin();
    const room = {
      pin,
      hostSocketId: socket.id,
      storyKey,
      storyTitle: story.title,
      surah: story.surah,
      questions: story.questions,
      state: 'LOBBY',
      currentQuestionIndex: -1,
      questionStartTime: null,
      questionDuration: 20,
      players: new Map(), // socketId -> player object
      timerInterval: null
    };

    rooms.set(pin, room);
    socket.join(pin);

    console.log(`[HOST] Created game PIN: ${pin} | Story: ${story.title}`);
    callback({ success: true, pin, storyTitle: story.title, surah: story.surah, totalQuestions: story.questions.length });
  });

  socket.on('host:start_game', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    room.currentQuestionIndex = 0;
    sendQuestion(room);
  });

  socket.on('host:next_question', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    room.currentQuestionIndex += 1;
    if (room.currentQuestionIndex < room.questions.length) {
      sendQuestion(room);
    } else {
      endGame(room);
    }
  });

  socket.on('host:reveal_answer', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    revealAnswer(room);
  });

  socket.on('host:show_leaderboard', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    room.state = 'LEADERBOARD';
    const topPlayers = getLeaderboard(room);

    io.to(pin).emit('game:leaderboard', {
      topPlayers,
      isLastQuestion: room.currentQuestionIndex >= room.questions.length - 1
    });
  });

  socket.on('host:end_game', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    endGame(room);
  });

  // ================= PLAYER EVENTS =================
  socket.on('player:join', ({ pin, name, avatar }, callback) => {
    const room = rooms.get(pin);
    if (!room) {
      return callback({ success: false, error: 'Game PIN not found. Please check the screen!' });
    }
    if (room.state !== 'LOBBY') {
      return callback({ success: false, error: 'Game has already started!' });
    }

    const cleanName = (name || 'LittleHero').trim().substring(0, 16);
    const player = {
      id: socket.id,
      name: cleanName,
      avatar: avatar || 'fez_lion',
      score: 0,
      streak: 0,
      lastAnswer: null,
      answerTime: null,
      pointsEarned: 0,
      isCorrect: false
    };

    room.players.set(socket.id, player);
    socket.join(pin);
    socket.data.pin = pin;

    console.log(`[PLAYER] Joined ${cleanName} (${avatar}) -> PIN ${pin}`);

    // Notify Host
    io.to(room.hostSocketId).emit('host:player_joined', {
      playerCount: room.players.size,
      player: { id: player.id, name: player.name, avatar: player.avatar }
    });

    callback({
      success: true,
      player: { name: player.name, avatar: player.avatar, score: 0 },
      storyTitle: room.storyTitle
    });
  });

  socket.on('player:submit_answer', ({ optionIndex }) => {
    const pin = socket.data.pin;
    const room = rooms.get(pin);
    if (!room || room.state !== 'QUESTION') return;

    const player = room.players.get(socket.id);
    if (!player || player.lastAnswer !== null) return; // already answered

    const now = Date.now();
    const elapsedSeconds = Math.max(0, (now - room.questionStartTime) / 1000);
    const duration = room.questionDuration || 20;
    const currentQ = room.questions[room.currentQuestionIndex];

    player.lastAnswer = optionIndex;
    player.answerTime = elapsedSeconds;

    const isCorrect = optionIndex === currentQ.answer;
    player.isCorrect = isCorrect;

    if (isCorrect) {
      // Kahoot-style scoring: 1000 base points reduced by response time (min 500) + streak bonus
      const timeFactor = Math.max(0, 1 - (elapsedSeconds / (duration * 2)));
      const basePoints = Math.round(1000 * timeFactor);
      player.streak += 1;
      const streakBonus = Math.min(player.streak * 50, 250);
      player.pointsEarned = basePoints + streakBonus;
      player.score += player.pointsEarned;
    } else {
      player.streak = 0;
      player.pointsEarned = 0;
    }

    // Notify Host of an answer submission count
    let answeredCount = 0;
    room.players.forEach(p => { if (p.lastAnswer !== null) answeredCount++; });

    io.to(room.hostSocketId).emit('host:answer_received', {
      answeredCount,
      totalPlayers: room.players.size
    });

    // Acknowledge player
    socket.emit('player:answer_acknowledged', { optionIndex });

    // If all players have answered, auto-reveal!
    if (answeredCount >= room.players.size && room.players.size > 0) {
      revealAnswer(room);
    }
  });

  // ================= DISCONNECT =================
  socket.on('disconnect', () => {
    const pin = socket.data.pin;
    if (pin && rooms.has(pin)) {
      const room = rooms.get(pin);
      if (room.hostSocketId === socket.id) {
        console.log(`[HOST] Host disconnected from room ${pin}`);
        io.to(pin).emit('game:host_disconnected');
        rooms.delete(pin);
      } else {
        const p = room.players.get(socket.id);
        room.players.delete(socket.id);
        if (p) {
          console.log(`[PLAYER] ${p.name} disconnected`);
          io.to(room.hostSocketId).emit('host:player_left', {
            playerId: socket.id,
            playerCount: room.players.size
          });
        }
      }
    }
  });
});

// Helper: Send Question
function sendQuestion(room) {
  if (room.timerInterval) clearInterval(room.timerInterval);

  room.state = 'QUESTION';
  const q = room.questions[room.currentQuestionIndex];
  room.questionDuration = q.time || 20;
  room.questionStartTime = Date.now();

  // Reset player answers for this question
  room.players.forEach(p => {
    p.lastAnswer = null;
    p.answerTime = null;
    p.isCorrect = false;
    p.pointsEarned = 0;
  });

  // To Host: Send full question with options and correct answer
  io.to(room.hostSocketId).emit('game:new_question', {
    index: room.currentQuestionIndex,
    total: room.questions.length,
    question: q.question,
    options: q.options,
    time: room.questionDuration,
    answer: q.answer
  });

  // To Players: Send question with options (without revealing answer)
  room.players.forEach((player, socketId) => {
    io.to(socketId).emit('player:new_question', {
      index: room.currentQuestionIndex,
      total: room.questions.length,
      question: q.question,
      options: q.options,
      time: room.questionDuration
    });
  });

  // Auto-reveal after time runs out + 1s buffer
  let timeLeft = room.questionDuration;
  room.timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(room.timerInterval);
      if (room.state === 'QUESTION') {
        revealAnswer(room);
      }
    }
  }, 1000);
}

// Helper: Reveal Answer
function revealAnswer(room) {
  if (room.timerInterval) clearInterval(room.timerInterval);
  if (room.state === 'REVEAL') return; // already revealed

  room.state = 'REVEAL';
  const currentQ = room.questions[room.currentQuestionIndex];

  // Calculate statistics: how many picked option 0, 1, 2, 3
  const counts = [0, 0, 0, 0];
  room.players.forEach(p => {
    if (p.lastAnswer !== null && p.lastAnswer >= 0 && p.lastAnswer < 4) {
      counts[p.lastAnswer]++;
    }
  });

  // Notify Host
  io.to(room.hostSocketId).emit('game:answer_revealed', {
    correctAnswer: currentQ.answer,
    counts,
    totalAnswered: counts.reduce((a, b) => a + b, 0)
  });

  // Notify each Player of their personal result
  room.players.forEach((player, socketId) => {
    io.to(socketId).emit('player:answer_result', {
      correctAnswer: currentQ.answer,
      yourAnswer: player.lastAnswer,
      isCorrect: player.isCorrect,
      pointsEarned: player.pointsEarned,
      totalScore: player.score,
      streak: player.streak
    });
  });
}

// Helper: Leaderboard
function getLeaderboard(room) {
  const sorted = Array.from(room.players.values()).sort((a, b) => b.score - a.score);
  return sorted.slice(0, 5).map((p, idx) => ({
    rank: idx + 1,
    name: p.name,
    avatar: p.avatar,
    score: p.score,
    streak: p.streak
  }));
}

// Helper: End Game Podium
function endGame(room) {
  if (room.timerInterval) clearInterval(room.timerInterval);
  room.state = 'PODIUM';

  const sorted = Array.from(room.players.values()).sort((a, b) => b.score - a.score);
  const podium = sorted.slice(0, 3).map((p, idx) => ({
    rank: idx + 1,
    name: p.name,
    avatar: p.avatar,
    score: p.score
  }));

  io.to(room.pin).emit('game:finished', {
    podium,
    totalPlayers: room.players.size
  });
}

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏆 The Storyteller Quiz Night Server Running!`);
  console.log(`👉 Host Projector Screen: http://localhost:${PORT}/host.html`);
  console.log(`📱 Player Mobile Screen:  http://localhost:${PORT}/`);
  console.log(`=======================================================`);
});
