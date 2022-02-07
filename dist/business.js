"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const unique_names_generator_1 = require("unique-names-generator");
const shortid = require('shortid');
class Game {
    constructor() {
        this.players = [];
        this.isStarted = false;
        this.started = false;
        this.id = shortid.generate();
        this.guessLength = 5;
    }
    addPlayer(player) {
        if (player.playing)
            return; // broken : ) 
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
        if (!this.host)
            this.host = player;
    }
    guess(player, guess) {
        console.log("need to do validation here to avoid xss!");
        player.guesses.push(guess);
        this.players.forEach(element => {
            element.socket.emit('guess', {
                text: guess.toLowerCase(),
                id: player.id,
                nick: player.nick,
                guess_id: player.guesses.length - 1,
                correct: this.word,
            });
        });
    }
    start(player) {
        if (player == this.host) {
            this.word = "cumms";
            this.isStarted = true;
            this.players.forEach(element => {
                element.socket.emit('start', { word: this.word });
            });
        }
    }
}
;
class Player {
    constructor() {
        this.playing = false;
        this.guesses = [];
    }
    setNick(nick) {
        this.nick = nick;
        if (this.nick === '') {
            this.nick = (0, unique_names_generator_1.uniqueNamesGenerator)({ dictionaries: [unique_names_generator_1.colors, unique_names_generator_1.animals], length: 2 });
        }
    }
}
;
class GameManager {
    constructor(socket) {
        this.games = {};
        this.players = {};
        this.games = {};
        socket.on('connection', (client) => {
            var p = new Player();
            p.id = client.id;
            p.socket = client;
            this.players[p.id] = p;
            client.on('join', (data) => {
                p.setNick(encodeURIComponent(data.nick));
                if (data.id && this.games[data.id]) {
                    this.games[data.id].addPlayer(p);
                }
                console.log(data);
            });
            client.on('guess', (data) => {
                this.games[p.room].guess(p, data);
            });
            client.on('start', () => {
                this.games[p.room].start(p);
            });
        });
    }
    createRoom() {
        var room = new Game();
        this.games[room.id] = room;
        return room.id;
    }
}
exports.GameManager = GameManager;
//# sourceMappingURL=business.js.map