document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-reaction");
  const targetButton = document.getElementById("reaction-target");
  const resetButton = document.getElementById("reset-reaction");
  const message = document.getElementById("reaction-message");
  const result = document.getElementById("reaction-result");
  const heroStatus = document.getElementById("reaction-status");
  const bestValue = document.querySelector("#reaction-timer .timer-value");

  const STATUS_CLASSES = ["success", "error"];

  const panelStates = {
    idle: { text: "جاهز؟", className: "waiting", disabled: true },
    // الزر مفعّل أثناء الانتظار حتى نلتقط النقر المبكر
    ready: { text: "استعد...", className: "ready", disabled: false },
    go: { text: "ابدأ!", className: "go", disabled: false },
    early: { text: "سابق لأوانه!", className: "early", disabled: true },
  };

  const MIN_DELAY = 1500;
  const MAX_DELAY = 3500;
  // أقل من هذا الزمن تُحسب الجولة فوزًا
  const WIN_THRESHOLD_MS = 400;

  let startTime = 0;
  let waitTimeout = null;
  let phase = "idle"; // idle | waiting | go
  let bestTime = null;

  function setMessage(text, status) {
    message.textContent = text;
    message.classList.remove(...STATUS_CLASSES);
    if (status) {
      message.classList.add(status);
    }
  }

  function updateTarget(stateName) {
    const state = panelStates[stateName];
    targetButton.textContent = state.text;
    targetButton.disabled = state.disabled;
    targetButton.classList.remove(...Object.values(panelStates).map((panel) => panel.className));
    targetButton.classList.add(state.className);
  }

  function endRound() {
    clearTimeout(waitTimeout);
    waitTimeout = null;
    phase = "idle";
    startButton.disabled = false;
    startButton.textContent = "جولة أخرى";
    resetButton.hidden = false;
  }

  function startRound() {
    if (phase !== "idle") {
      return;
    }

    phase = "waiting";
    result.textContent = "-";
    startButton.disabled = true;
    resetButton.hidden = true;
    heroStatus.textContent = "انتظر الإشارة...";
    setMessage("لا تنقر حتى تظهر كلمة ابدأ!", null);
    updateTarget("ready");

    const delay = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
    waitTimeout = setTimeout(() => {
      phase = "go";
      updateTarget("go");
      setMessage("انقر الآن!", "success");
      startTime = performance.now();
    }, delay);
  }

  function handleTargetClick() {
    if (phase === "waiting") {
      endRound();
      updateTarget("early");
      heroStatus.textContent = "خسارة";
      setMessage("نقرت مبكرًا جدًا! خسرت هذه الجولة، حاول مجددًا.", "error");
      return;
    }

    if (phase !== "go") {
      return;
    }

    const reactionTimeMs = Math.round(performance.now() - startTime);
    endRound();
    updateTarget("idle");
    result.textContent = `${reactionTimeMs} مللي ثانية`;

    if (bestTime === null || reactionTimeMs < bestTime) {
      bestTime = reactionTimeMs;
      bestValue.textContent = `${bestTime} ms`;
    }

    if (reactionTimeMs < WIN_THRESHOLD_MS) {
      heroStatus.textContent = "🏆 فوز!";
      setMessage(`أداء رائع! ${reactionTimeMs} مللي ثانية — أسرع من ${WIN_THRESHOLD_MS}.`, "success");
    } else {
      heroStatus.textContent = "خسارة";
      setMessage(`${reactionTimeMs} مللي ثانية. تحتاج أقل من ${WIN_THRESHOLD_MS} للفوز، حاول أسرع!`, "error");
    }
  }

  function handleReset() {
    clearTimeout(waitTimeout);
    waitTimeout = null;
    phase = "idle";
    bestTime = null;
    bestValue.textContent = bestValue.dataset.fallback || "∞";
    result.textContent = "-";
    startButton.disabled = false;
    startButton.textContent = "ابدأ الجولة";
    resetButton.hidden = true;
    heroStatus.textContent = "في وضع الهدوء";
    updateTarget("idle");
    setMessage("اضغط زر البدء لبدء الجولة.", null);
  }

  startButton.addEventListener("click", startRound);
  targetButton.addEventListener("click", handleTargetClick);
  resetButton.addEventListener("click", handleReset);

  handleReset();
});
