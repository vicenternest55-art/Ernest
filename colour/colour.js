/* =========================
   VixMedia Pro JS:
   - Dark/Light toggle (saved)
   - Smooth scroll for anchor links
   - Scroll reveal animations (IntersectionObserver)
   - Section active highlight + progress bar
========================= */

(function () {
  const root = document.documentElement;

  // ---------- Theme (Dark/Light) ----------
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);

  const toggleBtn = document.querySelector("[data-theme-toggle]");
  if (toggleBtn) {
    const syncLabel = () => {
      const isDark = root.getAttribute("data-theme") === "dark";
      toggleBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
      toggleBtn.setAttribute("aria-pressed", String(isDark));
    };
    syncLabel();

    toggleBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      syncLabel();
    });
  }

  // ---------- Smooth scroll (anchors) ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Update URL without jumping
      history.pushState(null, "", id);
    });
  });

  // ---------- Scroll progress ----------
  const progress = document.querySelector(".progress");
  const updateProgress = () => {
    if (!progress) return;
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progress.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // ---------- Reveal animations (IntersectionObserver) ----------
  const revealEls = document.querySelectorAll(".reveal, [data-stagger]");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in-view");
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  revealEls.forEach((el) => io.observe(el));

  // ---------- Optional: highlight active nav link by section ----------
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.navlinks a[href^="#"]');

  if (sections.length && navLinks.length) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.style.borderColor = isActive ? "var(--border)" : "transparent";
        link.style.background = isActive ? "color-mix(in srgb, var(--card) 75%, transparent)" : "transparent";
        link.style.color = isActive ? "var(--text)" : "var(--muted)";
      });
    };

    const secObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.55 }
    );

    sections.forEach((s) => secObserver.observe(s));
  }
})();