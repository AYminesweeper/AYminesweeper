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
var winner = null;
var def_exist = false;


console.log(field);

var goal = { "x": 0, "y": 0 };

router.get('/', function(req, res) {
    res.sendFile(path.resolve("./menu.html"));
});

router.get('/defender', function(req, res) {
    res.sendFile(path.resolve("./defender.html")); //path.resolve()で./insert.htmlを絶対パスに変換
    def_exist = true;
});

router.get('/insert', function(req, res) {
    res.sendFile(path.resolve("./insert.html")); //path.resolve()で./insert.htmlを絶対パスに変換
});

router.get('/attacker*', function(req, res) {
    res.sendFile(path.resolve("./attacker.html")); //path.resolve()で./index.htmlを絶対パスに変換
});

router.post('/is_def_exist', function(req, res) {
    res.json({ def_exist: def_exist });
});

router.get('/restart', function(req, res) {
    db.run("DELETE FROM players");
    field = createField();
    def_exist = false;
    winner = null;
    res.sendFile(path.resolve("./menu.html"));  
});

router.get('/delete', function(req, res) { //データベースのカラムを全て削除
    db.run("DELETE FROM players");
    res.render('index', { title: 'Database all colums deleted' });
});

router.get('/resetMines', function(req, res) { //保持している爆弾配列をリセット
    for (var i = 0; i < square_num; i++) {
        for (var j = 0; j < square_num; j++) {
            field[i][j] = 0;
        }
    }

    console.log(field);
    res.render('index', { title: 'mine field reseted' });
});

router.post('/set', function(req, res) {
    console.log("I'm in set.");
    console.log(req.body);
    let pos = req.body;
    if (setMine(pos.x, pos.y)) {
        console.log(field);
        res.json(pos);
    } else {
        res.send(null);
    }
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
    console.log(req.body);
    let name = req.body['name'],
        lat = req.body['pos'].lat,
        long = req.body['pos'].long;


    var R_pos = convertRelative(req.body['pos']);
    //console.log(req.body['pos']);
    //console.log(R_pos);
    //console.log(getSquarePos(R_pos));

    updateValue(lat, long, name, function(result) {
        console.log(result);
        if (result) {
            console.log(getSquarePos(R_pos));
            if (isMine(getSquarePos(R_pos))) {
                db.run("UPDATE players SET is_survive = 0 WHERE name = ?", name);

                isDefenderWin()
                res.json({ msg: "bomb" });
            } else {
                res.send(true);
            }
            isAttackerWin(getSquarePos(R_pos));
        } else {
            res.json({ msg: "failed" });
        }
    });
});

router.post('/receive', function(req, res) {
    let name, lat, long;
    if (winner != null) {
        res.json({ winner: winner });
    } else {
        db.all("SELECT * FROM players",
            function(err, rows) {
                //console.log(rows);
                res.json(rows);
                if (err) throw err;
            });
    }
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
    if (x >= 0 && x < square_num && y >= 0 && y < square_num) {
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

function updateValue(lat, long, name, callback) {
    console.log("I'm in updateValue")

    db.get("SELECT lat as p_lat, long as p_long FROM players where name = ?", name, function(err, row) {
        if (!(typeof row === "undefined")) { //値が取得できなかった時にrowはundefinedになる
            let p_lat = row.p_lat, //p_lat : 前のlatの値  lat: 現在のlatの値
                p_long = row.p_long;

            let v_lat = lat - p_lat, //v_lat : latの変化量
                v_long = long - p_long;

            /* v_lat,v_longが2マスのサイズを越えた場合updateしない */
            if ((p_lat == 0 && p_long == 0) || (v_lat < 100*square_sizeY && v_long < 100*square_sizeX)) {
                db.run("UPDATE players SET lat = ?, long = ? WHERE name = ?", lat, long, name);
                callback(true);
            } else {
                console.log("位置情報のブレが発生 (☝︎ ՞ਊ ՞)☝︎");
                callback(false);
            }
        } else {
            console.log("Cat not update");
            callback(false);
        }
    });
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
                console.log("Defender Win!!");
                winner = "defender"
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
        console.log("Attacker Win!!")
        winner = "attacker"
    }
}

module.exports = router;
