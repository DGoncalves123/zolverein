document.addEventListener("DOMContentLoaded", () => {
  // Entity filter
  const legendButtons = document.querySelectorAll(".legend-btn");
  const entries = document.querySelectorAll(".timeline-entry");
  let activeFilter = null;

  legendButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const entity = btn.dataset.entity;

      if (activeFilter === entity) {
        activeFilter = null;
        btn.classList.remove("active");
        entries.forEach(e => e.classList.remove("dimmed"));
      } else {
        activeFilter = entity;
        legendButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        entries.forEach(entry => {
          const tags = entry.dataset.entities || "";
          if (tags.split(" ").includes(entity)) {
            entry.classList.remove("dimmed");
          } else {
            entry.classList.add("dimmed");
          }
        });
      }
    });
  });

  // Scroll animation
  const observer = new IntersectionObserver(
    (items) => {
      items.forEach(item => {
        if (item.isIntersecting) {
          item.target.classList.add("visible");
          observer.unobserve(item.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  entries.forEach(entry => {
    entry.classList.add("hidden");
    observer.observe(entry);
  });

  // Back to top
  const topBtn = document.querySelector(".back-to-top");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      topBtn.classList.add("visible");
    } else {
      topBtn.classList.remove("visible");
    }
  });

  topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Return-to-timeline button
  const returnBtn = document.querySelector(".return-btn");
  let savedScrollPosition = null;

  function showReturnBtn(position) {
    savedScrollPosition = position;
    returnBtn.classList.add("visible");
  }

  returnBtn.addEventListener("click", () => {
    if (savedScrollPosition !== null) {
      window.scrollTo({ top: savedScrollPosition, behavior: "smooth" });
      returnBtn.classList.remove("visible");
      savedScrollPosition = null;
    }
  });

  // Hide return button if user scrolls back up to timeline area manually
  window.addEventListener("scroll", () => {
    if (savedScrollPosition !== null && window.scrollY < savedScrollPosition - 200) {
      returnBtn.classList.remove("visible");
      savedScrollPosition = null;
    }
  });

  // Language switcher
  const langBtns = document.querySelectorAll(".lang-btn");

  const translationsEN = {};
  document.querySelectorAll("[data-i18n]").forEach(el => {
    translationsEN[el.dataset.i18n] = el.innerHTML;
  });

  function applyLanguage(lang) {
    const dict = lang === "pt" ? (window.TRANSLATIONS_PT || {}) : translationsEN;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const val = dict[el.dataset.i18n];
      if (val !== undefined) el.innerHTML = val;
    });
    langBtns.forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    localStorage.setItem("zv-lang", lang);
  }

  const storedLang = localStorage.getItem("zv-lang");
  const browserLang = (navigator.language || "").toLowerCase();
  const initLang = storedLang || (browserLang.startsWith("pt") ? "pt" : "en");

  langBtns.forEach(btn => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
  });

  applyLanguage(initLang);

  // Glossary tooltip on hover
  document.querySelectorAll(".glossary-ref").forEach(ref => {
    ref.addEventListener("click", (e) => {
      e.preventDefault();
      const fromPosition = window.scrollY;
      const target = document.querySelector(ref.getAttribute("href"));
      if (target) {
        showReturnBtn(fromPosition);
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.style.background = "#ffeeba";
        setTimeout(() => {
          target.style.background = "";
        }, 2000);
      }
    });
  });

  // Cross-references: scroll to timeline entry
  document.querySelectorAll(".cross-ref").forEach(ref => {
    ref.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(ref.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        const card = target.querySelector(".entry-card");
        if (card) {
          card.style.boxShadow = "0 0 0 3px var(--accent)";
          setTimeout(() => {
            card.style.boxShadow = "";
          }, 2000);
        }
      }
    });
  });
});
