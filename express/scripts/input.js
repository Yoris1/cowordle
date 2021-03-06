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
	if(is_started !== true)  {
		if(letter == "Backspace")
			userName.backspace();
		else
			userName.type(letter);

		return;
	}
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
	typingCheck.received_input();
}
class TypingCheck {
	received_input() {
		this.typed = true;
		this.force_update();
	}
	_update_typing_status() {
		if(this.typed) {
			if(!this._istyping) {
				send_typing_status(true);
				console.log("sending typing start to server");
			}
			this._istyping = true;
		} else {
			if(this._istyping) {
				console.log("sending typing end to server");
				send_typing_status(false);
				this._istyping = false;
			}
		}
		this.typed = false;
	}
	force_update() {
		this._update_typing_status();
		if(this.interval)
			clearInterval(this.interval);
		this.interval = setInterval(() => {
			this._update_typing_status();	
		}, 5000);

	}
	constructor() {
		this.typed = false;
		this._istyping = false;
		this.force_update();
	}
}
const typingCheck = new TypingCheck(); 

function createSvgTag(tag) {
	return document.createElementNS("http://www.w3.org/2000/svg", tag);
}
function drawBackspace(width, height) {
	var svg = $(createSvgTag("svg"));
	svg.addClass("backspace_svg");
	svg.attr("width", width);
	svg.attr("height", height);
	var path = $(createSvgTag("path"));
	path.attr("d", `M 0 ${height*0.5} L ${width*0.3} 0 H ${width} V ${height} L ${width*0.3} ${height} Z` +  // outline
	` M ${width*0.45} ${height*0.2} L ${width*0.75} ${height*0.8} M ${width*0.45} ${height*0.8} L ${width*0.75} ${height*0.2}` //X
	);
	path.appendTo(svg);
	return svg;
}
$(document).ready(function() {
	// create virtual keyboard
	var r =0;
	rows.forEach(row => {
		$('#keyboard').append($(`<div class="keyboard_row" id="keyboard_row_${++r}">`));
		for(var i = 0; i < row.length; i++) {
			var char = row[i];
			var id = char;
			if(char == '<' || char == '>') {
				id = char=='<'?'backspace':'enter';
				char = char=='<'?'':'enter';
			}
			var key = $(`<div class="keyboard_key unselectable" id='${id}'>`);
			key.text(char).appendTo($("#keyboard_row_"+r));
			if(char == '') {
				drawBackspace(32.5, 19.375).appendTo(key);
			}
		}
	});

	// register virtual keyboard keys
	$(".keyboard_key").each( function() {
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