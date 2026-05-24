document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-reaction");
  const targetButton = document.getElementById("reaction-target");
  const resetButton = document.getElementById("reset-reaction");
  const message = document.getElementById("reaction-message");
  const result = document.getElementById("reaction-result");

  const STATUS_CLASSES = {
    success: "success",
    error: "error",
  };

  const panelStates = {
    idle: {
      text: "جاهز؟",
      className: "waiting",
      disabled: true,
    },
    ready: {
      text: "استعد...",
      className: "ready",
      disabled: true,
    },
    go: {
      text: "ابدأ!",
      className: "go",
      disabled: false,
    },
    early: {
      text: "سابق لأوانه!",
      className: "early",
      disabled: true,
    },
  };

  const MIN_DELAY = 1500;
  const MAX_DELAY = 3500;

  let startTime = 0;
  let waitTimeout = null;
  let isWaitingForGo = false;
  let isRoundActive = false;

  function setMessage(text, status) {
    message.textContent = text;
    message.classList.remove(...Object.values(STATUS_CLASSES));
    if (status && STATUS_CLASSES[status]) {
      message.classList.add(STATUS_CLASSES[status]);
    }
  }

  function updateTarget(stateName) {
    const state = panelStates[stateName];

    if (!state) {
      return;
    }

    targetButton.textContent = state.text;
    targetButton.disabled = state.disabled;
    targetButton.classList.remove(...Object.values(panelStates).map((panel) => panel.className));
    targetButton.classList.add(state.className);
  }

  function resetPanel() {
    clearTimeout(waitTimeout);
    waitTimeout = null;
    isWaitingForGo = false;
    isRoundActive = false;
    updateTarget("idle");
    resetButton.hidden = true;
    startButton.disabled = false;
  }

  function prepareRound() {
    resetPanel();
    result.textContent = "-";
    setMessage("استعد، سيتم إطلاق الإشارة قريبًا...", null);
    updateTarget("ready");
    startButton.disabled = true;
    resetButton.hidden = true;

    const delay = Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;

    waitTimeout = setTimeout(() => {
      updateTarget("go");
      setMessage("انقر الآن!", "success");
      startTime = performance.now();
      isWaitingForGo = false;
      isRoundActive = true;
    }, delay);

    isWaitingForGo = true;
  }

  function handleStartClick() {
    if (isRoundActive || isWaitingForGo) {
      return;
    }

    setMessage("لا تنقر حتى تظهر كلمة ابدأ!", null);
    prepareRound();
  }

  function handleTargetClick() {
    if (!isRoundActive) {
      if (isWaitingForGo) {
        clearTimeout(waitTimeout);
        waitTimeout = null;
        isWaitingForGo = false;
        updateTarget("early");
        setMessage("نقرت مبكرًا جدًا! حاول مجددًا.", "error");
        resetButton.hidden = false;
        startButton.disabled = false;
      }
      return;
    }
    const reactionTimeMs = Math.max(0, performance.now() - startTime);
    const formattedTime = reactionTimeMs.toFixed(2);
    result.textContent = `${formattedTime} مللي ثانية`;
    setMessage("أداء رائع! تريد المحاولة مرة أخرى؟", "success");
    updateTarget("idle");
    resetButton.hidden = false;
    startButton.disabled = false;
  }

  function handleReset() {
    resetPanel();
    setMessage("اضغط زر البدء لبدء الجولة.", null);
    result.textContent = "-";
  }

  startButton.addEventListener("click", handleStartClick);
  targetButton.addEventListener("click", handleTargetClick);
  resetButton.addEventListener("click", handleReset);

  // تهيئة الواجهة الأساسية
  handleReset();
});
