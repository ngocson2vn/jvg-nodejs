var kpc = 0;
var index = 0;
var ids = [];

$.put = function(url, data, callback) {
  return $.ajax({
    url: url,
    type: 'PUT',
    success: callback,
    data: data
  });
}

function reloadData() {
  kpc = 0;
  $("#lblHiragana").text("");
  $("#lblMeaning").text("");
  $("#txtAnswer").val("");
  fetchVocab();
}

function fetchVocab() {
  $.get("/vocabs/" + ids[index], function(vocab, stt) {
    if (stt == 'success') {
      console.log(vocab);
      $("#lblKanji").text(vocab.kanji);
      $("#hiddenHiragana").text(vocab.hiragana);
      $("#hiddenMeaning").text(vocab.vn);
      $("#hiddenExample").text(vocab.ex);
    }
  });
}

function fetchVocabIds(level) {
  $.get("/game/ids?q=" + level, function(data, status) {
    if (status == 'success') {
      console.log(data);

      index = 0;
      $("#lblIndex").text((index + 1) + "/" + data.length);

      ids.length = 0;
      data.forEach(function(id, index) {
        ids[index] = id;
      });

      reloadData();
    }
  });
}

function buildPlayKanji() {
  $("div#panel").hide();

  $("div#play").append("<span id='lblIndex'></span><br /><br />");
  $("div#play").append("<span id='lblKanji' class='kanji_label'></span><br />");
  $("div#play").append("<span id='lblHiragana' class='label'></span><br /><br />");
  $("div#play").append("<span id='lblMeaning' class='label meaning'></span><br />");
  $("div#play").append("<input id='txtAnswer' type='text' class='label answer' /><br /><br />");
  $("div#play").append("<button id='btnBack' style='height: 50px; width: 100px; font-size: 20px;'>Back</button>");
  $("div#play").append("<span style='display:inline-block; width: 80px;'></span>");
  $("div#play").append("<button id='btnEdit' style='height: 50px; width: 100px; font-size: 20px;'>Edit</button>");
  $("div#play").append("<span style='display:inline-block; width: 80px;'></span>");
  $("div#play").append("<button id='btnHint' style='height: 50px; width: 100px; font-size: 20px;'>Hint</button>");
  
  $("#txtAnswer").focus();
  $("#txtAnswer").keypress(function(event) {
    if (event.charCode == 13) {
      if (kpc == 1) {
        kpc = 0;
        index++;

        if (index == ids.length) {
          index = 0;
        }

        $("#lblIndex").text((index + 1) + "/" + ids.length);
        $("#lblHiragana").text("");
        $("#lblMeaning").text("");
        $("#txtAnswer").val("");

        fetchVocab();
        return;
      }

      console.log(event.charCode);
      var hira = $(this).val();
      var correctHira = $("#hiddenHiragana").text();

      if (hira == correctHira) {
        kpc++;
        $("#lblHiragana").text($("#hiddenHiragana").text());
        $("#lblMeaning").html(
          $("#hiddenMeaning").text().replace("\n", "<br />") + "<br />" + 
          $("#hiddenExample").text().replace("\n", "<br />")
        );
      }

      console.log(hira);
    }
  });

  $("#btnBack").click(function() {
    $("div#play").hide();
    $("div#panel").show();
  });

  $("#btnEdit").click(function() {
    var id = ids[index];
    window.open("/vocabs/" + id + "/edit", "Edit Vocabulary", width=900, height=600);
  });

  $("#btnHint").click(function() {
    $("#lblHiragana").text($("#hiddenHiragana").text());
  });
}

