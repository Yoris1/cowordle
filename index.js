const http = require('http');
const express = require('express');
const session = require('express-session');
const shortid = require('shortid');

const games = {};

const { uniqueNamesGenerator, animals, colors } = require('unique-names-generator');

const app = express();
app.use(express.json());
app.use(express.static('express'));
app.use(express.urlencoded()); // to decode request bodies

app.use(session({
  secret: 'aslkdhjasldf22346347',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

const router = express.Router();

router.route('/room').post((req, res) => {
  if (req.body) {
    let roomid;
    if (req.body.join === 'true' && req.body.roomid) {
      roomid = req.body.roomid;
      console.log(`User ${req.sessionID} requested to join a room ${roomid}!`);
      if (!games[roomid]) {
        games[roomid] = {};
        games[roomid].started = false;
      }
    } else {
      console.log(`User ${req.sessionID} requested to create a room!`);
      roomid = shortid.generate();
      console.log(`Created a room for user ${req.sessionID}. Room id: ${roomid}`);
      games[roomid] = {};
      games[roomid].started = false;
    }
    games[roomid].guess_length = 5;
    if (req.body.word_len) {
      games[roomid].guess_length = +req.body.word_len;
    }
    res.send({ id: roomid });
  }
});

app.use(router);

const server = http.createServer(app);
const port = 8080;

const fs = require('fs');
const wordListPath = require('word-list');

const wordLists = {};
function createWordlists() {
  const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
  wordArray.forEach((word) => {
    if (!wordLists[word.length]) {
      wordLists[word.length] = [];
    }
    wordLists[word.length].push(word);
  });
}
createWordlists();
function getRandomWord(len) {
  return wordLists[len][Math.floor(Math.random() * wordLists[len].length)];
}

const allowedGuessLetters = /^[\u0041-\u005a]*$/;
// ascii A-Z caps letters.

const io = require('socket.io').listen(server);

io.on('connection', (client) => {
  console.log('client connected to socketio');
  client.on('join', (data) => {
    client.guesses = 0;
    if (data && data.id && games[data.id]) {
      const gameId = data.id;
      const game = games[gameId];
      if (!game.host) game.host = client.id;
      if (!game.players) game.players = [];
      client.room = gameId;
      game.players.push(client);

      if (data.nick) {
        client.nick = encodeURIComponent(data.nick);
      } else {
        // give user random nick.
        client.nick = uniqueNamesGenerator({ dictionaries: [colors, animals], length: 2 });
      }
      games[gameId].players.forEach((player) => {
        const p = {};
        p.nick = player.nick;
        p.you = player === client;
        p.id = player.id;
        client.emit('add_player', p);
      });

      games[gameId].players.forEach((player) => {
        if (player === client) return;
        const p = {};
        p.nick = client.nick;
        p.you = false;
        p.id = client.id;
        player.emit('add_player', p);
      });
    }
  });

  client.on('guess', (guess) => {
    if (!guess) return;
    if (guess.length !== games[client.room].guess_length) return;
    guess = guess.toUpperCase();
    if (!allowedGuessLetters.test(guess)) return;
    if (games[client.room].started === false) return;

    console.log(`Player ${client.id} from room ${client.room} submitted a guess ${guess}`);
    games[client.room].players.forEach((playerSocket) => {
      playerSocket.emit('guess', {
        text: guess.toLowerCase(),
        id: client.id,
        nick: client.nick,
        guess_id: client.guesses,
        correct: games[client.room].word,
      });
    });

    client.guesses += 1;
  });

  client.on('start', () => {
    if (client.room && games[client.room] && games[client.room].host && client.id) {
      const game = games[client.room];
      if (game.host === client.id && game.started === false) {
        console.log(`Game ${client.room} started!`);
        game.started = true;
        game.word = getRandomWord(game.guess_length).toUpperCase();

        game.players.forEach((player) => {
          player.emit('start', { word: game.word });
        });
      }
    }
  });
});

server.listen(port);
console.log(`Server started on port ${port}`);
