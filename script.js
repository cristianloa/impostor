// ----- Estado del juego -----
let players = [];
let impostorIndex = -1;
let secretWord = "";
let currentRevealIndex = 0;
let round = 1;
let startPlayerIndex = 0;

// Palabras de ejemplo (puedes agregar más)
const words = ["Pizza", "Playa", "Escuela", "Fútbol", "Cine", "Hospital", "Montaña", "Computadora"];

// ----- Referencias DOM -----
const screens = {
  add: document.getElementById("screen-add"),
  reveal: document.getElementById("screen-reveal"),
  round: document.getElementById("screen-round"),
  decision: document.getElementById("screen-decision"),
  result: document.getElementById("screen-result"),
};
const orderContainer = document.getElementById("orderContainer");


const playerInput = document.getElementById("playerInput");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const playersList = document.getElementById("playersList");
const startBtn = document.getElementById("startBtn");

const revealTitle = document.getElementById("revealTitle");
const holdRevealBtn = document.getElementById("holdRevealBtn");
const roleText = document.getElementById("roleText");
const nextPlayerBtn = document.getElementById("nextPlayerBtn");

const roundTitle = document.getElementById("roundTitle");
const startPlayerText = document.getElementById("startPlayerText");
const orderText = document.getElementById("orderText");
const goDecisionBtn = document.getElementById("goDecisionBtn");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const resultTitle = document.getElementById("resultTitle");
const resultImpostor = document.getElementById("resultImpostor");
const resultWord = document.getElementById("resultWord");
const restartBtn = document.getElementById("restartBtn");

// ----- Utilidades -----
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

function randIndex(max) {
  return Math.floor(Math.random() * max);
}

function renderPlayers() {
  playersList.innerHTML = "";
  players.forEach((p, i) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${i + 1}. ${p}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "8px";
    removeBtn.onclick = () => {
      players.splice(i, 1);
      renderPlayers();
    };

    li.appendChild(span);
    li.appendChild(removeBtn);
    playersList.appendChild(li);
  });
}


// ----- Pantalla: Agregar jugadores -----
addPlayerBtn.addEventListener("click", () => {
  const name = playerInput.value.trim();
  if (!name) return;
  players.push(name);
  playerInput.value = "";
  renderPlayers();
});

startBtn.addEventListener("click", () => {
  if (players.length < 3) {
    alert("Necesitas al menos 3 jugadores");
    return;
  }
  startGame();
});

// ----- Inicio de partida -----
function startGame() {
  // Elegir palabra e impostor
  secretWord = words[randIndex(words.length)];
  impostorIndex = randIndex(players.length);

  round = 1;
  currentRevealIndex = 0;

  showScreen("reveal");
  showRevealScreen();
}

// ----- Revelar rol (mantener presionado) -----
function showRevealScreen() {
  const playerName = players[currentRevealIndex];
  revealTitle.textContent = `Pásale el dispositivo a: ${playerName}`;
  roleText.textContent = "";
}

function showRole() {
  if (currentRevealIndex === impostorIndex) {
    roleText.textContent = "😈 Eres el impostor";
  } else {
    roleText.textContent = `La palabra es: ${secretWord}`;
  }
}

function hideRole() {
  roleText.textContent = "";
}

// Mouse (PC)
holdRevealBtn.addEventListener("mousedown", showRole);
holdRevealBtn.addEventListener("mouseup", hideRole);
holdRevealBtn.addEventListener("mouseleave", hideRole);

// Touch (móvil)
holdRevealBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  showRole();
});
holdRevealBtn.addEventListener("touchend", hideRole);

nextPlayerBtn.addEventListener("click", () => {
  currentRevealIndex++;
  if (currentRevealIndex < players.length) {
    showRevealScreen();
  } else {
    startRound();
  }
});

// ----- Rondas -----
function startRound() {
  showScreen("round");

  startPlayerIndex = randIndex(players.length);

  const order = [];
  for (let i = 0; i < players.length; i++) {
    order.push(players[(startPlayerIndex + i) % players.length]);
  }

  roundTitle.textContent = `Ronda ${round}`;
  startPlayerText.textContent = `Empieza: ${players[startPlayerIndex]}`;

  // Pintar el orden y resaltar al que empieza
  orderContainer.innerHTML = "";
  order.forEach((name, idx) => {
    const div = document.createElement("div");
    div.className = "player" + (idx === 0 ? " active" : "");
    div.textContent = name;
    orderContainer.appendChild(div);
  });
}


goDecisionBtn.addEventListener("click", () => {
  showScreen("decision");
});

// ----- Decisión -----
yesBtn.addEventListener("click", () => {
  // Descubrieron al impostor -> gana el grupo
  showResult(true);
});

noBtn.addEventListener("click", () => {
  if (round === 1) {
    round = 2;
    startRound();
  } else {
    // No lo descubrieron en 2 rondas -> gana el impostor
    showResult(false);
  }
});

// ----- Resultado -----
function showResult(groupWon) {
  showScreen("result");

  if (groupWon) {
    resultTitle.textContent = "🎉 ¡Gana el grupo!";
  } else {
    resultTitle.textContent = "😈 ¡Gana el impostor!";
  }

  resultImpostor.textContent = `El impostor era: ${players[impostorIndex]}`;
  resultWord.textContent = `La palabra era: ${secretWord}`;
}

restartBtn.addEventListener("click", () => {
  // Volver a la pantalla de jugadores, pero CONSERVANDO la lista
  showScreen("add");
  renderPlayers();
});

