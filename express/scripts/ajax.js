function createRoom() {
	console.log("Creating room");
	$.ajax({
		type: "POST",
		url: "/room",
		data: {word_len: 5},
		dataType: "json",
		success: function(result) {
			console.log(result);
			joinRoom(result.id);
		}
	});
}
function joinRoom(roomid) {
	$('#join_form').hide();
	$('#roominfo').show();
	$('#gameboard').show();

	$('#current_room_id').text(roomid);
	createSocket(roomid);
}