'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var Realm = require('realm');

var app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

let DataSchema = {
	name: 'Player',
	primarykey: 'name',
	properties: {
		name: 'string',
		lat: 'float',
	    long: 'float'
	}
};


app.get('/', function(req, res) {
	let players = Player.objects('Player');
	res.render('index.ejs', {players: players});
});

app.get('/write', function(req, res) {
	console.log("adsfdsfdsfdsfdsfdsfds");
	res.sendFile(__dirname + "/write.html");
});

var Player = new Realm({
	path: 'player.realm',
	schema: [DataSchema]
});


app.post('/add', function(req, res) {
	console.log(req.body);

	let name = req.body['name'],
		lat = req.body['pos'].lat,
		long = req.body['pos'].long;

	console.log(name,lat,long);
	
	Player.write(() => {
		console.log("I'm here");
		Player.create('Player', {name: name, 
			lat: parseFloat(lat), long: parseFloat(long)});
	});

	res.send(true);
	
	//res.sendFile(__dirname + "/write.html");
});

app.listen(3000, function() {
	console.log("Go!");
});