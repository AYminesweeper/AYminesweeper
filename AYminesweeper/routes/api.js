var express = require('express'),
    bodyParser = require('body-parser');

var sqlite3 = require('sqlite3').verbose();   
var db = new sqlite3.Database('db.sqlite3');
var path = require('path');

var router = express.Router();

var baseX = 200; //フィールドの左上の端の座標
var baseY = 200;

router.get('/', function(req, res) {
	res.sendFile(path.resolve("./index.html"));  //path.resolve()で./index.htmlを絶対パスに変換
});


router.get('/write', function(req, res) {
	res.sendFile(path.resolve("./write.html"));
});

router.post('/insert', function(req, res) {
	console.log("I'm in insert.")

	let name = req.body['name'],
		lat = req.body['pos'].lat,
		long = req.body['pos'].long;
	
	db.run("INSERT INTO players VALUES (?,?,?)", name, lat, long);

	res.send(true);
});

router.post('/update', function(req, res) {
	console.log("I'm in update.");
	//console.log(req.body);
	let name = req.body['name'],
	lat = req.body['pos'].lat,
	long = req.body['pos'].long;

	console.log(req.body['pos']);

	db.run("UPDATE players SET lat = ?, long = ? WHERE name = ?", lat, long, name);
	res.send(true);

});

/* 座標を相対座標へ変換 */
function convertRelative (pos){
	var lat = pos.lat;
	var long = pos.long;


}

function isInside (pos) {
	return pos.lat <= 1093809 && pos.long <= 18998090;
}

router.post('/receive', function(req, res) {
	let name, lat, long;
	db.all("SELECT * FROM players", 
		function (err, rows) {
			console.log(rows);
			res.json(rows);
             if (err) throw err;
         });
});

module.exports = router;