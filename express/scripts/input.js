const rows = ['qwertyuiop', 'asdfghjkl', '>zxcvbnm<']; 
function resetKeyboard() {
	$('.keyboard_key').each(function() {
		$(this).removeClass("keyboard_good keyboard_bad");
	});
}

function submitWord() {
	if(user_word.length != 5) return;
	if( (!wordlist || !wordlist.includes(user_word))) {
		alert("the word you entered does not exist!");
		return;
	}
	socket.emit('guess', user_word);
	guess ++;
	user_word = '';
}

function verifyWord() {
	if(!wordlist || !wordlist.includes(user_word)) {
		console.log("need to give red outline");
		if(user_word.length < grids['test'].max)
			set_grid_colors('test', guess, "EEEEEEEEEEEEEEE");// the EE means nothing, just want to update grid colors and js sucks ass
		else {
			set_grid_colors('test', guess, "FFFFFFFFFFFFF");
			socket.emit('wrongword');
		}
	} else {
		set_grid_colors('test', guess, "EEEEEEEEEEEEEEE");
	}
}

function presskey(letter) {
	if(is_started !== true) return;
	switch(letter.toLowerCase()) {
		case "backspace":
			gridManager.get_grid("you").backspace();
			break;
		case "enter":
			gridManager.get_grid("you").submit();
			break;
		default:
			gridManager.get_grid("you").type_letter(letter.toLowerCase());
	}
}

$(document).ready(function() {
	// create virtual keyboard
	var r =0;
	rows.forEach(row => {
		$('#keyboard').append($(`<div class="keyboard_row" id="keyboard_row_${++r}">`));
		for(var i = 0; i < row.length; i++) {
			var char = row[i];
			if(char == '<' || char == '>')
				char = char=='<'?'backspace':'enter';
			$(`<div class="keyboard_key" id='${char}'>`).text(char).appendTo($("#keyboard_row_"+r));
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