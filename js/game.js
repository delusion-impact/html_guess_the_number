"use strict";

const MIN = 1;
const MAX = 20;
const START_SCORE = 20;

const messageEl = document.querySelector(".message");
const scoreEl = document.querySelector(".score");
const highscoreEl = document.querySelector(".highscore");
const guessInput = document.querySelector(".guess");
const checkBtn = document.querySelector(".btn-check");
const againBtn = document.querySelector(".btn-again");
const upBtn = document.querySelector(".btn-up");
const downBtn = document.querySelector(".btn-down");

let secretNumber = randomNumber();
let score = START_SCORE;
let highScore = 0;
let finished = false;

function randomNumber() {
  return Math.trunc(Math.random() * MAX) + MIN;
}

function displayMessage(text) {
  messageEl.textContent = text;
}

function setScore(value) {
  score = value;
  scoreEl.textContent = value;
}

function adjustGuess(delta) {
  if (finished) return;
  let value = Number(guessInput.value) || MIN;
  value = Math.min(MAX, Math.max(MIN, value + delta));
  guessInput.value = value;
  guessInput.focus();
}

function resetRound() {
  finished = false;
  secretNumber = randomNumber();
  setScore(START_SCORE);
  guessInput.value = "";
  guessInput.disabled = false;
  checkBtn.disabled = false;
  document.body.classList.remove("is-won", "is-lost");
  displayMessage("Начните угадывать...");
  guessInput.focus();
}

function endGame(won) {
  finished = true;
  guessInput.disabled = true;
  checkBtn.disabled = true;
  document.body.classList.toggle("is-won", won);
  document.body.classList.toggle("is-lost", !won);

  if (won) {
    displayMessage("Вы победили!");
    if (score > highScore) {
      highScore = score;
      highscoreEl.textContent = highScore;
    }
  } else {
    setScore(0);
    displayMessage("Вы проиграли!");
  }
}

function checkGuess() {
  if (finished) {
    return;
  }

  const raw = guessInput.value.trim();
  const guess = Number(raw);

  if (raw === "" || Number.isNaN(guess)) {
    displayMessage("Вы не ввели число!");
    return;
  }

  if (guess < MIN || guess > MAX) {
    displayMessage(`Число должно быть от ${MIN} до ${MAX}`);
    return;
  }

  if (guess === secretNumber) {
    endGame(true);
    return;
  }

  if (score <= 1) {
    endGame(false);
    return;
  }

  setScore(score - 1);
  displayMessage(guess < secretNumber ? "Число больше" : "Число меньше");
}

checkBtn.addEventListener("click", checkGuess);
againBtn.addEventListener("click", resetRound);
upBtn.addEventListener("click", () => adjustGuess(1));
downBtn.addEventListener("click", () => adjustGuess(-1));

guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkGuess();
  }
});