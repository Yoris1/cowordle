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
	create_grid('test', 5, 'you');
});