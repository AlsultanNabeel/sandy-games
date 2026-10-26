document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("memory-grid");
  const movesText = document.getElementById("memory-moves");
  const pairsText = document.getElementById("memory-pairs");
  const message = document.getElementById("memory-message");
  const heroStatus = document.getElementById("memory-status");
  const bestText = document.getElementById("memory-best");
  const restartButton = document.getElementById("memory-restart");

  const SYMBOLS = ["🍎", "🚀", "🐱", "⚽", "🎵", "🌙", "🍕", "🎈"];
  const MAX_MOVES = 20;
  const FLIP_BACK_DELAY = 800;

  let cards = [];
  let firstCard = null;
  let isLocked = false;
  let movesLeft = MAX_MOVES;
  let matchedPairs = 0;
  let isGameOver = false;
  let bestMoves = null;

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function setMessage(text, status) {
    message.textContent = text;
    message.classList.remove("success", "error");
    if (status) {
      message.classList.add(status);
    }
  }

  function updateCounters() {
    movesText.textContent = movesLeft.toString();
    pairsText.textContent = matchedPairs.toString();
  }

  function revealCard(card) {
    card.classList.add("is-flipped");
    card.textContent = card.dataset.symbol;
    card.setAttribute("aria-label", `بطاقة ${card.dataset.symbol}`);
  }

  function hideCard(card) {
    card.classList.remove("is-flipped");
    card.textContent = "?";
    card.setAttribute("aria-label", "بطاقة مقلوبة");
  }

  function endGame(isWin) {
    isGameOver = true;
    cards.forEach((card) => {
      card.disabled = true;
      if (!isWin) revealCard(card);
    });

    if (isWin) {
      const usedMoves = MAX_MOVES - movesLeft;
      if (bestMoves === null || usedMoves < bestMoves) {
        bestMoves = usedMoves;
        bestText.textContent = `${bestMoves} محاولة`;
      }
      heroStatus.textContent = "🏆 فوز!";
      setMessage(`أحسنت! طابقت كل الأزواج في ${usedMoves} محاولة.`, "success");
    } else {
      heroStatus.textContent = "خسارة";
      setMessage("انتهت المحاولات! هذه أماكن البطاقات، جرّب مرة أخرى.", "error");
    }
    restartButton.focus();
  }

  function handleCardClick(card) {
    if (isLocked || isGameOver || card === firstCard || card.classList.contains("is-matched")) {
      return;
    }

    revealCard(card);

    if (!firstCard) {
      firstCard = card;
      heroStatus.textContent = "اللعبة جارية";
      return;
    }

    const secondCard = card;
    movesLeft -= 1;

    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      [firstCard, secondCard].forEach((matched) => {
        matched.classList.add("is-matched");
        matched.disabled = true;
      });
      firstCard = null;
      matchedPairs += 1;
      updateCounters();

      if (matchedPairs === SYMBOLS.length) {
        endGame(true);
      } else if (movesLeft === 0) {
        endGame(false);
      } else {
        setMessage("تطابق! استمر.", "success");
      }
      return;
    }

    updateCounters();

    if (movesLeft === 0) {
      firstCard = null;
      endGame(false);
      return;
    }

    setMessage("ليستا متطابقتين، تذكّر مكانهما.", "error");
    isLocked = true;
    const cardToHide = firstCard;
    firstCard = null;
    setTimeout(() => {
      hideCard(cardToHide);
      hideCard(secondCard);
      isLocked = false;
    }, FLIP_BACK_DELAY);
  }

  function startGame() {
    firstCard = null;
    isLocked = false;
    isGameOver = false;
    movesLeft = MAX_MOVES;
    matchedPairs = 0;
    updateCounters();
    heroStatus.textContent = "جاهز للعب";
    setMessage("اقلب أول بطاقة للبدء!", null);

    grid.innerHTML = "";
    cards = shuffle([...SYMBOLS, ...SYMBOLS]).map((symbol) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "memory-card";
      card.dataset.symbol = symbol;
      hideCard(card);
      card.addEventListener("click", () => handleCardClick(card));
      grid.appendChild(card);
      return card;
    });
  }

  restartButton.addEventListener("click", startGame);

  startGame();
});
