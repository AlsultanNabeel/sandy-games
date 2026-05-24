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
});
