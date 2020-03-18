function saveScore() {
  $.ajax({
    url: 'saveScore.php',
    method: 'POST',
    data: {
      submitName: $('#submit-name').val(),
      points: totalPoints.toFixed(1)
    },
    success: function (result) {
      alert("Score registered, thanks!");
    },
    error: function (result) {
      alert("Error occured, score not registered");
    }
  });
  closeScoreSubmit();
}

function loadScores() {
  $.getJSON("scores.json", function (data) {
    var items = [];
    items.push("<tr><th>Name</th><th>Score</th></tr>");
    data.sort(function (a, b) {
      return parseFloat(b.points) - parseFloat(a.points);
    });
    $.each(data, function (key, val) {
      if (items.length == 11) {
        return false;
      }
      var points = parseInt(val.points);
      items.push("<tr><td class='submission-name' id='submission_" + key + "'>" + val.submitName + "</td><td class='submission-score' data-points='" + points.toFixed(1) + "' >" + points.toFixed(1) + "</td>");
    });
    $("<table/>", {
      "class": "leaderboard-submissions",
      "align": "center",
      html: items.join("")
    }).appendTo("#modal-leaderboard-col");
  });
}

function renderScoreSubmit() {
  var submitName;
  var modalRow = document.getElementById('modal-col-submit');
  var modalRowRating = document.getElementById('modal-row-rating');
  var modalRowPoints = document.getElementById('modal-row-points');
  if (!document.getElementById('submit-score')) {
    var submissionForm = document.createElement('form');
    submissionForm.setAttribute('id', 'submit-score');
    submissionForm.innerHTML = '<p id="submit-score-title">Submit your score</p>' +
      '<input id="submit-name" name="submit-name" type="text" value="" />' +
      '<input id="submit-points" name="submit-points" type="text" value="' + totalPoints.toFixed(1) + '" readonly />' +
      '<button type="button" id="button-submit" onclick="saveScore();">Submit</button>' +
      '<button type="button" id="button-close" onclick="closeScoreSubmit();">Close</button>';
    modalRowRating.setAttribute('style', 'display: none;');
    modalRowPoints.setAttribute('style', 'display: none;');
    modalRow.appendChild(submissionForm);
  } else {
    return;
  }
}

function renderLeaderboard() {
  if (document.getElementById('modal')) {
    closeModal();
  }
  var modalElem = document.createElement('div');
  modalElem.setAttribute('id', 'modal');
  modalElem.innerHTML = '<div id="modal-leaderboard" class="modal-content">' +
    '<div class="modal-header">' +
    '<span class="close" onclick="closeModal()">&times;</span>' +
    '<h2 id="leaderboard-headline">Leaderboard</h2>' +
    '</div>' +
    '<div class="modal-body">' +
    '<div id="modal-row-points" class="modal-row">' +
    '<div id="modal-leaderboard-col" class="modal-col">' +
    '<p class="leaderbord-label">Top 10</p>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>';
  document.body.append(modalElem);
  loadScores();
}

function closeScoreSubmit() {
  var modalRowRating = document.getElementById('modal-row-rating');
  var modalRowPoints = document.getElementById('modal-row-points');
  document.getElementById('submit-score').remove();
  modalRowRating.setAttribute('style', 'display: block;');
  modalRowPoints.setAttribute('style', 'display: block;');
}