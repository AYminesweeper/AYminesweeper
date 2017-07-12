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

var player_num; //プレイヤー数
var dead_num; //ゲームオーバーになったプレイヤーの数

var field = createField();
console.log(field);

var goal = { "x": 0, "y": 0 };

router.get('/', function(req, res) {
    res.sendFile(path.resolve("./menu.html")); //path.resolve()で./insert.htmlを絶対パスに変換
});

router.get('/defender', function(req, res) {
    res.sendFile(path.resolve("./defender.html")); //path.resolve()で./insert.htmlを絶対パスに変換
});

router.get('/insert', function(req, res) {
    res.sendFile(path.resolve("./insert.html")); //path.resolve()で./insert.htmlを絶対パスに変換
});

router.get('/Attacker*', function(req, res) {
    res.sendFile(path.resolve("./Attacker.html")); //path.resolve()で./index.htmlを絶対パスに変換
});


router.get('/delete', function(req, res) { //データベースのカラムを全て削除
    db.run("DELETE FROM players");
});

router.post('/set', function(req, res) {
    console.log("I'm in set.");
    console.log(req.body);

    let pos = getSquarePos(convertRelative(req.body));

    if (setMine(pos.x, pos.y)) {
        console.log(field);
        res.send(true);
    }
});

router.post('/insert', function(req, res) {
    console.log("I'm in insert.");

    let name = req.body['name'],
        lat = req.body['pos'].lat,
        long = req.body['pos'].long;

    db.run("INSERT INTO players VALUES (?,?,?,?)", name, lat, long, 1);

    console.log("player_num: " + player_num);

    res.send(true);
});

router.post('/update', function(req, res) {
    console.log("I'm in update.");
    console.log(req.body);
    let name = req.body['name'],
        lat = req.body['pos'].lat,
        long = req.body['pos'].long;


    var R_pos = convertRelative(req.body['pos']);
    console.log(req.body['pos']);
    console.log(R_pos);
    console.log(getSquarePos(R_pos));

    console.log("name:" + name);

    db.run("UPDATE players SET lat = ?, long = ? WHERE name = ?", lat, long, name);

    if (isMine(getSquarePos(R_pos))) {
        db.run("UPDATE players SET is_survive = 0 WHERE name = ?", name);
        isDefenderWin();
        res.json({ msg: "bomb" });
    }


    isAttackerWin(getSquarePos(R_pos));
    res.send(true);



});

router.post('/receive', function(req, res) {
    let name, lat, long;
    db.all("SELECT * FROM players",
        function(err, rows) {
            //console.log(rows);
            res.json(rows);
            if (err) throw err;
        });
});

function createField() {
    var x, y;
    var tbl = new Array(square_num);

    for (y = 0; y < square_num; y++) {
        tbl[y] = new Array(square_num);
        for (x = 0; x < square_num; x++) {
            tbl[y][x] = 0;
        }
    }
    return tbl;
}

function setMine(x, y) {
    if (x < square_num && y < square_num) {
        field[y][x] = 1;
        return true;
    }
    return false;
}

/* 座標を相対座標へ変換 */
function convertRelative(pos) {
    var R_long = pos.long - baseX;
    var R_lat = pos.lat - baseY;

    console.log("R_long: " + R_long + ", R_lat: " + R_lat);

    return { "long": R_long, "lat": R_lat };
}

/* 相対座標から現在のマスの座標を取得 */
function getSquarePos(R_pos) {
    /* R_pos.longは正の数なので切り捨て,R_pos.latは負の数なので切り上げ */
    return { "x": Math.floor(R_pos.long / square_sizeX), "y": -1 * Math.ceil(R_pos.lat / square_sizeY) };
}

/* 現在のxy座標か地雷かどうか */
function isMine(SquarePos) {
    if (SquarePos.x < square_num && SquarePos.y < square_num)
        return field[SquarePos.y][SquarePos.x] == 1;

    return false;
}

/*
Attacker側ゲームオーバー
Defender側勝利
*/
function isDefenderWin() {
    db.get("SELECT COUNT(*) FROM players", function(err, res) {
        player_num = res['COUNT(*)'];
        console.log("player_num: " + player_num);
        db.get("SELECT COUNT(*) FROM players WHERE is_survive = 0", function(err, res) {
            dead_num = res['COUNT(*)'];
            console.log("dead_num: " + dead_num);
            if (player_num == dead_num) {
                console.log("Defender Win!!")
                    //Attacker側ゲームオーバー処理
                    //Defender側勝利処理
            }
        });
    });
}

/*
Attacker側勝利
Defender側ゲームオーバー
*/
function isAttackerWin(SquarePos) {
    if (SquarePos.x == goal.x && SquarePos.y == goal.y) {
        //Attacker側勝利処理
        //Defender側ゲームオーバー処理
    }
}


module.exports = router;
