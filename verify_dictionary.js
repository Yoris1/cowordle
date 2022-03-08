const { readFileSync } = require("fs");

var dictionary1 = readFileSync("dictionaries/dictionary.txt", 'utf-8').split('\n');
var dictionary2 = readFileSync("dictionaries/winning_words.txt", 'utf-8').split('\n');
var winning_words_count = 0;
dictionary2.forEach(word => {
	if(word.length === 5) {
		winning_words_count++;
		if(dictionary1.includes(word) == false) {
			console.log(`Dictionary is lacking word ${word}`);
		}
	}
});
console.log(`There are ${winning_words_count} winning 5 letter words`);
