document.addEventListener("DOMContentLoaded", () => {
  const optionsContainer = document.getElementById("rps-options");
  const optionButtons = document.querySelectorAll(".rps-option");
  const heroStatus = document.getElementById("rps-status");
  const roundsCount = document.querySelector("#rps-timer .timer-value");
  const resultText = document.getElementById("round-result");
  const playerChoiceText = document.getElementById("player-choice");
  const computerChoiceText = document.getElementById("computer-choice");
  const winsCount = document.getElementById("wins-count");
  const lossesCount = document.getElementById("losses-count");
  const tiesCount = document.getElementById("ties-count");
  const resetButton = document.getElementById("reset-score");

  const WINS_TO_FINISH = 3;
  const choices = ["rock", "paper", "scissors"];
  const choiceLabels = {
    rock: "🪨 حجر",
    paper: "📄 ورقة",
    scissors: "✂️ مقص",
  };

  const outcomeMessages = {
    win: "أحسنت! فزت في هذه الجولة.",
    lose: "خسرت هذه الجولة. حاول مرة أخرى!",
    tie: "تعادلنا هذه المرة!",
  };

  const state = {
    wins: 0,
    losses: 0,
    ties: 0,
    isMatchOver: false,
  };

  function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
  }

  function determineResult(player, computer) {
    if (player === computer) {
      return "tie";
    }

    const winningPairs = {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    };

    return winningPairs[player] === computer ? "win" : "lose";
  }

  function updateScoreboard() {
    winsCount.textContent = state.wins.toString();
    lossesCount.textContent = state.losses.toString();
    tiesCount.textContent = state.ties.toString();
    roundsCount.textContent = (state.wins + state.losses + state.ties).toString();
  }

  function setOptionsDisabled(disabled) {
    optionButtons.forEach((button) => {
      button.disabled = disabled;
    });
  }

  function finishMatchIfNeeded() {
    if (state.wins < WINS_TO_FINISH && state.losses < WINS_TO_FINISH) {
      return;
    }

    const playerWon = state.wins >= WINS_TO_FINISH;
    state.isMatchOver = true;
    setOptionsDisabled(true);
    resultText.textContent = playerWon
      ? `🏆 فزت بالمباراة ${state.wins} - ${state.losses}!`
      : `💻 فاز الحاسوب بالمباراة ${state.losses} - ${state.wins}. جرّب مرة أخرى!`;
    resultText.classList.toggle("success", playerWon);
    resultText.classList.toggle("error", !playerWon);
    heroStatus.textContent = playerWon ? "🏆 فوز!" : "انتهت المباراة";
    resetButton.textContent = "مباراة جديدة";
    resetButton.focus();
  }

  function updateRoundDetails(player, computer) {
    playerChoiceText.textContent = choiceLabels[player] ?? "-";
    computerChoiceText.textContent = choiceLabels[computer] ?? "-";
  }

  function updateResultMessage(result) {
    const message = outcomeMessages[result];

    resultText.textContent = message ?? "";
    resultText.classList.remove("success", "error");

    if (result === "win") {
      resultText.classList.add("success");
    } else if (result === "lose") {
      resultText.classList.add("error");
    }
  }

  function handlePlayerChoice(choice) {
    if (state.isMatchOver) {
      return;
    }

    const computerChoice = getComputerChoice();
    const result = determineResult(choice, computerChoice);

    state.wins += Number(result === "win");
    state.losses += Number(result === "lose");
    state.ties += Number(result === "tie");

    updateRoundDetails(choice, computerChoice);
    updateResultMessage(result);
    updateScoreboard();
    heroStatus.textContent = "المباراة جارية";
    finishMatchIfNeeded();
  }

  function resetGame() {
    state.wins = 0;
    state.losses = 0;
    state.ties = 0;
    state.isMatchOver = false;
    updateScoreboard();
    setOptionsDisabled(false);
    heroStatus.textContent = "جاهز للتحدي";
    resetButton.textContent = "إعادة ضبط النتائج";

    playerChoiceText.textContent = "-";
    computerChoiceText.textContent = "-";
    resultText.textContent = `اختر خيارك لبدء التحدي! أول من يصل إلى ${WINS_TO_FINISH} انتصارات يفوز.`;
    resultText.classList.remove("success", "error");
  }

  optionsContainer.addEventListener("click", (event) => {
    const button = event.target.closest(".rps-option");

    if (!button) {
      return;
    }

    const { choice } = button.dataset;

    if (!choices.includes(choice)) {
      return;
    }

    handlePlayerChoice(choice);
  });

  resetButton.addEventListener("click", resetGame);

  resetGame();
});
