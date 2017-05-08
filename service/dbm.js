var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('public/db/jpvocab.db');

function countTotalVocab(cb) {
  var ret = 0;

  var query = "SELECT COUNT(id) AS count FROM leveln2";

  db.each(query, function(err, row) {
    ret = row.count;
  }, function() {
    cb(ret);
  });
}

module.exports.countVocab = function(mode, cb) {
  var ret = 0;

  var query = "SELECT COUNT(vocab_id) AS count FROM common_vocab WHERE studied = " + mode;
  console.log("query = " + query);

  db.each(query, function(err, row) {
    ret = row.count;
  }, function() {
    cb(ret);
  });
}

module.exports.getCommonVocabIds = function(mode, cb) {
  var ret = [];

  var query = "SELECT vocab_id AS id FROM common_vocab WHERE studied = " + mode;
  console.log("query = " + query);

  db.each(query, function(err, row) {
    ret.push(row.id);
  }, function() {
    cb(ret);
  });
}

module.exports.getVocab = function(id, cb) {
  var ret = {};
  db.each("SELECT * FROM leveln2 WHERE id = " + id, function(err, row) {
    ret.id = row.id;
    ret.kanji = row.kanji;
    ret.hiragana = row.hiragana;
    ret.vn = row.vn;
    ret.ex = row.ex;
  }, function() {
    cb(ret);
  });
}

module.exports.search = function(kanji, cb) {
  var ret = {};
  db.each("SELECT * FROM leveln2 WHERE kanji = '" + kanji + "'", function(err, row) {
    ret.id = row.id;
    ret.kanji = row.kanji;
    ret.hiragana = row.hiragana;
    ret.vn = row.vn;
    ret.ex = row.ex;
  }, function() {
    cb(ret);
  });
}

module.exports.updateStatus = function(mode, limit, cb) {
  var ids = [];

  var query = "SELECT vocab_id AS id FROM common_vocab WHERE studied = -1 LIMIT " + limit;
  var updateQuery = "UPDATE common_vocab SET studied=? WHERE vocab_id IN (";

  db.each(query, function(err, row) {
    ids.push(row.id);
  }, function() {
    if (ids.length > 0) {
      updateQuery += ids[0];
    }

    for (var i = 1; i < ids.length; i++) {
      updateQuery += ", " + ids[i];
    }
    updateQuery += ")";

    console.log(updateQuery);
    db.run(updateQuery, [mode], function(err) {
      cb(this.changes);
    });
  });
}

module.exports.completeLevel = function(mode, cb) {
  var updateQuery = "UPDATE common_vocab SET studied=? WHERE studied=?";

  console.log(updateQuery);

  var newLevel = 0;
  if (mode == 2) {
    newLevel = -1;
  } else {
    newLevel = mode + 1;
  }

  db.run(updateQuery, [newLevel, mode], function(err) {
    cb(this.changes);
  });
}

module.exports.addNew = function(vocab, cb) {
  var insertQuery = "INSERT INTO leveln2 VALUES (NULL, ?, ?, 'NO', ?, ?, ?)";

  db.run(insertQuery, [vocab.kanji, vocab.hiragana, vocab.vn, vocab.ex, vocab.hit], function(err) {
    if (!err) {
      cb(this.changes);

      countTotalVocab(function(total) {
        var insertQuery = "INSERT INTO common_vocab VALUES (NULL, ?, 0, 0)";
        db.run(insertQuery, [total]);
      });
    } else {
      cb(0);
    }
  });
}

module.exports.update = function(vocab, cb) {
  var query = "UPDATE leveln2 SET kanji=?, hiragana=?, vn=?, ex=? WHERE id=?";

  db.run(query, [vocab.kanji, vocab.hiragana, vocab.vn, vocab.ex, vocab.id], function(err) {
    if (!err) {
      cb(this.changes);
    } else {
      cb(0);
    }
  });
}

module.exports.getGids = function(cb) {
  var ret = [];

  var query = "SELECT id FROM leveln2 WHERE hit = 400";
  console.log("query = " + query);

  db.each(query, function(err, row) {
    ret.push(row.id);
  }, function() {
    cb(ret);
  });
}