$(document).ready(function() {
  $("#btnPlayKanji").click(function() {
    window.location.href = "/game";
  });

  $("#btnAddNew").click(function() {
    window.location.href = "/vocabs/new";
  });

  $("#btnPlay0").click(function() {
    var re0 = /Play Level0 \((\d+)\)/;
    var play0 = re0.exec($("#btnPlay0").text())[1];
    if (parseInt(play0) <= 0) {
      return;
    }

    if ($("div#play").css('display') == 'none') {
      $("div#panel").hide();
      $("div#play").show();
    } else {
      buildPlayKanji();
    }

    fetchVocabIds(0);
  });

  $("#btnPlay1").click(function() {
    var re1 = /Play Level1 \((\d+)\)/;
    var play1 = re1.exec($("#btnPlay1").text())[1];
    if (parseInt(play1) <= 0) {
      return;
    }

    if ($("div#play").css('display') == 'none') {
      $("div#panel").hide();
      $("div#play").show();
    } else {
      buildPlayKanji();
    }

    fetchVocabIds(1);
  });

  $("#btnPlay2").click(function() {
    var re2 = /Play Level2 \((\d+)\)/;
    var play2 = re2.exec($("#btnPlay2").text())[1];
    if (parseInt(play2) <= 0) {
      return;
    }

    if ($("div#play").css('display') == 'none') {
      $("div#panel").hide();
      $("div#play").show();
    } else {
      buildPlayKanji();
    }

    fetchVocabIds(2);
  });

  $("#btnRelease").click(function() {
    var re = /Release \((\d+)\)/;
    var total = re.exec($("#btnRelease").text())[1];
    if (parseInt(total) <= 0) {
      return;
    }

    $.get("/game/release", function(data, status) {
      if (status == 'success') {
        console.log(data);
        var re1 = /Play Level1 \((\d+)\)/;
        var play1 = re1.exec($("#btnPlay1").text())[1];
        
        if (data && data.n > 0) {
          $("#btnRelease").text("Release (" + (parseInt(total) - data.n) + ")");
          $("#btnPlay1").text("Play Level1 (" + (parseInt(play1) + data.n) + ")");
        }
      }
    });
  });

  $("#btnComplete0").click(function() {
    var re0 = /Play Level0 \((\d+)\)/;
    var play0 = re1.exec($("#btnPlay0").text())[1];
    if (parseInt(play0) <= 0) {
      return;
    }

    var r = confirm("Are you sure?");
    if (r == false) {
      return;
    }

    $.get("/game/complete?q=0", function(data, status) {
      if (status == 'success') {
        console.log(data);
        var re0 = /Play Level0 \((\d+)\)/;
        var re1 = /Play Level1 \((\d+)\)/;
        var play0 = re0.exec($("#btnPlay0").text())[1];
        var play1 = re1.exec($("#btnPlay1").text())[1];
        
        if (data && data.n > 0) {
          $("#btnPlay0").text("Play Level0 (" + (parseInt(play0) - data.n) + ")");
          $("#btnPlay1").text("Play Level1 (" + (parseInt(play1) + data.n) + ")");
        }
      }
    });
  });

  $("#btnComplete1").click(function() {
    var re1 = /Play Level1 \((\d+)\)/;
    var play1 = re1.exec($("#btnPlay1").text())[1];
    if (parseInt(play1) <= 0) {
      return;
    }

    var r = confirm("Are you sure?");
    if (r == false) {
      return;
    }

    $.get("/game/complete?q=1", function(data, status) {
      if (status == 'success') {
        console.log(data);
        var re1 = /Play Level1 \((\d+)\)/;
        var re2 = /Play Level2 \((\d+)\)/;
        var play1 = re1.exec($("#btnPlay1").text())[1];
        var play2 = re2.exec($("#btnPlay2").text())[1];
        
        if (data && data.n > 0) {
          $("#btnPlay1").text("Play Level1 (" + (parseInt(play1) - data.n) + ")");
          $("#btnPlay2").text("Play Level2 (" + (parseInt(play2) + data.n) + ")");
        }
      }
    });
  });

  $("#btnComplete2").click(function() {
    var re2 = /Play Level2 \((\d+)\)/;
    var play2 = re2.exec($("#btnPlay2").text())[1];
    if (parseInt(play) <= 0) {
      return;
    }

    var r = confirm("Are you sure?");
    if (r == false) {
      return;
    }

    $.get("/game/complete?q=2", function(data, status) {
      if (status == 'success') {
        console.log(data);
        var re = /Release \((\d+)\)/;
        var re2 = /Play Level2 \((\d+)\)/;
        var total = re.exec($("#btnRelease").text())[1];
        var play2 = re2.exec($("#btnPlay2").text())[1];
        
        if (data && data.n > 0) {
          $("#btnRelease").text("Release (" + (parseInt(total) + data.n) + ")");
          $("#btnPlay2").text("Play Level2 (" + (parseInt(play2) - data.n) + ")");
        }
      }
    });
  });

  $("#btnClear").click(function() {
    $("#txtKanji").val("");
    $("#txtHiragana").val("");
    $("#txtMeaning").val("");
    $("#txtExample").val("");
  });

  $("#btnAdd").click(function() {
    var vocab = {};
    vocab.kanji = $("#txtKanji").val();
    vocab.hiragana = $("#txtHiragana").val();
    vocab.vn = $("#txtMeaning").val();
    vocab.ex = $("#txtExample").val();
    console.log(vocab);
    $.post("/vocabs", vocab, function(data, status) {
      if (status == 'success') {
        if (data.n > 0) {
          $("#lblStatus").text("Success");
        } else {
          $("#lblStatus").text("Failed");
        }
      }
    });
  });

  $("#btnUpdate").click(function() {
    var vocab = {};
    vocab.id = $("#txtId").val();
    vocab.kanji = $("#txtKanji").val();
    vocab.hiragana = $("#txtHiragana").val();
    vocab.vn = $("#txtMeaning").val();
    vocab.ex = $("#txtExample").val();
    console.log(vocab);
    $.put("/vocabs/" + vocab.id, vocab, function(data, status) {
      if (status == 'success') {
        if (data.n > 0) {
          $("#lblStatus").text("Success");
        } else {
          $("#lblStatus").text("Failed");
        }
      }
    });
  });

  $("#btnNewBack").click(function() {
    window.location.href = "/";
  });

  $("#btnEditBack").click(function() {
    window.onunload = function() {
      var win = window.opener;
      if (!win.closed) {
        window.opener.reloadData();
      }
    };
    
    window.close();
  });

  $("#btnKanjiBack").click(function() {
    window.location.href = "/";
  });

});