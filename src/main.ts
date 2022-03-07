var obfuscate = true;

import { readdirSync, readFileSync } from "fs";
import path = require("path");
import { GameManager } from "./business";

const http = require('http');
const express = require('express');
const session = require('express-session');
const obfuscator = require('javascript-obfuscator');
const favicon = require('serve-favicon');

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
router.route('/post_exec_message_miles').post((req, res) => {
	if (req.body && req.body.message && req.body.password && req.body.password==="penis1") {
		gameManager.send_executive_message(req.body.message);
		res.send('200');
	}
});
app.use(function(req, res, next) {
	const regex = new RegExp('^\/scripts.*\.js$');
	if(regex.test(req.path) && obfuscate === true) {
		console.log("file");
		var obfuscated = obfuscator.obfuscate(readFileSync(path.join('express', req.path), 'utf-8'), {compact: true}).getObfuscatedCode();
		res.send(obfuscated);
	} else {
		next();
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
app.use(favicon(path.join(path.resolve(__dirname, '..'), 'express', 'favicon.ico')));

console.log("Starting worlde server 2.0!");
const port = 8080;
server.listen(port);