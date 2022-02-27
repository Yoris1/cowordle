$(document).ready(function() { 
	if(!window.location.search) {
		console.log("Don't need to join any room")
	}
	else {
		var room = window.location.search.substring(6);
		console.log(`User joined with invite link to room: ${room}`);
		$('#roomid').val(room);
		$("#roomid").prop('disabled', true);
		$('#create').hide();
		$('#create_or_join').text("game id:");
	}
} )