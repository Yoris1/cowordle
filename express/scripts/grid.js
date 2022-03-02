class GridManager {
	remove_grid(id) {
		this.grids[id].container.remove();
	}
	get_grid(id) {
		return this.grids[id];
	}
	create_grid(player_id, player_name) {
		this.grids[player_id] = new Grid(5, 6);
		this.grids[player_id].set_name(player_name);
		if(this.wordlist) this.grids[player_id].set_wordlist(this.wordlist);
		if(this.correct_word) this.grids[player_id].set_correct_word(this.correct_word);
		if(player_id == "you") this.grids[player_id].toggle_text(true);
		return this.grids[player_id];
	}
	set_correct_word(word) {
		this.correct_word = word;
		Object.values(this.grids).forEach(grid => {
			grid.set_correct_word(word);
		});
	}
	reset_grids() {
		Object.values(this.grids).forEach(grid => {
			grid.reset();
		});
	}
	set_wordlist(wordlist) {
		this.wordlist = wordlist;
		Object.values(this.grids).forEach(grid => {
			grid.set_wordlist(this.wordlist);
		});
	}
	toggle_opponent_grid_visibility(value) {
		Object.values(this.grids).forEach(grid => {
			if(grid !== this.grids["you"]) {
				grid.toggle_text(value);
			}
		});
	}
	constructor() {
		this.grids = {};
	}
}

class Grid {
	set_guess(id, guess) {
		this.guesses[id] = guess;
		this.set_text(guess, id);
		this.set_colors(id, compare(guess, this.correct_word, false));
	}
	update() {
		this.red_grid_outline();
	}
	red_grid_outline() {
		var value = !this.is_guess_valid() && this.guesses[this.current_line].length === this.width;
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
		this.current_line = 0;
		for(var i = 0; i < this.matrix.length; i++)
			this._reset_row(i);
		for(var i = 0; i < this.guesses.length; i++) {
			this.guesses[i] = "";
		}
	}
	set_text(text, row) {
		if(!this.show_text && text !== "") return;
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
		if(this.guesses[this.current_line-1] == this.correct_word)
			return;
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
	toggle_text(value) {
		this.show_text = value;
		for(var i = 0; i < this.guesses.length; i++) {
			this.set_text(this.show_text?this.guesses[i]:"", i);
		}
	}
	submit() {
		if(this.is_guess_valid() && this.correct_word) {
			var guess = this.guesses[this.current_line];
			this.set_colors(this.current_line, compare(guess, this.correct_word, true));
			send_guess(guess);
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
		this.show_text = false;
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