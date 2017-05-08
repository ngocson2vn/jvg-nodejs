var index = 0;
var gids = [];

function fetchGids() {
  $.get("/grammar/gids", function(data, status) {
    if (status == 'success') {
      console.log(data);

      index = 0;
      gids.length = 0;
      data.forEach(function(id, index) {
        gids[index] = id;
      });

      fetchGrammar();
    }
  });
}

function fetchGrammar() {
  $("#lblGIndex").text((index + 1) + "/" + gids.length);
  $.get("/vocabs/" + gids[index], function(vocab, stt) {
    if (stt == 'success') {
      console.log(vocab);
      $("#lblGKanji").text(vocab.kanji);
      $("#lblGHiragana").text(vocab.hiragana);
      $("#lblGMeaning").html(vocab.vn.replace(/\n/g, "<br />"));
      $("#lblGExample").html(vocab.ex.replace(/\n/g, "<br />"));
    }
  });
}

$(document).ready(function() {
  fetchGids();

  $("#btnGrammarBack").click(function() {
    window.location.href = "/";
  });

  $("#btnGrammarPrev").click(function() {
    index = (index - 1) >= 0 ? (index - 1) : 0;
    fetchGrammar();
  });

  $("#btnGrammarNext").click(function() {
    index = (index + 1) < gids.length ? (index + 1) : (gids.length - 1);
    fetchGrammar();
  });
});