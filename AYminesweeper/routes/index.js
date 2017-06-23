var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hogehoge', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:id', (req, res) => {
  console.log(req.params.id);
  res.send(req.params.id);
  // 何かの処理
});

module.exports = router;
