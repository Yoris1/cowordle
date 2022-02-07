import { Server, Socket } from "socket.io";
import { uniqueNamesGenerator, animals, colors } from "unique-names-generator";

const shortid = require('shortid');

class Game {
	started : boolean;
	word : string;
	guessLength : number;
	id : string;
	players :Player[] = [];
	 
	host : Player;
	isStarted : boolean = false;
	addPlayer(player: Player) : void {
		if(player.playing) return; // broken : ) 
		this.players.forEach((element) => {
			element.socket.emit('add_player', {
				nick: player.nick,
				you: false,
				id: player.id,
			});
		});
		this.players.push(player);
		player.room = this.id;
		player.playing = true;

		this.players.forEach((element) => {
			player.socket.emit('add_player', {
				nick: element.nick,
				you: element == player,
				id: element.id
			});
		});
		if(!this.host) 
			this.host = player;
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
	}
	start(player: Player) : void {
		if(player == this.host) {
			this.word = "cumms";
			this.isStarted = true;
			this.players.forEach(element => {
         		element.socket.emit('start', { word: this.word });
			});
		}
	}
	constructor() {
		this.started = false;
		this.id = shortid.generate();
		this.guessLength = 5;
	}
};
class Player {
	id : string;
	room: string;
	nick: string;
	socket: Socket;
	playing: boolean = false;
	guesses: string[] = [];
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
	constructor(socket: Server) {
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
	createRoom() : string {
		var room : Game = new Game();
		this.games[room.id] = room;
		return room.id;
	}
}