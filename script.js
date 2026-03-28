/* ============================================
   ABHINAV RAI – GAMING PORTFOLIO | script.js
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ── YEAR ─────────────────────────────────── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── PARTICLE CANVAS ─────────────────────── */
  const canvas = document.getElementById("particleCanvas");
  if (canvas && canvas instanceof HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    const PARTICLE_COUNT = 70;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.6 + 0.2,
      color: ["#7c6af7","#ff6bcb","#00e5ff"][Math.floor(Math.random() * 3)],
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        if (p.y < -5) p.y = H + 5;
        if (p.y > H + 5) p.y = -5;
      }
      ctx.globalAlpha = 1;
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = "#7c6af7";
            ctx.globalAlpha = (1 - dist / 120) * 0.12;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(drawParticles);
    }
    drawParticles();

    window.addEventListener("resize", () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    });
  }

  /* ── HAMBURGER / MOBILE NAV ──────────────── */
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
    });
    mobileNav.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => mobileNav.classList.remove("open"));
    });
  }

  /* ── ACTIVE NAV LINK ON SCROLL ───────────── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const observer_nav = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove("active"));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => observer_nav.observe(s));

  /* ── ROLE SWITCHER ───────────────────────── */
  const roleTabs = document.getElementById("roleTabs");
  const roleText = document.getElementById("roleText");
  const ROLE_COPY = {
    gamer:
      "As a <strong>Gamer</strong>, I love exploring new worlds, mastering mechanics, and learning from every match.",
    creator:
      "As a <strong>Game Creator</strong>, I imagine new levels, stories, characters, and mechanics that could become real games one day.",
    esports:
      "As an <strong>Esports Enthusiast</strong>, I enjoy watching pro plays, breaking down strategies, and leading my squad with smart call-outs.",
  };
  if (roleTabs && roleText) {
    roleTabs.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const role = target.dataset.role;
      if (!role || !(role in ROLE_COPY)) return;
      roleTabs.querySelectorAll(".pill").forEach((b) => b.classList.remove("pill--active"));
      target.classList.add("pill--active");
      roleText.style.opacity = "0";
      setTimeout(() => {
        roleText.innerHTML = ROLE_COPY[role];
        roleText.style.opacity = "1";
      }, 180);
    });
    roleText.style.transition = "opacity 0.2s ease";
  }

  /* ── THEME TOGGLE ────────────────────────── */
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    if (localStorage.getItem("abhinav-theme") === "light") {
      document.body.classList.add("theme-light");
    }
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("theme-light");
      localStorage.setItem(
        "abhinav-theme",
        document.body.classList.contains("theme-light") ? "light" : "dark"
      );
    });
  }

  /* ── STAT COUNTERS ───────────────────────── */
  const counters = document.querySelectorAll(".hero-stat-number[data-target]");
  let countersPlayed = false;
  const animateCounters = () => {
    if (countersPlayed) return;
    countersPlayed = true;
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"), 10);
      if (isNaN(target)) return;
      let current = 0;
      const duration = 1100;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(ease * target).toString();
        if (progress < 1) requestAnimationFrame(step);
        else counter.textContent = target.toString();
      };
      requestAnimationFrame(step);
    });
  };

  /* ── 3D CARD TILT ────────────────────────── */
  const tiltCards = document.querySelectorAll(".tilt-card");
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${cx * 10}deg) rotateX(${-cy * 10}deg) translateZ(8px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    });
  });

  /* ── SKILL BAR ANIMATION ─────────────────── */
  const skillBars = document.querySelectorAll(".skill-bar");
  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("animated"), 150);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  skillBars.forEach((bar) => skillObserver.observe(bar));

  /* ── GENERAL SCROLL REVEAL ───────────────── */
  const revealEls = document.querySelectorAll(".section, .card, .concept-card, .hero-card, .timeline-item");
  const delayMap = new Map();

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Stagger siblings
          const parent = el.parentElement;
          const siblings = parent ? [...parent.children].filter((c) =>
            c.classList.contains("card") ||
            c.classList.contains("concept-card") ||
            c.classList.contains("flip-card")
          ) : [];
          const idx = siblings.indexOf(el);
          const delay = idx >= 0 ? idx * 90 : 0;

          setTimeout(() => {
            el.classList.add("reveal-in");
            // If hero section, trigger counters
            if (el.id === "hero") animateCounters();
          }, delay);

          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ── FORM SUBMIT ─────────────────────────── */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button[type=submit]");
      if (btn) {
        btn.textContent = "✅ Message Sent!";
        btn.style.background = "linear-gradient(120deg, #00e5ff, #00ff88)";
        setTimeout(() => {
          btn.innerHTML = '<span class="btn-glow"></span>🚀 Send Message';
          btn.style.background = "";
        }, 3500);
      }
      contactForm.reset();
    });
  }

  /* ── CURSOR GLOW EFFECT ──────────────────── */
  const cursorGlow = document.createElement("div");
  cursorGlow.style.cssText = `
    position: fixed;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,106,247,0.07) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 0;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(cursorGlow);
  let mouseX = 0, mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorGlow.style.left = mouseX + "px";
    cursorGlow.style.top = mouseY + "px";
  });
  document.addEventListener("mouseleave", () => cursorGlow.style.opacity = "0");
  document.addEventListener("mouseenter", () => cursorGlow.style.opacity = "1");

  /* ── FLIP CARD ON MOBILE (TOUCH) ─────────── */
  document.querySelectorAll(".flip-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        const inner = card.querySelector(".flip-inner");
        if (inner) inner.style.transform =
          inner.style.transform === "rotateY(180deg)" ? "" : "rotateY(180deg)";
      }
    });
  });
});
