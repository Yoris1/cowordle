var running = false;
function alert(text) {
	if(running === true) return;
	running = true;
	$("#alerttext").text(text);
	$("#alertbox").fadeIn();
	$("#alertbox").css('top', '0px');
	setTimeout(() => {
		$("#alertbox").fadeOut();
		setTimeout(() => {
			running = false;
			$("#alertbox").css('top', '-500px');
		}, 500);
	}, 1000);
}
$(document).ready(function() {
	$("#alertbox").fadeOut();
});