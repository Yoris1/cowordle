class Grid {
	update() {
		if(this.guesses[this.current_line].length === this.width)
			this.red_grid_outline();
	}
	red_grid_outline() {
		var value = !this.is_guess_valid();
		this.matrix[this.current_line].forEach(element => {
			if(value===true)
				element.addClass("grid_notreal");
			else {
				element.removeClass("grid_notreal");
			}
		});
	}
	set_colors(row, colors) {
		for(var i = 0; i < colors.length; i++) {
			this.matrix[row][i].addClass("grid_"+colors[i]);
		}
	}
	_reset_row(row) {
		this.matrix[row].forEach(element => {
			element.removeClass("grid_good grid_bad grid_mid grid_notreal");
			element.text('');
		});
	}
	reset() {
		for(var i = 0; i < this.matrix.length; i++)
			this._reset_row(i);
	}
	set_text(text, row) {
		var i = 0;
		for(; i < text.length; i++)
			this.matrix[row][i].text(text[i]);
		for(; i < this.width; i++)
			this.matrix[row][i].text('');
	}
	set_name(name) {
		this.name.text(name);
	}
	set_points(points) {
		this.points.text("points: "+points);
	}
	type_letter(letter) {
		this.guesses[this.current_line] += letter;
		this.guesses[this.current_line] = this.guesses[this.current_line].substring(0, this.width);
		this.set_text(this.guesses[this.current_line], this.current_line);
		this.update();
	}
	backspace() {
		this.guesses[this.current_line] = this.guesses[this.current_line].slice(0, -1);
		this.set_text(this.guesses[this.current_line], this.current_line);
		this.update();
	}
	toggle_text() {
		this.show_text = !this.show_text;
		for(var i = 0; i < this.guesses.length; i++) {
			this.set_text(this.show_text?this.guesses[i]:"", i);
		}
	}
	submit() {
		if(this.is_guess_valid() && this.correct_word) {
			var guess = this.guesses[this.current_line];
			this.set_colors(this.current_line, compare(guess, this.correct_word, false));
			this.current_line++;
		}
	}
	set_wordlist(wordlist) {
		this.wordlist = wordlist;
	}
	set_correct_word(word) {
		this.correct_word = word;
	}
	is_guess_valid() {
		var word = this.guesses[this.current_line];
		if(word.length == this.width) {
			if(!this.wordlist || !this.wordlist.includes(word))
				return false;
		} else {
			return false;
		}
		return true;
	}
	constructor(width, height) {
		this.show_text = true;
		this.width = width;

		// create private guess matrix
		this.guesses = [];
		for(var i = 0; i < height; i++) {
			this.guesses[i] = "";
		}
		this.current_line = 0;

		//generate matrix
		this.container = $(`<div class="grid">`).appendTo($("#gameboard")); // grid div
		this.name = $(`<p class="boardname">`).appendTo(this.container);
		this.points = $(`<p class="points">`).appendTo(this.container);
		this.matrix = []; // all the text elements

		for(var y = 0; y < height; y++) {
			var row = $(`<div class=grid_row>`).appendTo(this.container);
			var entries = [];
			for(var x = 0; x < width; x++) {
				var entry = $(`<div class=grid_entry>`).appendTo(row);	
				entries.push(entry);
			}
			this.matrix.push(entries);
		}
	}
};
var test_grid;
$(document).ready(function() {
	test_grid = new Grid(5, 6);
	// delete this function !! this is for testing!! this is bad!!
	test_grid.set_name("test");
	test_grid.set_points(100);
	test_grid.type_letter("t");
	test_grid.type_letter("e");
	test_grid.type_letter("v");
	test_grid.set_correct_word("penis");
	test_grid.backspace();
});