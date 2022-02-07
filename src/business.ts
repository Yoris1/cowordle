import { readFileSync } from "fs";
import { Server, Socket } from "socket.io";
import { uniqueNamesGenerator, animals, colors } from "unique-names-generator";
import wordsListPath = require("word-list");



const shortid = require('shortid');

class Game {
	word : string;
	guessLength : number;
	id : string;
	players :Player[] = [];
	maxGuesses : number = 6;
	wordlist: {[key: number]: string[]};
	user_wordlist: string[];

	host : Player;
	isStarted : boolean = false;
	rollWord() {
		var wordlist = this.wordlist[this.guessLength];
		this.word = wordlist[Math.floor(Math.random()*wordlist.length)];
	}

	addPlayer(newPlayer: Player) : void {
		if(newPlayer.playing) return; // broken : ) 
		this.players.forEach((element) => {
			element.socket.emit('add_player', {
				nick: newPlayer.nick,
				you: false,
				id: newPlayer.id,
				host: this.host == newPlayer,
			});
		}); // send player to all other players
		

		this.players.push(newPlayer);
		newPlayer.room = this.id;
		newPlayer.playing = true;
		if(!this.host) 
			this.host = newPlayer;

		if(this.isStarted == true)
			newPlayer.socket.emit('start', { word: this.word, wordlist: this.user_wordlist }); // must emit this before sending guesses to not clear board

		this.players.forEach((element) => { // send other players to new players and all the guesses so far
			newPlayer.socket.emit('add_player', {
				nick: element.nick,
				you: element == newPlayer,
				id: element.id,
				host: this.host == element
			});
			for(var i = 0; i < element.guesses.length; i++) {
				newPlayer.socket.emit('guess', {
					text: element.guesses[i],
					id: element.id,
					nick: element.nick,
					guess_id: i,
					correct: this.word
				});
			}

		});
	}
	endRound() {
		console.log("Ending round!! Need to reset state and send all the players the points");
		var playerPoints = [];
		this.players.forEach(player => {
			var latestPoints = this.maxGuesses- (player.guesses.length-1) ;
			latestPoints *= 100;
			console.log(`Adding ${latestPoints} to player ${player.nick}`);
			player.points += latestPoints;
			playerPoints.push({
				points: player.points,
				nick: player.nick,
				id: player.id
			});
		});
		this.players.forEach(player => {
			player.socket.emit('endround', playerPoints);
			player.guesses.length = 0; // reset player guesses
			console.log("Resetting player guesses!");
		});
		this.isStarted = false;
	}
	tryEndRound() {
		var shouldEnd = true;
		this.players.forEach(player => {
			if(player.guesses.length != this.maxGuesses && player.guesses[player.guesses.length-1] != this.word)
				shouldEnd = false;
		})
		if(shouldEnd === true)
			this.endRound(); 
	}
	guess(player: Player, guess: string) : void {
		console.log("need to do validation here to avoid xss!");
		player.guesses.push(guess);

		this.players.forEach(element => {
			element.socket.emit('guess', {
				text: guess.toLowerCase(),
				id: player.id,
				nick: player.nick,
				guess_id: player.guesses.length-1,
				correct: this.word,
			});
		})
		if(player.guesses.length == this.maxGuesses || guess == this.word) {
			this.tryEndRound();
		}
	}
	start(player: Player) : void {
		if(player == this.host && this.isStarted === false) {
			this.rollWord()
			this.isStarted = true;
			this.players.forEach(element => {
				element.socket.emit('start', { word: this.word, wordlist: this.user_wordlist }); 
			});
		}
	}

	constructor(wordlist: {[key: number]: string[]}) {
		this.isStarted = false;
		this.id = shortid.generate();
		this.guessLength = 5;
		this.wordlist = wordlist;
		this.user_wordlist = JSON.parse(JSON.stringify(this.wordlist[this.guessLength]));
		this.user_wordlist.push("yoris");
		this.user_wordlist.push("penis");
		this.user_wordlist.push("sperm");
		this.user_wordlist.push("cunts");
	}
};
class Player {
	id : string;
	room: string;
	nick: string;
	socket: Socket;
	playing: boolean = false;
	guesses: string[] = [];
	points: number = 0;
	setNick(nick: string) :void {
		this.nick = nick;
		if(this.nick === '') {
			this.nick = uniqueNamesGenerator({ dictionaries: [colors, animals], length: 2 });
		}
	}
};

export class GameManager {
	games :{ [key: string]: Game } = {};
	players :{[key: string]: Player} = {};
	wordlists :{[key: number]: string[]} = {};

	constructor(socket: Server) {
		this.createWordlists();
		this.games = {};
		socket.on('connection', (client) => {
			var p = new Player();
			p.id = client.id;
			p.socket = client;
			this.players[p.id] = p;

  			client.on('join', (data) => {
				p.setNick(encodeURIComponent(data.nick));
				if(data.id && this.games[data.id]){
					this.games[data.id].addPlayer(p);
				}
				console.log(data);
			});
			client.on('guess', (data) => {
				this.games[p.room].guess(p, data);
			});
			client.on('start', () => {
				this.games[p.room].start(p);
			})
		});
	}
	createWordlists() {
		const wordArray = readFileSync(wordsListPath, 'utf8').split('\n');
		wordArray.forEach((word) => {
			if (!this.wordlists[word.length]) {
				this.wordlists[word.length] = [];
			}
			this.wordlists[word.length].push(word);
		});
	}
	createRoom() : string {
		var room : Game = new Game(this.wordlists);
		this.games[room.id] = room;
		return room.id;
	}
}