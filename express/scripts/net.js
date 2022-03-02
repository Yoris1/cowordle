var socket;
function createSocket(id) {
	socket = io(window.location.href);
	socket.on('connect', function(data) {
		socket.emit('join', {'id': id, 'nick': $('#nick').val()});
	});
	socket.on('guess', function(data) {
		console.log(`${data.nick} (${data.id}) guessed ${data.text} with guess id ${data.guess_id}. correct: ${data.correct}`);
		//set_grid_text(data.id, data.guess_id, data.text);
		if(data.id == my_id)
			set_grid_colors('test', data.guess_id, compare(data.text, data.correct, true));
		else
			set_grid_colors(data.id, data.guess_id, compare(data.text, data.correct, false));
	})
	socket.on('wrongword', function(data) {
		set_grid_colors(data.id, data.guess_id, "FFFFFFFFFFFF");
		setTimeout(() => {
			set_grid_colors(data.id, data.guess_id, "EEEEEEEEEEEEEEE");
		}, 1000);
	})
	socket.on('add_player', function(player) {
		var name = player.nick;
		console.log(`Adding player ${name}`);
		if(player.you == true) {
			name += " (you)"
			my_id = player.id;
			if(player.host == false) {
				$('#startbtn').remove();
			} else {
				if(!is_started) $('#startbtn').show();
			}
		}
		else
			create_grid(player.id, 5, player.nick);
		$(`<p id="${player.id}-playerlist">`).appendTo(`#playerlist`);
		$(`<span id="${player.id}-playerlist-name">`).text(name+" ").appendTo(`#${player.id}-playerlist`);
		var id = player.id;
		if(player.you === true)
			id = 'test';
		var points = "";
		if(+player.points>0)
			points = player.points
		$(`<p id="${player.id}-playerlist-points" class="playerpoints">`).text(points).appendTo(`#${id}`);
		console.log("Appplying to "+id);
	});
	socket.on('start', function(data) {
		$('#keyboard').show();
		console.log(data);
		console.log(wordlist);
		console.log("STARTING!!");
		is_started = true;
		guess = 0;
		resetGrids();
		resetKeyboard();
	})
	socket.on('wordlist', function(data) {
		console.log("Got wordlist!!");
		wordlist = data;
		test_grid.set_wordlist(data);
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