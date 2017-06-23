'use strict'

var express = require('express'),
    bodyParser = require('body-parser');

var app = express();
var api = require('./routes/api'); 

app.set('port', (process.env.PORT || 3000));

app.use(bodyParser.urlencoded({extended: true}));

app.use("/", api);

app.use(function (req, res, next) {
	res.status(404).send("File not found");
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

