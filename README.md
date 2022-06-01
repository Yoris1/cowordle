# Multiplayer Wordle
## Overview
This is my latest side-project. 

It's a multiplayer version of the hit word guessing game [wordle](https://www.nytimes.com/games/wordle/index.html). 

I wanted to play wordle with my friends, but all the options online were rewarding people based on the speed they solved it in instead of the guess count (which imo is a core mechanic of the game). So I made my own version where the points you get are based on how few guesses you use. 

## Features
It is far from being a feature complete multiplayer game. It's my first attempt at making one, I tried to make the experience of playing it with friends as simple as it is in [skribbl.io](https://skribbl.io/) and i think i managed to do that, as all of my friends could join fairly effortlessly. But there is no multiplayer room discovery, moderation or phone support.
## Tech
Node.JS backend written in typescript.

JQuery+html+css front end.

HTTPS server runs on port 8080 and the HTTP one runs on port 8081.
HTTPS Certificates are read from `./certificates`. 

## Wordlists
wordlist assembled from:

https://github.com/dwyl/english-words/ -> https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt

http://www-personal.umich.edu/~jlawler/wordlist.html

https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears-medium.txt

https://www.npmjs.com/package/word-list

winning wordslist: 

https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears-medium.txt

