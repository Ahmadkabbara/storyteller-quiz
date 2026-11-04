const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;
const QUESTIONS_FILE = path.join(__dirname, 'data', 'questions.json');

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

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/stories', (req, res) => {
  questionBank = loadQuestionBank();
  const list = Object.keys(questionBank).map(key => ({
    key,
    title: questionBank[key].title,
    surah: questionBank[key].surah,
    questionCount: questionBank[key].questions ? questionBank[key].questions.length : 0
  }));
  res.json(list);
});

app.get('/api/qrcode', async (req, res) => {
  const pin = req.query.pin || '';
  const host = req.get('host');
  const protocol = req.protocol === 'https' || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const joinUrl = `${protocol}://${host}/?pin=${pin}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(joinUrl, {
      margin: 2,
      width: 320,
      color: { dark: '#1E1B4B', light: '#FFFFFF' }
    });
    res.json({ qrDataUrl, joinUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

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
      raceDuration: 360, // 6 minutes total race time
      raceStartTime: null,
      raceTimerInterval: null,
      players: new Map()
    };

    rooms.set(pin, room);
    socket.join(pin);

    console.log(`[HOST] Created Race Game PIN: ${pin} | Story: ${story.title}`);
    callback({
      success: true,
      pin,
      storyTitle: story.title,
      surah: story.surah,
      totalQuestions: story.questions.length
    });
  });

  // Host starts the autonomous race!
  socket.on('host:start_game', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;

    room.state = 'RACING';
    room.raceStartTime = Date.now();

    // Prepare questions for players (strip answer keys)
    const sanitizedQuestions = room.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));

    // Notify Host to show the live Map
    io.to(room.hostSocketId).emit('race:started', {
      totalQuestions: room.questions.length,
      duration: room.raceDuration
    });

    // Notify each player with all questions so their phone can navigate smoothly
    room.players.forEach((player, socketId) => {
      io.to(socketId).emit('player:race_started', {
        totalQuestions: room.questions.length,
        questions: sanitizedQuestions
      });
    });

    // Automatic Race Countdown Timer
    let timeLeft = room.raceDuration;
    if (room.raceTimerInterval) clearInterval(room.raceTimerInterval);

    room.raceTimerInterval = setInterval(() => {
      timeLeft--;
      io.to(room.pin).emit('race:timer_tick', { timeLeft });

      if (timeLeft <= 0) {
        clearInterval(room.raceTimerInterval);
        endRace(room);
      }
    }, 1000);
  });

  socket.on('host:end_game', ({ pin }) => {
    const room = rooms.get(pin);
    if (!room || room.hostSocketId !== socket.id) return;
    endRace(room);
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

    const cleanName = (name || 'Hero').trim().substring(0, 18);
    const player = {
      id: socket.id,
      name: cleanName,
      avatar: avatar || 'fez_lion',
      score: 0,
      streak: 0,
      correctCount: 0,
      currentQIndex: 0,
      progress: 0, // 0 to 100%
      finished: false,
      finishTime: null
    };

    room.players.set(socket.id, player);
    socket.join(pin);
    socket.data.pin = pin;

    // Notify Host of new player
    io.to(room.hostSocketId).emit('host:player_joined', {
      playerCount: room.players.size,
      player: {
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        score: player.score,
        progress: 0
      }
    });

    callback({
      success: true,
      player: { name: player.name, avatar: player.avatar },
      storyTitle: room.storyTitle
    });
  });

  // Player answers a question in their self-paced race
  socket.on('player:answer_question', ({ questionIndex, optionIndex, timeSpent }, callback) => {
    const pin = socket.data.pin;
    const room = rooms.get(pin);
    if (!room || room.state !== 'RACING') return;

    const player = room.players.get(socket.id);
    if (!player || player.finished) return;

    const totalQ = room.questions.length;
    const q = room.questions[questionIndex];
    if (!q) return;

    const isCorrect = optionIndex === q.answer;
    let points = 0;

    if (isCorrect) {
      player.correctCount++;
      player.streak++;
      const timeBonus = Math.max(0, Math.round(500 * (1 - (timeSpent / 25))));
      const streakBonus = Math.min(player.streak * 50, 250);
      points = 500 + timeBonus + streakBonus;
      player.score += points;
    } else {
      player.streak = 0;
    }

    // Calculate progress on the map (0% to 100%)
    player.progress = Math.min(100, Math.round((player.correctCount / totalQ) * 100));
    player.currentQIndex = questionIndex + 1;

    const isFinished = player.currentQIndex >= totalQ || player.progress >= 100;
    if (isFinished && !player.finished) {
      player.finished = true;
      player.finishTime = Date.now();
    }

    // Broadcast live map movement to Host Screen!
    io.to(room.hostSocketId).emit('race:player_progress', {
      playerId: player.id,
      name: player.name,
      avatar: player.avatar,
      correctCount: player.correctCount,
      progress: player.progress,
      score: player.score,
      streak: player.streak,
      isFinished: player.finished
    });

    // Send answer result back to player
    if (callback) {
      callback({
        isCorrect,
        correctAnswer: q.answer,
        pointsEarned: points,
        totalScore: player.score,
        streak: player.streak,
        progress: player.progress,
        isFinished
      });
    }

    // Check if top players all reached trophy
    let finishedCount = 0;
    room.players.forEach(p => { if (p.finished) finishedCount++; });
    if (finishedCount >= room.players.size && room.players.size > 0) {
      endRace(room);
    }
  });

  socket.on('disconnect', () => {
    const pin = socket.data.pin;
    if (pin && rooms.has(pin)) {
      const room = rooms.get(pin);
      if (room.hostSocketId === socket.id) {
        io.to(pin).emit('game:host_disconnected');
        rooms.delete(pin);
      } else {
        const p = room.players.get(socket.id);
        room.players.delete(socket.id);
        if (p) {
          io.to(room.hostSocketId).emit('host:player_left', {
            playerId: socket.id,
            playerCount: room.players.size
          });
        }
      }
    }
  });
});

function endRace(room) {
  if (room.raceTimerInterval) clearInterval(room.raceTimerInterval);
  room.state = 'PODIUM';

  const sorted = Array.from(room.players.values()).sort((a, b) => {
    if (b.progress !== a.progress) return b.progress - a.progress;
    return b.score - a.score;
  });

  const podium = sorted.slice(0, 3).map((p, idx) => ({
    rank: idx + 1,
    name: p.name,
    avatar: p.avatar,
    score: p.score,
    progress: p.progress
  }));

  io.to(room.pin).emit('race:finished', {
    podium,
    totalPlayers: room.players.size
  });
}

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏆 The Storyteller Adventure Race Server Running!`);
  console.log(`👉 Host Map Screen: http://localhost:${PORT}/host.html`);
  console.log(`📱 Player Mobile:   http://localhost:${PORT}/`);
  console.log(`=======================================================`);
});
