class Name {
	clear() {
		$("#name").empty();
	}
	type(letter) {
		if(this.clear_string && this.clear_string === true)  {
			this.clear();
			this.clear_string = false;
		}
		if(this.letters.length >= 12) return;
		console.log(letter);
		this.letters.push(letter);
		this.elements.push($(`<div class="username_letter">`));
		console.log(this.elements);
		this.elements[this.elements.length-1].text(letter).appendTo($("#name"));
	}
	test() {
		this.clear_string = true;
		var str = "your name";
		for(var i = 0; i < str.length; i++) {
			$(`<div class="username_letter">`).text(str[i]).appendTo($("#name"));
		}
	}
	
	backspace() {
		console.log(this.elements);
		this.elements[this.elements.length-1].remove();
		this.elements = this.elements.slice(0, -1);
		this.letters = this.letters.slice(0, -1);
		if(this.letters.length === 0) {
			this.test();
		} 
	}
	getName() {
		var str = "";
		this.letters.forEach(letter => {
			str += letter;
		})
		return str;
	}
	constructor() {
		setTimeout(() => {
			this.test();
		}, 100);
		this.letters = [];
		this.elements = [];
	}
}
var userName = new Name();