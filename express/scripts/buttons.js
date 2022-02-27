$(document).ready(function(){
	$('#create').click(function(event) {
		event.preventDefault();
		createRoom();
	});
	$('#join').click(function(event) {
		event.preventDefault();
		joinRoom($('#roomid').val());
	});
	$('#startbtn').on('click', function() {
		socket.emit('start');
		$('#startbtn').hide();
	});
	$('#makeinvite').on('click', function(event) {
		event.preventDefault();
		var old_text = $(this).text();
		$(this).text("copied to clipboard");
		setTimeout(() => {
			$(this).text(old_text)
		}, 500);
		var invite = document.location.origin  + "/?join=" + $("#current_room_id").text() ; 
		navigator.clipboard.writeText(invite);
		console.log(`Making an invite. link: ${invite}`);
	})
	create_grid('test', 5, 'you');
});