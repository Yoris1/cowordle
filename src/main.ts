require('dotenv').config()

import { readFileSync } from "fs";
import path = require("path");
import { GameManager } from "./business";
import { StatsTracker } from "./stats_tracker";

const https = require('https');
const express = require('express');
const obfuscator = require('javascript-obfuscator');
const favicon = require('serve-favicon');

var https_credentials = {};
try {
	https_credentials['key']= readFileSync('./certificates/privkey.pem')
	https_credentials['cert']= readFileSync('./certificates/fullchain.pem')
	https_credentials['ca']= readFileSync('./certificates/chain.pem') // ocsp stapling
} catch(err) {
	console.warn(err);
}

const app = express();
const server = https.createServer(https_credentials, app);
const io = require('socket.io')(server);
var stats: StatsTracker = new StatsTracker();
var gameManager : GameManager = new GameManager(io, stats);

const router = express.Router();
router.route('/room').post((req, res) => {
	if (req.body) {
		console.log(`${req.ip} requested to create a room!`);
		res.send({id: gameManager.createRoom()});
	  }
});
router.route('/stats').get((req, res) => {
	res.send({
		uptime: stats.get_uptime(),
		visitors: stats.get_count("visit"),
		restarts: stats.get_count("restarts"),
		wordles_played: stats.get_count("wordles_played"),
		rooms_created: stats.get_count("rooms_created"),
	})
})
router.route('/post_exec_message_miles').post((req, res) => {
	if (req.body && req.body.message && req.body.password && req.body.password===process.env.EXECUTIVE_MESSAGE_PASSWORD) {
		gameManager.send_executive_message(req.body.message);
		res.send('200');
	}
});
app.use(function(req, res, next) {
	const regex = new RegExp('^\/scripts.*\.js$');
	if(regex.test(req.path) && process.env.OBFUSCATE_JS === 'true') {
		console.log("file");
		var obfuscated = obfuscator.obfuscate(readFileSync(path.join('express', req.path), 'utf-8'), {compact: false, log: false, disableConsoleOutput: true, controlFlowFlattening: true}).getObfuscatedCode();
		res.set('Content-Type', 'text/javascript');
		res.send(obfuscated);
	} else {
		next();
	}
});
app.use(function(req, res, next) {
	if(req.path == '/') {
		stats.visit();
	}
	next();
});

app.use(express.json());
app.use(express.static('express'));
app.use(express.urlencoded()); // to decode request bodies
app.use(router);
app.use(favicon(path.join(path.resolve(__dirname, '..'), 'express', 'favicon.ico')));

console.log("Starting worlde server 2.0!");
const port = 8080;
server.listen(port);


const http = require('http');
http.createServer(function(req, res) {
	console.log("Redirecting user to https site!");
	res.writeHead(301, {"Location": `https://${process.env.DOMAIN}/`});
	res.end();
} ).listen(8081);