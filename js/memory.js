/* GLOBAL VARIABLES */
var checkFlippedCard = false;
var cardsLocked = false;
var clockIsTicking = false;
var modalActive = false;
var movesCount = 0;
var gameFinishedCount;
var totalSeconds = 0;
var totalPoints;
var timerVar;
var firstFlippedCard, secondFlippedCard;
/* INITIATE THE GAME ON PAGE LOAD */
function initGame() {
  //game finished count should always be 0 when initiating the game
  gameFinishedCount = 0;
  const cards = document.querySelectorAll('.card');
  const cardsArray = $(".card");
  cards.forEach(card => card.addEventListener('click', flipTheCard));
  shuffleCards(cardsArray);
  randomizeImageSrc();
}
/* CARD ACTIONS */
function flipTheCard() {
  if (cardsLocked || (this == firstFlippedCard))
    return;
  if (!clockIsTicking) {
    timerVar = setInterval(countTimer, 1000);
    clockIsTicking = true;
  }
  this.classList.add('flip');
  if (!checkFlippedCard) {
    checkFlippedCard = true;
    firstFlippedCard = this;
    return;
  }
  secondFlippedCard = this;
  checkFlippedCard = false;
  checkMatch();
}
/* CHECK IF CARDS ARE MATCH AND FINISH GAME IF YOU HAVE 8 MATCHES */
function checkMatch() {
  movesCount++;
  document.getElementById('moves').innerHTML = movesCount;
  if (firstFlippedCard.dataset.cardId === secondFlippedCard.dataset.cardId) {
    markCardsComplete();
    if (gameFinishedCount == 8) {
      gameFinished();
    }
    return;
  }
  reflipCards();
}
/* MARK THE CARD AS COMPLETE AND INCREASE GAME FINISH COUNT */
function markCardsComplete() {
  var completedCards = [firstFlippedCard, secondFlippedCard];
  completedCards.forEach(function (card) {
    card.removeEventListener('click', flipTheCard);
    card.setAttribute('style', 'box-shadow: 0px 4px 0px 2px #00c434;border-color: #00ff43;');
  });
  gameFinishedCount++;
}
/* REFLIP CARD */
function reflipCards() {
  cardsLocked = true;
  setTimeout(() => {
    firstFlippedCard.classList.remove('flip');
    secondFlippedCard.classList.remove('flip');
    cardsLocked = false;
  }, 1000);
}
/* SHUFFLE THE CARDS */
function shuffleCards(cardsArray) {
  for (var i = 0; i < cardsArray.length; i++) {
    var pos1 = Math.floor(Math.random() * cardsArray.length - 1) + 1;
    var pos2 = Math.floor(Math.random() * cardsArray.length - 1) + 1;
    cardsArray.eq(pos1).before(cardsArray.eq(pos2));
  }
}
/* RANDOMIZE BACK CARD SRC TO PREVENT DUSSE HACKERMAN */
function randomizeImageSrc() {
  const imageArray = $(".back");
  for (var i = 0; i < imageArray.length; i++) {
    console.log(imageArray[i]);
    imageArray[i].src = imageArray[i].src + '?' + Math.random();
  }
}
/* WHAT TO DO AFTER GAME IS FINISHED */
function gameFinished() {
  var finishedTime = document.getElementById('time').innerHTML;
  totalPoints = calculatePoints(movesCount, totalSeconds);
  renderModal(movesCount, finishedTime, totalPoints);
  resetTimer();
  createRating(totalPoints);
  modalActive = true;
}
/* CLOSE THE MODAL */
function closeModal() {
  if (document.getElementById('modal'))
    document.getElementById('modal').remove();
  else
    return;
}
/* GAME ACTIONS */
function restartGame() {
  //remove flip class tag
  const cards = document.querySelectorAll('.card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].classList.remove('flip');
    cards[i].setAttribute('style', '');
  }
  // if modal active, remove it
  if (modalActive) {
    closeModal();
    modalActive = false;
  }
  //remove timer and moves content
  document.getElementById("time").innerHTML = '';
  document.getElementById("moves").innerHTML = '';
  // reset movesCount
  movesCount = 0;
  // reset timer
  clockIsTicking = false;
  resetTimer();
  //initiate game
  initGame();
}
/* COUNT UP TIMER */
function countTimer() {
  ++totalSeconds;
  var hour = Math.floor(totalSeconds / 3600);
  var minute = Math.floor((totalSeconds - hour * 3600) / 60);
  var seconds = totalSeconds - (hour * 3600 + minute * 60);
  if (hour < 10)
    hour = "0" + hour;
  if (minute < 10)
    minute = "0" + minute;
  if (seconds < 10)
    seconds = "0" + seconds;
  document.getElementById("time").innerHTML = hour + ":" + minute + ":" + seconds;
}
/* STOP THE TIMER RESET THE TIMER VALUES */
function resetTimer() {
  clearInterval(timerVar);
  totalSeconds = 0;
}

function renderModal(moves, time, points) {
  var modalElem = document.createElement('div');
  modalElem.setAttribute('id', 'modal');
  modalElem.innerHTML = '<div class="modal-content">' +
    '<div class="modal-header">' +
    '<span class="close" onclick="closeModal()">&times;</span>' +
    '<h2 id="game-finished-headline">Game is finished, good job mate!</h2>' +
    '</div>' +
    '<div class="modal-body">' +
    '<div id="modal-row-points" class="modal-row">' +
    '<div id="modal-rating-col" class="modal-col">' +
    '<p class="game-finished-rating">Score</p>' +
    '<div id="modal-rating-score">' + points.toFixed(1) + 'p</div>' +
    '</div>' +
    '</div>' +
    '<div id="modal-row-rating" class="modal-row">' +
    '<div id="modal-rating-col" class="modal-col">' +
    '<div id="modal-rating">' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div id="modal-row-submit" class="modal-row">' +
    '<div id="modal-col-submit" class="modal-col">' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<button type="button" class="leaderboard-button" id="leaderboard-modal" onclick="renderLeaderboard()">Leaderboard</button>' +
    '<button type="button" class="submit-score-button" id="submit-score-modal" onclick="renderScoreSubmit()">Submit score</button>' +
    '<button type="button" class="play-again-button" id="play-again-modal" onclick="restartGame()">Play again</button>' +
    '</div>';
  document.body.append(modalElem);
}

function calculatePoints(moves, time) {
  var minimumMoves = 10;
  var minimumTime = 25;
  var points = 300 + ((minimumTime / time) * (minimumMoves / moves)) * 700;
  return points;
}
/* CREATE A STAR RATING DEPENDING ON MOVES COUNT */
function createRating(totalPoints) {
  var ratingElem = document.getElementById('modal-rating');
  var totalStars;
  if (totalPoints <= 150) {
    totalStars = 1;
  } else if (totalPoints > 150 && totalPoints <= 300) {
    totalStars = 2;
  } else if (totalPoints > 300 && totalPoints <= 450) {
    totalStars = 3;
  } else if (totalPoints > 450 && totalPoints <= 600) {
    totalStars = 4;
  } else if (totalPoints > 600) {
    totalStars = 5;
  }
  for (var i = 0; i < totalStars; i++) {
    var star = document.createElement('img');
    star.setAttribute('class', 'star');
    star.setAttribute('src', 'img/star.gif');
    ratingElem.appendChild(star);
  }
}