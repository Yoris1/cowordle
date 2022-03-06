var gridManager = new GridManager();
var socket;
function send_guess(guess) {
	socket.emit('guess', guess);
}
function word_doesnt_exist() {
	socket.emit('fullword', true);
}
function word_exists() {
	socket.emit('fullword', false);
}
function send_typing_status(status) {
	socket.emit('typing', status);
}
function createSocket(id) {
	socket = io(window.location.href);
	socket.on('guess', function(data) {
		gridManager.get_grid(data.id).set_guess(data.guess_id, data.text);
	});
	socket.on('connect', function() {
		socket.emit('join', {'id': id, 'nick': userName.getName()});
	});
	socket.on('typing', function(data) {
		gridManager.get_grid(data.player_id).toggle_typing_indicator(data.status);
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
		gridManager.create_grid(player.id, name)
		if(player.points > 0) gridManager.get_grid(player.id).set_points(player.points);
	});
	socket.on('sethost', function(data) {
		$(`<div id='startbtn' class="btn" ${data===true?"hidden":""}>`).text('start').appendTo("#strt");
		$("#startbtn").on('click', function() {
			socket.emit('start');
			$('#startbtn').hide();
		});
	});
	socket.on('start', function(data) {
		console.log(data);
		$('#keyboard').show();
		gridManager.reset_grids();
		gridManager.set_correct_word(data.word);
		gridManager.toggle_opponent_grid_visibility(false);
		resetKeyboard();
		is_started = true;
	});
	socket.on('wordlist', function(data) {
		console.log('wordlist');
		gridManager.set_wordlist(data);
	});
	socket.on('remove_player', function(data) {
		gridManager.remove_grid(data);
	});
	socket.on('endround', data => {
		console.log(data);
		data.points.forEach(player => {
			if(player.id === data.you) player.id = "you";
			gridManager.get_grid(player.id).set_points(player.points);
		});
		is_started = false;
		gridManager.toggle_opponent_grid_visibility(true);
	});

	socket.on('endgame', () => {
		$('#startbtn').text("next");
		$('#startbtn').show();
		console.log("Should show summary of game points now :mwah:");
	});
	socket.on('fullword', (data) => {
		gridManager.get_grid(data.id).toggle_red_outline(data.guess_id, data.correct);
	})

}