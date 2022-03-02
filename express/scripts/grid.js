// create a grid type, because i hate how javascript looks when i dont have actual types defined

class Grid {
	set_colors(row, colors) {
		for(var i = 0; i < colors.length; i++) {
			this.matrix[row][i].addClass("grid_"+colors[i]);
		}
	}
	reset_row(row) {
		this.matrix[row].forEach(element => {
			element.removeClass("grid_good grid_bad grid_mid grid_notreal");
			element.text('');
		})
	}
	reset() {
		for(var i = 0; i < this.matrix.length; i++) {
			this.reset_row(i);
		}
	}
	set_text(text, row) {
		for(var i = 0; i < text.length; i++)
			this.matrix[row][i].text(text[i]);
	}
	set_name(name) {
		this.name.text(name);
	}
	set_points(points) {
		this.points.text("points: "+points);
	}
	constructor(width, height) {
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
		// =============
	}
};

$(document).ready(function() {
	// delete this function !! this is for testing!! this is bad!!
	var grid = 	new Grid(5, 6);
	grid.set_text("test", 0); 
	grid.set_colors(2, ["bad", "bad", "good", "mid", "bad"]);
	grid.set_name("test");
	grid.set_points(100);
})


var grids = {}

function resetGrids() {
	$('.grid').each(function () {
		for(var i = 0; i < 6; i++) {
			var grid_id = $(this).attr("id");
			set_grid_colors(grid_id, i, 'RRRRR');
			set_grid_text(grid_id, i, '');
		}
	})
}

function create_grid(id, dimensions, name) {
	grids[id] = {};
	grids[id].row = 0;
	grids[id].max = 5;
	
	$(`<div class="grid" id=${id}>`).appendTo($("#gameboard"));
	for(var i = 0; i < +dimensions+1; i++) {
		row = $(`<div class=grid_row id='${id}_${i}'>`);
		$(`#${id}`).append(row);
		for(var j = 0; j < +dimensions; j++)
			$(`<div class=grid_entry>`).appendTo(row);
	}
	$(`<p class="boardname">`).text(name).prependTo("#"+id);
}

function set_grid_text(id, row, word) {
	var i = 0;
	$(`#${id}_${row}`).children('div').each(function() {
		if(word.length <= i)
			$(this).text(' ');
		else
			$(this).text(word[i++]);
	})
}

function set_grid_colors(id, row, word) {
	var i = 0;
	$(`#${id}_${row}`).children('div').each(function() {
		var char =word[i++];
		console.log(`Doing switch statement for character ${char}`) ;
		$(this).removeClass("grid_notreal");
		// should just separate not real words out into a separate function.
		if(char == 'N') 
			$(this).addClass("grid_bad");
		else if(char == 'M')
			$(this).addClass("grid_mid");
		else if(char == 'Y')
			$(this).addClass("grid_good");
		else if(char == 'F')
			$(this).addClass("grid_notreal");
		else if(char == 'R') {
			$(this).removeClass("grid_good grid_bad grid_mid grid_notreal");
		}
	})
}