var express = require('express');
var dbm = require('../service/dbm');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('grammar', { title: 'Play Grammar' });
});

router.get('/gids', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');

  dbm.getGids(function(data) {
    console.log(data);
    res.send(JSON.stringify(data));
  });
});

module.exports = router;