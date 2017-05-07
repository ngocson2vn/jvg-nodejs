var express = require('express');
var dbm = require('../service/dbm');
var router = express.Router();

/* GET kanji. */
router.get('/', function(req, res, next) {
  var ret = {title: 'Play Kanji'};
  dbm.countVocab(-1, function(count) {
    ret.total = count;
    dbm.countVocab(0, function(count) {
      ret.play0 = count;
      dbm.countVocab(1, function(count) {
        ret.play1 = count;
        dbm.countVocab(2, function(count) {
          ret.play2 = count;
          console.log(ret);
          res.render('game', ret);
        });
      });
    });
  });
});

// GET id list
router.get('/ids', function(req, res, next) {
  var level = req.query.q;
  res.setHeader('Content-Type', 'application/json');

  dbm.getCommonVocabIds(parseInt(level), function(data) {
    console.log(data);
    res.send(JSON.stringify(data));
  });
});

router.get('/release', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  dbm.updateStatus(1, 10, function(rows) {
    console.log("rows = " + rows);
    res.send(JSON.stringify({n: rows}));
  }); 
});

router.get('/complete', function(req, res, next) {
  level = req.query.q;
  res.setHeader('Content-Type', 'application/json');  
  dbm.completeLevel(parseInt(level), function(rows) {
    console.log("rows = " + rows);
    res.send(JSON.stringify({n: rows}));
  }); 
});

module.exports = router;
