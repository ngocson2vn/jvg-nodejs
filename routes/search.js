var express = require('express');
var dbm = require('../service/dbm');
var router = express.Router();

/* GET kanji. */
router.get('/', function(req, res, next) {
  kanji = req.query.q;
  res.setHeader('Content-Type', 'application/json');  
  dbm.search(kanji, function(vocab) {
    console.log("vocab = " + vocab);
    res.send(JSON.stringify(vocab));
  });
});

router.get('/init', function(req, res, next) {
  res.render('search', { title: 'Search Kanji' });
});

module.exports = router;