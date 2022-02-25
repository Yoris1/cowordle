const rows = ['qwertyuiop', 'asdfghjkl', '>zxcvbnm<']; 
function resetKeyboard() {
	$('.keyboard_key').each(function() {
		$(this).removeClass("keyboard_good keyboard_bad");
	});
} 
function submitWord() {
	if(user_word.length != 5) return;
	if( (!wordlist || !wordlist.includes(user_word))) {
		alert("Word is not in the wordlist!!");
		return;
	}
	socket.emit('guess', user_word);
	guess ++;
	user_word = '';
}
function typeLetter(letter) {
	if(is_started !== true) return;
	user_word += letter.toLowerCase();
	user_word = user_word.slice(0, grids['test'].max)
	set_grid_text('test', guess, user_word);
}

function presskey(letter) {
	if(letter.toLowerCase() == "backspace") {
		user_word = user_word.slice(0, -1);
		set_grid_text('test', guess, user_word); 
	}
	else if(letter.toLowerCase() == "enter")
		submitWord();
	else
		typeLetter(letter);
}

$(document).ready(function() {
	// create virtual keyboard
	rows.forEach(row => {
		var keyboard_row = $('#keyboard').append($(`<div class="keyboard_row">`));
		for(var i = 0; i < row.length; i++) {
			var char = row[i];
			if(char == '<' || char == '>')
				char = char=='<'?'backspace':'enter';
			keyboard_row.append($(`<div class="keyboard_key" id='${char}'>`).text(char));
		}
	});

	// register virtual keyboard keys
	$(".keyboard_key").each( function() {
		console.log($(this).attr("id"));
		$(this).on("click", function () {
			var key = $(this).attr("id");
			presskey(key);
		})
	});

	// register physical keyboard keys
	$(document).on("keydown", "body", function(e) {
		if(e.key.toLowerCase() == 'backspace') presskey(e.key)
	});
	$(document).on("keypress", "body", function(e) {
		presskey(e.key);
	});

});