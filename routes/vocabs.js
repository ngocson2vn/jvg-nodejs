var express = require('express');
var dbm = require('../service/dbm');
var router = express.Router();

router.get('/new', function(req, res, next) {
  res.render('new', { title: 'Add New Vocabulary' });
});

router.get('/:id(\\d+)/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  var id = req.params.id;
  console.log("id = " + id);
  dbm.getVocab(id, function(data) {
    console.log(data);
    res.send(JSON.stringify(data));
  });
});

router.get('/:id/edit', function(req, res, next) {
  var id = req.params.id;
  console.log("id = " + id);
  dbm.getVocab(id, function(vocab) {
    console.log(vocab);
    res.render('update', vocab);
  });
});

router.post('/', function(req, res, next) {
  vocab = req.body;
  res.setHeader('Content-Type', 'application/json');
  
  if (vocab.kanji.length > 0 && vocab.hiragana.length > 0 && vocab.vn.length > 0) {
    dbm.addNew(vocab, function(rows) {
      res.send(JSON.stringify({n: rows}));
    }); 
  } else {
    res.send(JSON.stringify({n: 0}));
  }
});

router.put('/:id', function(req, res, next) {
  var vocab = req.body;
  console.log(vocab);

  res.setHeader('Content-Type', 'application/json');
  
  if (vocab.id.length > 0 && vocab.kanji.length > 0 && vocab.hiragana.length > 0 && vocab.vn.length > 0) {
    dbm.update(vocab, function(rows) {
      res.send(JSON.stringify({n: rows}));
    }); 
  } else {
    res.send(JSON.stringify({n: 0}));
  }
});

module.exports = router;
