// Simple helper: on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Role switcher
  const roleTabs = document.getElementById("roleTabs");
  const roleText = document.getElementById("roleText");

  const ROLE_COPY = {
    gamer:
      "As a <strong>Gamer</strong>, I love exploring new worlds, mastering game mechanics, and learning from every match.",
    creator:
      "As a <strong>Game Creator</strong>, I imagine new levels, stories, characters, and mechanics that could turn into real games one day.",
    esports:
      "As an <strong>Esports Enthusiast</strong>, I enjoy watching pro plays, breaking down strategies, and leading my own squad with smart call‑outs.",
  };

  if (roleTabs && roleText) {
    roleTabs.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const role = target.dataset.role;
      if (!role || !(role in ROLE_COPY)) return;

      for (const btn of roleTabs.querySelectorAll(".pill")) {
        btn.classList.remove("pill--active");
      }
      target.classList.add("pill--active");

      roleText.innerHTML = ROLE_COPY[role];
    });
  }

  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    const stored = window.localStorage.getItem("abhinav-theme");
    if (stored === "light") {
      document.body.classList.add("theme-light");
    }

    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("theme-light");
      const mode = document.body.classList.contains("theme-light")
        ? "light"
        : "dark";
      window.localStorage.setItem("abhinav-theme", mode);
    });
  }

  // Stat counters
  const counters = document.querySelectorAll(".hero-stat-number[data-target]");
  const animateCounters = () => {
    counters.forEach((counter) => {
      const targetStr = counter.getAttribute("data-target");
      if (!targetStr) return;
      const target = parseInt(targetStr, 10);
      if (Number.isNaN(target)) return;

      let current = 0;
      const duration = 900;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        current = Math.floor(progress * target);
        counter.textContent = current.toString();
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target.toString();
        }
      };

      requestAnimationFrame(step);
    });
  };

  // Animate when hero is in view
  const heroSection = document.getElementById("hero");
  if (heroSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(heroSection);
  } else {
    animateCounters();
  }

  // Simple scroll reveal for cards/sections
  const revealEls = document.querySelectorAll(
    ".section, .card, .hero-card, .timeline-item"
  );

  const addRevealClass = (el) => {
    el.classList.add("reveal-in");
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            addRevealClass(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach(addRevealClass);
  }

  // Fake form submit (front‑end only)
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      alert(
        "Thanks for your message! In a real version of this portfolio, this form would send your message to Abhinav."
      );
      contactForm.reset();
    });
  }
});

