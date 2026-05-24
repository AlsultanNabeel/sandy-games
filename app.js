document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("a[data-scroll]");
  const backToTop = document.querySelector(".back-to-top");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
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

  const heroSection = document.querySelector(".hero");
  const heroAnimatedElements = document.querySelectorAll("[data-animate=\"fade-up\"]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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
