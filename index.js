const http = require('http');
const express = require('express');
const path = require('path');
const session = require('express-session');
const shortid = require('shortid');
games = {};

const { uniqueNamesGenerator, adjectives, animals, colors } = require('unique-names-generator');
 


const app = express();
app.use(express.json());
app.use(express.static("express"));
app.use(express.urlencoded()); // to decode request bodies

app.use(session ({
	secret: 'aslkdhjasldf22346347',
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false}
}));

var router = express.Router();

router.route('/room')
	.post(function(req, res) {
		if(req.body) {
			var roomid;
			if(req.body.join == 'true' && req.body.roomid) {
				roomid = req.body.roomid;
				console.log(`User ${req.sessionID} requested to join a room ${roomid}!`);
			}
			else {
				console.log(`User ${req.sessionID} requested to create a room!`);
				roomid = shortid.generate();
				console.log(`Created a room for user ${req.sessionID}. Room id: ${roomid}`);
				games[roomid] = {};
				games[roomid].started = false;
			}
			games[roomid].guess_length = 5;
			if(req.body.word_len) {
				games[roomid].guess_length = +req.body.word_len;
			}
			res.send({id: roomid});

		}
	});

app.use(router);

const server = http.createServer(app);
const port = 8080;



const fs = require('fs');
const wordListPath = require('word-list');
var word_lists = {};
function create_wordlists() {
	var wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
	wordArray.forEach(word => {
		if(!word_lists[word.length]) {
			word_lists[word.length] = [];
		}
		word_lists[word.length].push(word);
	});
}
create_wordlists();

function get_random_word(len) {
	return word_lists[len][Math.floor( Math.random() * word_lists[len].length )];
}
function compare_guess(guess, word) {
	var res = "";
	for(var i = 0; i < guess.length; i++) {
		if(guess[i] == word[i]) {
			res += "Y";
		} else if (word.includes(guess[i])) {
			res += "M";
		} else {
			res += "N";
		}
	}
	return res;
}
const allowed_guess_letters = /^[\u0041-\u005a]*$/; 
// ascii A-Z caps letters.

var io = require('socket.io').listen(server);
io.on('connection', client => {
	console.log("client connected to socketio");
	client.on('join', function(data) {
		if(data && data.id && games[data.id]) {
			var game_id = data.id;
			var game = games[game_id];
			if(!game.host) {
				game.host = client.id;
			}
			if(!game.players) {
				game.players = [];
			}
			client.room = game_id;
			game.players.push(client);

			if(data.nick) {
				client.nick = encodeURIComponent(data.nick);
			} else {
				// give user random nick.
				client.nick =  uniqueNamesGenerator({ dictionaries: [colors, animals], length: 2 });
			}
			games[game_id].players.forEach(player => {
				var p = {};
				p.nick = player.nick;
				p.you = player == client;
				p.id = player.id; 
				client.emit('add_player', p);
			});

			games[game_id].players.forEach(player => {
				if(player == client) return;
				var p = {};
				p.nick = client.nick;
				p.you = false;
				p.id = client.id; 
				player.emit('add_player', p);
			});
		

		}
	});

	client.on('guess', function(guess) {
		if(!guess) return;
		if(guess.length != games[client.room].guess_length) return;
		guess = guess.toUpperCase();
		if(!allowed_guess_letters.test(guess))
			return;
		if(games[client.room].started == false) return;

		guess = compare_guess(guess, games[client.room].word);
		console.log(`Player ${client.id} from room ${client.room} submitted a guess ${guess}`);
		games[client.room].players.forEach(player_socket => {
			player_socket.emit('guess', {'text': guess, 'playerid': client.nick}); // process guess to be emoji or Yes NO YES YES MAYBE NO type thing to not let others decode it easily
		});
	});
	client.on('start', function() {
		if(client.room && games[client.room] && games[client.room].host && client.id) {
			var game = games[client.room];
			if(game.host == client.id && game.started == false) {
				console.log(`Game ${client.room} started!`);
				game.started = true;
				game.word = get_random_word(game.guess_length).toUpperCase();
			}
		}
	});
});


server.listen(port)
console.log(`Server started on port ${port}`);