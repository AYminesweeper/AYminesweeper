'use strict'


var express = require('express'),
    bodyParser = require('body-parser');

var sqlite3 = require('sqlite3').verbose();   
var db = new sqlite3.Database('db.sqlite3');


var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');



app.get('/', function(req, res) {
	//let players = Player.objects('Player');
	/*db.all("SELECT * FROM players",function(err, rows){
      if (!err) {
        res.render('index.ejs', {
        	players : rows
        }); 
      }   
    }); 
    */
	res.sendFile(__dirname + "/index.html");
	//res.render('index.ejs', {players: players});
});


app.get('/write', function(req, res) {
	res.sendFile(__dirname + "/write.html");
});

app.post('/insert', function(req, res) {
	console.log(req.body);

	let name = req.body['name'],
		lat = req.body['pos'].lat,
		long = req.body['pos'].long;

	console.log(name,lat,long);
	
	db.run("INSERT INTO players VALUES (?,?,?)", name, lat, long);

	res.send(true);
});

app.post('/update', function(req, res) {
	console.log(req.body);
  console.log("I'm here.")
	let name = req.body['name'],
	lat = req.body['pos'].lat,
	long = req.body['pos'].long;

	console.log(name,lat,long);
	db.run("UPDATE players SET lat = ?, long = ? WHERE name = ?", lat, long, name);
	res.send(true);
});

app.post('/receive', function(req, res) {
	let name, lat, long;
	db.all("SELECT * FROM players", 
		function (err, rows) {
			console.log(rows);
			res.json(rows);
             if (err) throw err;
         });
});

app.use(function (req, res, next) {
	res.status(404).send("File not found");
});



app.listen(3000, function() {
	console.log("Go!");
});

