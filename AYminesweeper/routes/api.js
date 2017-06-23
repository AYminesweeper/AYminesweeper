var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('db.sqlite3');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
      });p
module.exports = router;
