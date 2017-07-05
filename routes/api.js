var express = require('express'),
    bodyParser = require('body-parser');

var sqlite3 = require('sqlite3').verbose();   
var db = new sqlite3.Database('db.sqlite3');
var path = require('path');

var router = express.Router();

var baseX = 140.09901; //フィールドの左上の端の座標
var baseY = 36.11204;
var square_num = 10; //1ライン内のマスの数
var square_sizeX = 0.00031890000000203147; //1マスのx座標サイズ
var square_sizeY = 0.0002341999999998734; //2マスのy座標サイズ

var field = createField();
setMine(4, 8);
console.log(field);

router.get('/', function(req, res) {
	res.sendFile(path.resolve("./index.html"));  //path.resolve()で./index.htmlを絶対パスに変換
});

router.get('/delete', function(req, res) {
	db.run("DELETE FROM players");
});

router.post('/set', function(req, res) {
	console.log("I'm in insert.");
	let x = req.body['x'],
	    y = req.body['y'];

	setMine(x, y);
	console.log(field);
});

router.post('/insert', function(req, res) {
	console.log("I'm in insert.");

	let name = req.body['name'],
		lat = req.body['pos'].lat,
		long = req.body['pos'].long;
	
	db.run("INSERT INTO players VALUES (?,?,?,?)", name, lat, long, 1);

	res.send(true);
});

router.post('/update', function(req, res) {
	console.log("I'm in update.");
	//console.log(req.body);
	let name = req.body['name'],
		lat = req.body['pos'].lat,
		long = req.body['pos'].long;


	var R_pos = convertRelative(req.body['pos']);
	console.log(req.body['pos']);
	console.log(R_pos);
	console.log(getSquarePos(R_pos));
	
	
	//console.log(req.body['pos']);
	//console.log(isMine(getSquarePos(R_pos)));
	//field[1][1] = 1;
	//console.log(isMine({x:1,y:1}));


	db.run("UPDATE players SET lat = ?, long = ? WHERE name = ?", lat, long, name);

	if(isMine(getSquarePos(R_pos))){
		db.run("UPDATE players SET is_survive = 0, WHERE name = ?", name);
		console.log("isMine");
		res.send(1);
	}

	res.send(true);

});

router.post('/receive', function(req, res) {
	let name, lat, long;
	db.all("SELECT * FROM players", 
		function (err, rows) {
			//console.log(rows);
			res.json(rows);
             if (err) throw err;
         });
});

function createField(){
	var x, y;
	var tbl = new Array(square_num);
	
	for(y = 0; y < square_num; y++) {
 		tbl[y] = new Array(square_num);
  		for(x = 0; x < square_num; x++) {
   	 		tbl[y][x] = 0;
 		}
	}
	return tbl;
}

function setMine(x, y){
	field[y][x] = 1;
}

/* 座標を相対座標へ変換 */
function convertRelative (pos){
	var R_long = pos.long - baseX;
	var R_lat = pos.lat - baseY;

	return {"long": R_long, "lat": R_lat};
}

/* 相対座標から現在のマスの座標を取得 */
function getSquarePos (R_pos) {
	return {"x" : Math.floor(R_pos.long/square_sizeX), "y" : -1*Math.floor(R_pos.lat/square_sizeY)};
}

/* 現在のxy座標か地雷かどうか */
function isMine (SquarePos) {
	if(SquarePos.x < square_num && SquarePos.y < square_num)
		return field[SquarePos.y][SquarePos.x] == 1;

	return false;
}


module.exports = router;