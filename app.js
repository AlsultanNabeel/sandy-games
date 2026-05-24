document.addEventListener("DOMContentLoaded", () => {
  const canUseMatchMedia = typeof window.matchMedia === "function";
  const navLinks = document.querySelectorAll("a[data-scroll]");
  const backToTop = document.querySelector(".back-to-top");
  const gameCards = document.querySelectorAll(".game-card");
  const prefersReducedMotion = canUseMatchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };
  const supportsHover = canUseMatchMedia ? window.matchMedia("(hover: hover)").matches : false;
  const supportsPointerFine = canUseMatchMedia ? window.matchMedia("(pointer: fine)").matches : false;

      const targetId = link.getAttribute("href");

      if (targetId.startsWith("#")) {
        event.preventDefault();
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function addCardState(card, stateClass) {
    card.classList.add(stateClass);
  }

  function removeCardState(card, stateClass) {
    card.classList.remove(stateClass);
  }

  function setupCardInteractions() {
    gameCards.forEach((card) => {
      const interactiveElements = card.querySelectorAll("a, button, [tabindex]");

      if (supportsHover && supportsPointerFine) {
        card.addEventListener("mouseenter", () => addCardState(card, "is-hovered"));
        card.addEventListener("mouseleave", () => removeCardState(card, "is-hovered"));
      } else {
        card.addEventListener("pointerenter", () => addCardState(card, "is-hovered"));
        card.addEventListener("pointerleave", () => removeCardState(card, "is-hovered"));
      }

      card.addEventListener("focusin", () => addCardState(card, "is-focused"));
      card.addEventListener("focusout", (event) => {
        if (!card.contains(event.relatedTarget)) {
          removeCardState(card, "is-focused");
        }
      });
      });

      interactiveElements.forEach((element) => {
        element.addEventListener("focus", () => addCardState(card, "is-focused"));
        element.addEventListener("blur", (event) => {
          const nextFocused = event.relatedTarget;
          if (!card.contains(nextFocused)) {
            removeCardState(card, "is-focused");
          }
        });
      });
    });
  }

  if (gameCards.length > 0) {
    setupCardInteractions();
  }

  const heroSection = document.querySelector(".hero");
  const heroAnimatedElements = document.querySelectorAll('[data-animate="fade-up"]');

  function activateHeroAnimations() {
    if (!heroSection) return;
    heroSection.classList.add("is-ready");
    heroAnimatedElements.forEach((element) => {
      const delay = parseInt(element.getAttribute("data-animate-delay") || "0", 10);
      element.style.setProperty("--hero-animate-delay", `${delay}ms`);
      element.classList.add("is-visible");
    });
  }

  if (!prefersReducedMotion.matches) {
    window.addEventListener("load", () => {
      requestAnimationFrame(activateHeroAnimations);
    });
  } else {
    activateHeroAnimations();
  }
});
