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
        document.querySelectorAll(".entity.highlight").forEach(e => e.classList.remove("highlight"));
      } else {
        activeFilter = entity;
        legendButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        entries.forEach(entry => {
          const tags = entry.dataset.entities || "";
          if (tags.includes(entity)) {
            entry.classList.remove("dimmed");
          } else {
            entry.classList.add("dimmed");
          }
        });

        document.querySelectorAll(".entity").forEach(el => {
          if (el.dataset.group === entity) {
            el.classList.add("highlight");
          } else {
            el.classList.remove("highlight");
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

  // Glossary tooltip on hover
  document.querySelectorAll(".glossary-ref").forEach(ref => {
    ref.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(ref.getAttribute("href"));
      if (target) {
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
