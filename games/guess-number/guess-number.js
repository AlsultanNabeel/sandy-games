document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guess-form");
  const guessInput = document.getElementById("guess-input");
  const feedback = document.getElementById("feedback");
  const attemptsRemaining = document.getElementById("attempts-remaining");
  const playAgainButton = document.getElementById("play-again");
  const submitButton = document.getElementById("submit-guess");
  const heroStatus = document.getElementById("hero-status");
  const winsTotal = document.getElementById("wins-total");
  const ATTEMPTS_ANIMATION_CLASS = "attempts-animate";

  const MAX_ATTEMPTS = 10;
  const MIN_NUMBER = 1;
  const MAX_NUMBER = 100;

  function getRandomNumber() {
    return Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
  }

  let secretNumber = getRandomNumber();
  let remainingAttempts = MAX_ATTEMPTS;
  let isGameOver = false;
  let wins = 0;

  function refreshAttemptsDisplay(value, { animate = true } = {}) {
    if (!attemptsRemaining) {
      return;
    }
    attemptsRemaining.classList.remove(ATTEMPTS_ANIMATION_CLASS);
    attemptsRemaining.textContent = value.toString();
    if (!animate) {
      return;
    }
    // Force reflow to restart the animation
    // eslint-disable-next-line no-unused-expressions
    attemptsRemaining.offsetWidth;
    attemptsRemaining.classList.add(ATTEMPTS_ANIMATION_CLASS);
  }

  function resetGame() {
    secretNumber = getRandomNumber();
    remainingAttempts = MAX_ATTEMPTS;
    isGameOver = false;
    refreshAttemptsDisplay(remainingAttempts, { animate: false });
    feedback.textContent = "ابدأ بالتخمين الآن!";
    feedback.classList.remove("success", "error");
    form.reset();
    guessInput.disabled = false;
    playAgainButton.hidden = true;
    submitButton.disabled = false;
    if (heroStatus) heroStatus.textContent = "جاهز للعب";
  }

  function endGame(message, isSuccess = false) {
    feedback.textContent = message;
    feedback.classList.toggle("success", isSuccess);
    feedback.classList.toggle("error", !isSuccess);
    isGameOver = true;
    guessInput.disabled = true;
    submitButton.disabled = true;
    if (heroStatus) heroStatus.textContent = isSuccess ? "🏆 فوز!" : "انتهت اللعبة";
    playAgainButton.hidden = false;
  }

  function triggerSubmitButtonAnimation() {
    if (!submitButton || submitButton.disabled) {
      return;
    }
    submitButton.classList.remove("guess-button-animate");
    // Force a reflow to restart the animation when class is re-added
    // eslint-disable-next-line no-unused-expressions
    submitButton.offsetWidth;
    submitButton.classList.add("guess-button-animate");
  }

  if (submitButton) {
    submitButton.addEventListener("animationend", () => {
      submitButton.classList.remove("guess-button-animate");
    });
  }

  if (attemptsRemaining) {
    attemptsRemaining.addEventListener("animationend", () => {
      attemptsRemaining.classList.remove(ATTEMPTS_ANIMATION_CLASS);
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isGameOver) {
      return;
    }

    triggerSubmitButtonAnimation();

    const guessValue = Number.parseInt(guessInput.value, 10);

    if (Number.isNaN(guessValue)) {
      feedback.textContent = "رجاءً أدخل رقمًا صالحًا.";
      feedback.classList.remove("success");
      feedback.classList.add("error");
      return;
    }

    if (guessValue < MIN_NUMBER || guessValue > MAX_NUMBER) {
      feedback.textContent = `الرجاء اختيار رقم بين ${MIN_NUMBER} و ${MAX_NUMBER}.`;
      feedback.classList.remove("success");
      feedback.classList.add("error");
      return;
    }

    remainingAttempts -= 1;
    refreshAttemptsDisplay(remainingAttempts);

    if (guessValue === secretNumber) {
      wins += 1;
      if (winsTotal) winsTotal.textContent = wins.toString();
      endGame("رائع! لقد خمنت الرقم الصحيح!", true);
      return;
    }

    if (remainingAttempts === 0) {
      endGame(`للأسف، انتهت المحاولات. الرقم الصحيح هو ${secretNumber}.`);
      return;
    }

    feedback.textContent =
      guessValue > secretNumber ? `${guessValue}: رقمك أعلى من المطلوب ⬇️` : `${guessValue}: رقمك أقل من المطلوب ⬆️`;
    feedback.classList.add("error");
    feedback.classList.remove("success");
    guessInput.select();
  });

  playAgainButton.addEventListener("click", () => {
    resetGame();
    guessInput.focus();
  });

  resetGame();
});
