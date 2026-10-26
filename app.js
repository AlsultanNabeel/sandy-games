// تفاعلات خفيفة مشتركة. الموقع يعمل بالكامل بدون هذا الملف.
document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

  document.querySelectorAll("a[data-scroll]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) {
        return;
      }

      const targetElement = targetId === "#top" ? document.body : document.querySelector(targetId);
      if (!targetElement) {
        return;
      }

      event.preventDefault();
      if (targetId === "#top") {
        window.scrollTo({ top: 0, behavior: scrollBehavior });
      } else {
        targetElement.scrollIntoView({ behavior: scrollBehavior });
      }
      history.replaceState(null, "", targetId);
    });
  });

  const yearElement = document.querySelector("[data-year]");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
});
