var express = require('express'),
    bodyParser = require('body-parser');

var sqlite3 = require('sqlite3').verbose();   
var db = new sqlite3.Database('db.sqlite3');
var path = require('path');

var router = express.Router();

var baseX = 0; //フィールドの左上の端の座標
var baseY = 0;

var square_size = 10; //一マスのサイズ
var field_size = 100; //フィールドサイズ

var field = createField();

console.log(field);

router.get('/', function(req, res) {
	res.sendFile(path.resolve("./index.html"));  //path.resolve()で./index.htmlを絶対パスに変換
});


function createField(){
	var x, y;
	var tbl = new Array(field_size/square_size);
	for(y = 0; y < field_size/square_size; y++) {
 		tbl[y] = new Array(field_size/square_size);
  		for(x = 0; x < field_size/square_size; x++) {
   	 		tbl[y][x] = 0;
 		}
	}
	return tbl;
}



router.get('/write', function(req, res) {
	res.sendFile(path.resolve("./write.html"));
});

router.post('/insert', function(req, res) {
	console.log("I'm in insert.");

	let name = req.body['name'],
		lat = req.body['pos'].lat,
		long = req.body['pos'].long;
	
	db.run("INSERT INTO players VALUES (?,?,?)", name, lat, long);

	res.send(true);
});

router.post('/update', function(req, res) {
	console.log("I'm in update1.");
	//console.log(req.body);
	let name = req.body['name'],
		lat = req.body['pos'].lat,
		long = req.body['pos'].long;


	var R_pos = convertRelative(req.body['pos']);


	//console.log(req.body['pos']);
	console.log(isMine(getSquarePos(R_pos)));
	field[1][1] = 1;
	console.log(isMine({x:1,y:1}));

	db.run("UPDATE players SET lat = ?, long = ? WHERE name = ?", lat, long, name);
	res.send(true);

});

/* 座標を相対座標へ変換 */
function convertRelative (pos){
	var R_lat = pos.lat - baseX;
	var R_long = pos.long - baseY;

	return {"x": R_lat, "y": R_long};
}

/* 相対座標から現在のマスの座標を取得 */
function getSquarePos (R_pos) {
	return {"x" : Math.floor(R_pos.x/square_size), "y" : Math.floor(R_pos.y/square_size)};
}

/* 現在のxy座標か地雷かどうか */
function isMine (SquarePos) {
	let num = field_size/square_size; //ライン内のマスの数

	if(SquarePos.x < num && SquarePos.y < num)
		return field[SquarePos.x][SquarePos.y] == 1;

	return false;
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