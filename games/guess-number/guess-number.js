document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guess-form");
  const guessInput = document.getElementById("guess-input");
  const feedback = document.getElementById("feedback");
  const attemptsRemaining = document.getElementById("attempts-remaining");
  const playAgainButton = document.getElementById("play-again");
  const submitButton = document.getElementById("submit-guess");

  const MAX_ATTEMPTS = 10;
  const MIN_NUMBER = 1;
  const MAX_NUMBER = 100;

  function getRandomNumber() {
    return Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
  }

  let secretNumber = getRandomNumber();
  let remainingAttempts = MAX_ATTEMPTS;
  let isGameOver = false;

  function resetGame() {
    secretNumber = getRandomNumber();
    remainingAttempts = MAX_ATTEMPTS;
    isGameOver = false;
    attemptsRemaining.textContent = remainingAttempts.toString();
    feedback.textContent = "ابدأ بالتخمين الآن!";
    feedback.classList.remove("success", "error");
    form.reset();
    guessInput.disabled = false;
    playAgainButton.hidden = true;
    guessInput.focus();
  }

  function endGame(message, isSuccess = false) {
    feedback.textContent = message;
    feedback.classList.toggle("success", isSuccess);
    feedback.classList.toggle("error", !isSuccess);
    isGameOver = true;
    guessInput.disabled = true;
    playAgainButton.hidden = false;
    playAgainButton.focus();
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isGameOver) {
      return;
    }

    triggerSubmitButtonAnimation();

    const guessValue = Number.parseInt(guessInput.value, 10);

    if (Number.isNaN(guessValue)) {
      feedback.textContent = "رجاءً أدخل رقمًا صالحًا.";
      feedback.classList.add("error");
      return;
    }

    if (guessValue < MIN_NUMBER || guessValue > MAX_NUMBER) {
      feedback.textContent = `الرجاء اختيار رقم بين ${MIN_NUMBER} و ${MAX_NUMBER}.`;
      feedback.classList.add("error");
      return;
    }

    remainingAttempts -= 1;
    attemptsRemaining.textContent = remainingAttempts.toString();

    if (guessValue === secretNumber) {
      endGame("رائع! لقد خمنت الرقم الصحيح!", true);
      return;
    }

    if (remainingAttempts === 0) {
      endGame(`للأسف، انتهت المحاولات. الرقم الصحيح هو ${secretNumber}.`);
      return;
    }

    feedback.textContent = guessValue > secretNumber ? "رقمك أعلى من المطلوب." : "رقمك أقل من المطلوب.";
    feedback.classList.add("error");
    feedback.classList.remove("success");
    guessInput.select();
  });

  playAgainButton.addEventListener("click", resetGame);

  resetGame();
});