<<<<<<< HEAD
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
	db.all("SELECT * FROM players",function(err, rows){
      if (!err) {
        res.render('index.ejs', {
        	players : rows
        }); 
      }   
    }); 
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
	
	console.log("I'm here");
	db.run("INSERT INTO players VALUES (?,?,?)", name, lat, long);

	res.send(true);
});

app.use(function (req, res, next) {
	res.status(404).send("File not found");
});


app.listen(3000, function() {
	console.log("Go!");
});

=======
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>test</title>
</head>
<body>
<button id="insert">送信(insert)</button>
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" charset="utf-8"></script>
	<script type="text/javascript">
		$( function() {
			$( '#insert' ) .click(
				function() {
					var hostUrl= '/insert';


					$.ajax({
						url: hostUrl,
						type:'POST',
						dataType: 'json',
						data : {"name" : "person1", "pos" : {"lat":10.00001, "long":10.00001}},
						//timeout:10000,
					}).done(function(data) {
						console.log("ok");
						console.log(data);
					}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
						alert("error");
					})
				});
		} );
	</script>

	<button id="update">送信(update)</button>
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" charset="utf-8"></script>
	<script type="text/javascript">
		$( function() {
			$( '#update' ) .click(
				function() {
					var hostUrl= '/update';


					$.ajax({
						url: hostUrl,
						type:'POST',
						dataType: 'json',
						data : {"name" : "person1", "pos" : {"lat":22.2222, "long":22.2222}},
						//timeout:10000,
					}).done(function(data) {
						console.log("ok");
						console.log(data);
					}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
						alert("error");
					})
				});
		} );
	</script>

</body>
</html>
>>>>>>> d8bf2e484efec713e6ba58c50450553ea61e022e
