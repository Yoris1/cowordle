var grids = {};

var socket;
function createSocket(id) {
	socket = io(window.location.href);
	socket.on('connect', function() {
		socket.emit('join', {'id': id, 'nick': $('#nick').val()});
	});

	socket.on('add_player', function(player) {
		var name = player.nick;
		console.log(`Adding player ${name}`);
		
		if(player.you == true) {
			name += " (you)"
			player.id = "you";
			if(player.host == false) {
				$('#startbtn').remove();
			} else {
				if(!is_started) $('#startbtn').show();
			}
		}
		grids[player.id] = new Grid(5, 6);
		grids[player.id].set_name(name);
	});

	socket.on('start', function(data) {
		$('#keyboard').show();
		console.log(data);
		Object.values(grids).forEach(grid => {
			grid.set_correct_word(data.word)
		})
		is_started = true;
		guess = 0;
		Object.values(grids).forEach(grid => {
			grid.reset();
		})
		resetKeyboard();
	});

	socket.on('wordlist', function(data) {
		console.log('wordlist');
		Object.values(grids).forEach(grid => {
			grid.set_wordlist(data);
		})
	});

	socket.on('endround', points => {
		console.log(points);
		points.forEach(element => {
			$(`#${element.id}-playerlist-points`).text("points: " + element.points);
		});
		is_started = false;
		console.log("Should reveal guesses of both players. and display a 5. 4. 3. 2. 1. timer on screen");
	});

	socket.on('endgame', () => {
		$('#startbtn').text("next");
		$('#startbtn').show();
		console.log("Should show summary of game points now :mwah:");
	});

}