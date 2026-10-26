document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("ttt-board");
  const message = document.getElementById("ttt-message");
  const heroStatus = document.getElementById("ttt-status");
  const roundsText = document.getElementById("ttt-rounds");
  const winsText = document.getElementById("ttt-wins");
  const lossesText = document.getElementById("ttt-losses");
  const tiesText = document.getElementById("ttt-ties");
  const restartButton = document.getElementById("ttt-restart");

  const PLAYER = "X";
  const COMPUTER = "O";
  const COMPUTER_DELAY = 350;
  // احتمال أن يلعب الحاسوب حركة عشوائية حتى يبقى الفوز ممكنًا
  const COMPUTER_MISTAKE_CHANCE = 0.25;
  const LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const score = { wins: 0, losses: 0, ties: 0 };
  let cells = [];
  let marks = [];
  let isPlayerTurn = true;
  let isRoundOver = false;
  let computerTimeout = null;

  function setMessage(text, status) {
    message.textContent = text;
    message.classList.remove("success", "error");
    if (status) {
      message.classList.add(status);
    }
  }

  function findWinningLine(mark) {
    return LINES.find((line) => line.every((index) => marks[index] === mark)) || null;
  }

  function emptyIndexes() {
    return marks.map((mark, index) => (mark ? null : index)).filter((index) => index !== null);
  }

  function findCompletingMove(mark) {
    for (const line of LINES) {
      const lineMarks = line.map((index) => marks[index]);
      if (lineMarks.filter((value) => value === mark).length === 2 && lineMarks.includes(null)) {
        return line[lineMarks.indexOf(null)];
      }
    }
    return null;
  }

  function chooseComputerMove() {
    const free = emptyIndexes();
    const randomMove = free[Math.floor(Math.random() * free.length)];

    if (Math.random() < COMPUTER_MISTAKE_CHANCE) {
      return randomMove;
    }

    const winMove = findCompletingMove(COMPUTER);
    if (winMove !== null) return winMove;

    const blockMove = findCompletingMove(PLAYER);
    if (blockMove !== null) return blockMove;

    if (marks[4] === null) return 4;

    const corners = [0, 2, 6, 8].filter((index) => marks[index] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    return randomMove;
  }

  function placeMark(index, mark) {
    marks[index] = mark;
    const cell = cells[index];
    cell.textContent = mark;
    cell.dataset.mark = mark;
    cell.disabled = true;
    cell.setAttribute("aria-label", `خانة ${index + 1}: ${mark}`);
  }

  function updateScore() {
    winsText.textContent = score.wins.toString();
    lossesText.textContent = score.losses.toString();
    tiesText.textContent = score.ties.toString();
    roundsText.textContent = (score.wins + score.losses + score.ties).toString();
  }

  function finishRound(result, line) {
    isRoundOver = true;
    clearTimeout(computerTimeout);
    cells.forEach((cell) => {
      cell.disabled = true;
    });
    if (line) {
      line.forEach((index) => cells[index].classList.add("is-winning"));
    }

    if (result === "win") {
      score.wins += 1;
      heroStatus.textContent = "🏆 فوز!";
      setMessage("أحسنت! هزمت الحاسوب.", "success");
    } else if (result === "lose") {
      score.losses += 1;
      heroStatus.textContent = "خسارة";
      setMessage("فاز الحاسوب هذه المرة. جرّب جولة جديدة!", "error");
    } else {
      score.ties += 1;
      heroStatus.textContent = "تعادل";
      setMessage("تعادل! لا أحد أكمل صفًا.", null);
    }
    updateScore();
    restartButton.focus();
  }

  function checkRoundEnd(mark) {
    const line = findWinningLine(mark);
    if (line) {
      finishRound(mark === PLAYER ? "win" : "lose", line);
      return true;
    }
    if (emptyIndexes().length === 0) {
      finishRound("tie", null);
      return true;
    }
    return false;
  }

  function computerTurn() {
    placeMark(chooseComputerMove(), COMPUTER);
    if (checkRoundEnd(COMPUTER)) {
      return;
    }
    isPlayerTurn = true;
    heroStatus.textContent = "دورك";
    setMessage("دورك، اختر خانة.", null);
  }

  function handleCellClick(index) {
    if (!isPlayerTurn || isRoundOver || marks[index] !== null) {
      return;
    }

    placeMark(index, PLAYER);
    if (checkRoundEnd(PLAYER)) {
      return;
    }

    isPlayerTurn = false;
    heroStatus.textContent = "دور الحاسوب";
    setMessage("الحاسوب يفكر...", null);
    computerTimeout = setTimeout(computerTurn, COMPUTER_DELAY);
  }

  function startRound() {
    clearTimeout(computerTimeout);
    marks = Array(9).fill(null);
    isPlayerTurn = true;
    isRoundOver = false;
    heroStatus.textContent = "دورك";
    setMessage("دورك، اختر خانة.", null);

    board.innerHTML = "";
    cells = marks.map((_, index) => {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "ttt-cell";
      cell.setAttribute("aria-label", `خانة ${index + 1}: فارغة`);
      cell.addEventListener("click", () => handleCellClick(index));
      board.appendChild(cell);
      return cell;
    });
  }

  restartButton.addEventListener("click", startRound);

  updateScore();
  startRound();
});
