// create a grid type, because i hate how javascript looks when i dont have actual types defined

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