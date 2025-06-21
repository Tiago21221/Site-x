// Alternar exibição
document.getElementById("abrirMines").onclick = () => {
  document.getElementById("jogoMines").classList.remove("hidden");
  document.getElementById("jogoDouble").classList.add("hidden");
};

document.getElementById("abrirDouble").onclick = () => {
  document.getElementById("jogoDouble").classList.remove("hidden");
  document.getElementById("jogoMines").classList.add("hidden");
};

// ----------- MINES -----------
let bombPositions = [];
let revealedCount = 0;
let gameActive = false;

function startGame() {
  const bombCount = parseInt(document.getElementById("bombCount").value);
  if (bombCount < 1 || bombCount > 24) {
    alert("Escolha entre 1 e 24 bombas.");
    return;
  }

  bombPositions = [];
  revealedCount = 0;
  gameActive = true;
  document.getElementById("statusText").textContent = "";
  document.getElementById("cashoutBtn").disabled = false;

  while (bombPositions.length < bombCount) {
    const pos = Math.floor(Math.random() * 25);
    if (!bombPositions.includes(pos)) bombPositions.push(pos);
  }

  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.onclick = () => revealCell(cell);
    grid.appendChild(cell);
  }
}

function revealCell(cell) {
  if (!gameActive || cell.classList.contains("revealed")) return;
  const index = parseInt(cell.dataset.index);

  if (bombPositions.includes(index)) {
    cell.classList.add("bomb");
    cell.textContent = "💣";
    endGame(false);
  } else {
    cell.classList.add("revealed");
    cell.textContent = "💎";
    revealedCount++;
    if (revealedCount + bombPositions.length === 25) {
      endGame(true);
    }
  }
}

function endGame(won) {
  gameActive = false;
  document.getElementById("cashoutBtn").disabled = true;

  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.onclick = null;
    const idx = parseInt(cell.dataset.index);
    if (bombPositions.includes(idx)) {
      cell.classList.add("bomb");
      cell.textContent = "💣";
    }
  });

  document.getElementById("statusText").textContent = won
    ? "🎉 Você venceu!"
    : "💥 Você perdeu!";
}

function cashout() {
  if (!gameActive) return;
  gameActive = false;
  document.getElementById("cashoutBtn").disabled = true;
  document.getElementById("statusText").textContent = `✅ Retirada com ${revealedCount} diamantes!`;
}

// ----------- DOUBLE -----------
function apostar(cor) {
  const cores = ["vermelho", "preto", "verde"];
  const sorteio = cores[Math.floor(Math.random() * 15)];

  let resultado = sorteio;
  if (Math.random() < 1 / 15) resultado = "verde";
  else resultado = Math.random() < 0.5 ? "vermelho" : "preto";

  document.getElementById("roleta").textContent = "Girando...";
  document.getElementById("resultadoDouble").textContent = "";

  setTimeout(() => {
    document.getElementById("roleta").textContent = resultado.toUpperCase();

    if (cor === resultado) {
      let premio = resultado === "verde" ? "x14" : "x2";
      document.getElementById("resultadoDouble").textContent = `🎉 Você ganhou! Multiplicador: ${premio}`;
    } else {
      document.getElementById("resultadoDouble").textContent = `💥 Você perdeu! Caiu ${resultado}`;
    }
  }, 1500);
}

// Mostrar Jogo NÚMEROS
document.getElementById("abrirNumeros").onclick = () => {
  document.getElementById("jogoMines").classList.add("hidden");
  document.getElementById("jogoDouble").classList.add("hidden");
  document.getElementById("jogoNumeros").classList.remove("hidden");
};

function sortearNumero() {
  const escolhido = parseInt(document.getElementById("numeroEscolhido").value);
  const resultado = Math.floor(Math.random() * 10) + 1;

  if (!escolhido || escolhido < 1 || escolhido > 10) {
    document.getElementById("resultadoNumeros").textContent = "⛔ Escolha um número entre 1 e 10.";
    return;
  }

  if (escolhido === resultado) {
    document.getElementById("resultadoNumeros").textContent = `🎉 Parabéns! Você escolheu ${escolhido} e o número sorteado foi ${resultado}. Você ganhou!`;
  } else {
    document.getElementById("resultadoNumeros").textContent = `❌ Que pena! Você escolheu ${escolhido}, mas o número sorteado foi ${resultado}.`;
  }
}

let jogoAtivo = null;
let saldo = 1000;

function atualizarSaldo(valor) {
  saldo += valor;
  document.getElementById("saldo").textContent = saldo;
}

function toggleJogo(jogo) {
  const jogos = ['mines', 'double', 'numeros', 'dados', 'maior', 'roletaSimples'];
  jogos.forEach(j => {
    const el = document.getElementById(`jogo-${j}`);
    if (j === jogo) {
      el.style.display = (el.style.display === 'block') ? 'none' : 'block';
      jogoAtivo = el.style.display === 'block' ? j : null;
    } else {
      document.getElementById(`jogo-${j}`).style.display = 'none';
    }
  });
}

function sortearNumero() {
  const escolhido = parseInt(document.getElementById("numeroEscolhido").value);
  const resultado = Math.floor(Math.random() * 10) + 1;
  if (escolhido === resultado) {
    atualizarSaldo(100);
    document.getElementById("resultadoNumeros").textContent = `🎉 Você acertou! Número sorteado: ${resultado}`;
  } else {
    atualizarSaldo(-50);
    document.getElementById("resultadoNumeros").textContent = `❌ Você errou! Número sorteado: ${resultado}`;
  }
}

function jogarDados() {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  const soma = d1 + d2;
  const ganho = soma >= 7 ? 75 : -50;
  atualizarSaldo(ganho);
  document.getElementById("resultadoDados").textContent = `🎲 Dados: ${d1} e ${d2} | Soma: ${soma} | ${ganho > 0 ? 'Ganhou!' : 'Perdeu!'}`;
}

let numeroBase = null;
function sortearBase() {
  numeroBase = Math.floor(Math.random() * 50) + 1;
  document.getElementById("baseNumero").textContent = `Número base: ${numeroBase}`;
}

function adivinhar(escolha) {
  if (numeroBase === null) return;
  const novo = Math.floor(Math.random() * 50) + 1;
  const acertou = (escolha === 'maior' && novo > numeroBase) || (escolha === 'menor' && novo < numeroBase);
  atualizarSaldo(acertou ? 70 : -40);
  document.getElementById("resultadoMaior").textContent = `Número novo: ${novo} | ${acertou ? 'Você acertou!' : 'Errou!'}`;
  numeroBase = null;
}

function jogarRoletaSimples() {
  const escolha = parseInt(document.getElementById("apostaRoleta").value);
  const resultado = Math.floor(Math.random() * 10);
  if (escolha === resultado) {
    atualizarSaldo(200);
    document.getElementById("resultadoRoletaSimples").textContent = `🎯 Você acertou! Caiu ${resultado}`;
  } else {
    atualizarSaldo(-50);
    document.getElementById("resultadoRoletaSimples").textContent = `❌ Errou! Caiu ${resultado}`;
  }
}
