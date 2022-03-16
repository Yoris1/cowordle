var room_id = 0;
$(document).ready(function(){
	$('#create').click(function(event) {
		event.preventDefault();
		createRoom();
	});
	$('#join').click(function(event) {
		event.preventDefault();
		joinRoom(room_id);
	});
	$('#startbtn').on('click', function() {
		socket.emit('start');
		$('#startbtn').hide();
	});
	$('#makeinvite').on('click', function(event) {
		event.preventDefault();
		var invite = `${document.location.origin}/?join=${room_id}`;
		navigator.clipboard.writeText(invite);
		alert("copied to clipboard!");
		console.log(`Making an invite. link: ${invite}`);
	})
});