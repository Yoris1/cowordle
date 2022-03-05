class Name {
	create_letter(letter) {
		if(!this.letters) {
			return $(`<div class="username_letter">`).text(letter);
		}
		var res = compare(this.getName(), "cat_cafe_sim", false);
		return $(`<div class="username_letter username_${res[res.length-1]}">`).text(letter);
	}
	type(letter) {
		letter = letter.toLowerCase();
		if(letter == " ") letter = "_";
		if(!this.allowed_name_letters.includes(letter)) return;
		if(this.letters.length >= 12) return;

		this.remove_placeholder();

		this.letters.push(letter);
		this.elements.push(this.create_letter(letter));
		this.elements[this.elements.length-1].appendTo($("#name"));

		localStorage.setItem("name", this.getName());
	}
	placeholder() {
		console.log(this);
		if(this.placeholder_active && this.placeholder_active === true) return;
		this.placeholder_active = true;
		var str = "username";
		for(var i = 0; i < str.length; i++) {
			this.create_letter(str[i]).appendTo($("#name"));
		}
	}
	remove_placeholder() {
		if(!this.placeholder_active || this.placeholder_active === false) return;
		this.placeholder_active = false;
		$("#name").empty();
	}
	backspace() {
		this.elements[this.elements.length-1].remove();
		this.elements = this.elements.slice(0, -1);
		this.letters = this.letters.slice(0, -1);
		if(this.letters.length === 0) this.placeholder();
		
		localStorage.setItem("name", this.getName());
	}
	getName() {
		var str = ""; 
		this.letters.forEach(letter => {str += letter});
		return str;
	}
	constructor() {
		this.allowed_name_letters = "qwertyuiopasdfghjklzxcvbnm 1234567890_";
		this.letters = [];
		this.elements = [];
		this.placeholder();
		
		var stored_name = localStorage.getItem("name");
		if(!stored_name) return;
		for(var i = 0; i < stored_name.length; i++) 
			this.type(stored_name[i]);
	}
}

var userName;
$(document).ready(function () {
	userName = new Name();
})