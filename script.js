const pairs = [
  { id: 1, image: "🐶", word: "perro" },
  { id: 2, image: "🐱", word: "gato" },
  { id: 3, image: "🍎", word: "manzana" },
  { id: 4, image: "🚗", word: "coche" },
  { id: 5, image: "🏠", word: "casa" },
  { id: 6, image: "📘", word: "libro" },
  { id: 7, image: "🌞", word: "sol" },
  { id: 8, image: "🌙", word: "luna" },
  { id: 9, image: "💧", word: "agua" }
];

const imageGrid = document.getElementById("imageGrid");
const wordGrid = document.getElementById("wordGrid");
const matchesDisplay = document.getElementById("matches");
const movesDisplay = document.getElementById("moves");
const timeDisplay = document.getElementById("time");
const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const winBox = document.getElementById("winBox");
const finalTime = document.getElementById("finalTime");
const finalMoves = document.getElementById("finalMoves");

let selectedImage = null;
let selectedWord = null;
let moves = 0;
let matches = 0;
let seconds = 0;
let timer = null;
let gameStarted = false;
let lockBoard = false;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function startTimer() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    seconds++;
    timeDisplay.textContent = seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function updateStats() {
  matchesDisplay.textContent = matches;
  movesDisplay.textContent = moves;
  timeDisplay.textContent = seconds;
}

function createTile(content, id, type) {
  const btn = document.createElement("button");
  btn.className = `tile ${type}-tile`;
  btn.textContent = content;
  btn.dataset.id = id;
  btn.dataset.type = type;

  btn.addEventListener("click", () => handleTileClick(btn));
  return btn;
}

function handleTileClick(tile) {
  if (lockBoard) return;
  if (tile.classList.contains("matched")) return;

  if (!gameStarted) {
    gameStarted = true;
    startTimer();
  }

  const type = tile.dataset.type;

  if (type === "image") {
    if (selectedImage === tile) return;

    if (selectedImage) {
      selectedImage.classList.remove("selected");
    }

    selectedImage = tile;
    selectedImage.classList.add("selected");
  }

  if (type === "word") {
    if (selectedWord === tile) return;

    if (selectedWord) {
      selectedWord.classList.remove("selected");
    }

    selectedWord = tile;
    selectedWord.classList.add("selected");
  }

  if (selectedImage && selectedWord) {
    checkMatch();
  }
}

function checkMatch() {
  moves++;
  updateStats();

  const imageId = selectedImage.dataset.id;
  const wordId = selectedWord.dataset.id;

  if (imageId === wordId) {
    selectedImage.classList.remove("selected");
    selectedWord.classList.remove("selected");

    selectedImage.classList.add("matched");
    selectedWord.classList.add("matched");

    selectedImage.disabled = true;
    selectedWord.disabled = true;

    selectedImage = null;
    selectedWord = null;

    matches++;
    updateStats();

    if (matches === pairs.length) {
      stopTimer();
      finalTime.textContent = seconds;
      finalMoves.textContent = moves;
      winBox.classList.remove("hidden");
    }
  } else {
    lockBoard = true;

    setTimeout(() => {
      selectedImage.classList.remove("selected");
      selectedWord.classList.remove("selected");

      selectedImage = null;
      selectedWord = null;
      lockBoard = false;
    }, 700);
  }
}

function renderGame() {
  imageGrid.innerHTML = "";
  wordGrid.innerHTML = "";

  const shuffledImages = shuffle(pairs);
  const shuffledWords = shuffle(pairs);

  shuffledImages.forEach(item => {
    imageGrid.appendChild(createTile(item.image, item.id, "image"));
  });

  shuffledWords.forEach(item => {
    wordGrid.appendChild(createTile(item.word, item.id, "word"));
  });
}

function resetGame() {
  stopTimer();
  selectedImage = null;
  selectedWord = null;
  moves = 0;
  matches = 0;
  seconds = 0;
  gameStarted = false;
  lockBoard = false;
  winBox.classList.add("hidden");
  updateStats();
  renderGame();
}

restartBtn.addEventListener("click", resetGame);
playAgainBtn.addEventListener("click", resetGame);

resetGame();
