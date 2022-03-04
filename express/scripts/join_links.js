function random_color() {
	switch(Math.floor(Math.random()*4)) {
		case 0:
			return "grid_mid"
		default:
			return "grid_bad"
	}
}
var room_id = 0;
$(document).ready(function() { 
	if(!window.location.search) {
		console.log("Don't need to join any room")
	}
	else {
		var room = window.location.search.substring(6);
		$("#invited").text("you've been invited to play on:");
		console.log(`User joined with invite link to room: ${room}`);
		room_id = room;
		for(var i = 0; i < room.length; i++) {
			var color = random_color();
			console.log(color);
			$(`<div class="grid_entry ${color}">`).text(room[i]).appendTo($("#room_id"))
		}
		$('#create_or_join').text("game id:");
	}
} )