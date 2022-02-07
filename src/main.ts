import { GameManager } from "./business";

const http = require('http');
const express = require('express');
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
var gameManager : GameManager = new GameManager(io);


const router = express.Router();
router.route('/room').post((req, res) => {
	if (req.body) {
		console.log(`User ${req.sessionID} requested to create a room!`);
		res.send({id: gameManager.createRoom()});
	  }
});


app.use(express.json());
app.use(express.static('express'));
app.use(express.urlencoded()); // to decode request bodies
app.use(session({
	secret: 'aslkdhjasldf22346347',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false },
}));
app.use(router);


console.log("Starting worlde server 2.0!");
const port = 8080;
server.listen(port);