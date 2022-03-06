import { readdirSync, readFileSync } from "fs";
import { GameManager } from "./business";

const http = require('http');
const express = require('express');
const session = require('express-session');
const obfuscator = require('javascript-obfuscator');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
var gameManager : GameManager = new GameManager(io);

var obfuscated_js = "";
function obfuscate_js() {
	var javascript = "";
	var filenames = readdirSync("./scripts");
	filenames.forEach((file) => {
		javascript += readFileSync(`./scripts/${file}`, {encoding:'utf8', flag:'r'});
		javascript += `\n`;
	});
	var obfuscated = obfuscator.obfuscate(javascript);
	obfuscated_js = obfuscated.getObfuscatedCode();
}

const router = express.Router();
router.route('/js').get((req, res) => {
	res.send(obfuscated_js);
})
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


obfuscate_js();
console.log("Starting worlde server 2.0!");
const port = 8080;
server.listen(port);