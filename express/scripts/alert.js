function alert(text, fadeout=1) {
	var box = $(`<div id="alertbox">`);
	if(text.length > 15) {
		box.css("line-height", "40px");
	} else {
		box.css("line-height", "80px");
	}
	box.text(text);
	box.prependTo($("#alert_container"));
	box.fadeIn();
	setTimeout(() => {
		box.fadeOut(500, function() {
			box.remove();
		});
	}, +fadeout*1000);
	console.log(box);
}