/* ==========================================
   ABHINAV RAI – GAMING & ANIME PORTFOLIO
   script.js
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ── YEAR ── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ══════════════════════════════════════════
     PARTICLE CANVAS
  ══════════════════════════════════════════ */
  const pCanvas = document.getElementById("particleCanvas");
  if (pCanvas instanceof HTMLCanvasElement) {
    const ctx = pCanvas.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;
    pCanvas.width = W; pCanvas.height = H;
    const COLORS = ["#7c6af7","#ffb7c5","#00e5ff","#ff8fab","#ffd700"];
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.8+.4,
      vx: (Math.random()-.5)*.3, vy: (Math.random()-.5)*.3,
      a: Math.random()*.5+.2,
      c: COLORS[Math.floor(Math.random()*COLORS.length)]
    }));
    const drawP = () => {
      ctx.clearRect(0,0,W,H);
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = p.c; ctx.globalAlpha = p.a; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x<-5) p.x=W+5; if (p.x>W+5) p.x=-5;
        if (p.y<-5) p.y=H+5; if (p.y>H+5) p.y=-5;
      }
      // connections
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if (d<110) { ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle="#ffb7c5"; ctx.globalAlpha=(1-d/110)*.1; ctx.lineWidth=1; ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(drawP);
    };
    drawP();
    window.addEventListener("resize", () => { W=window.innerWidth; H=window.innerHeight; pCanvas.width=W; pCanvas.height=H; });
  }

  /* ══════════════════════════════════════════
     SAKURA PETAL CANVAS
  ══════════════════════════════════════════ */
  const sCanvas = document.getElementById("sakuraCanvas");
  if (sCanvas instanceof HTMLCanvasElement) {
    const sc = sCanvas.getContext("2d");
    let SW = window.innerWidth, SH = window.innerHeight;
    sCanvas.width = SW; sCanvas.height = SH;

    const PETAL_COUNT = 22;
    const petals = Array.from({ length: PETAL_COUNT }, () => mkPetal(SW, SH));

    function mkPetal(w, h) {
      return {
        x: Math.random()*w, y: Math.random()*h*-.5 - 20,
        size: Math.random()*10+7,
        speed: Math.random()*1.2+.4,
        wind: Math.random()*.8-.3,
        rot: Math.random()*Math.PI*2,
        rotSpeed: (Math.random()-.5)*.04,
        alpha: Math.random()*.7+.3,
        hue: Math.floor(Math.random()*20+330) % 360
      };
    }

    function drawPetal(c, p) {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      c.globalAlpha = p.alpha;
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(p.size/2, -p.size/2, p.size, 0, 0, p.size);
      c.bezierCurveTo(-p.size, 0, -p.size/2, -p.size/2, 0, 0);
      c.fillStyle = `hsl(${p.hue},90%,80%)`;
      c.shadowColor = `hsl(${p.hue},90%,80%)`;
      c.shadowBlur = 6;
      c.fill();
      c.restore();
    }

    const animateSakura = () => {
      sc.clearRect(0,0,SW,SH);
      for (const p of petals) {
        drawPetal(sc, p);
        p.y += p.speed; p.x += p.wind; p.rot += p.rotSpeed;
        if (p.y > SH+20 || p.x < -20 || p.x > SW+20) Object.assign(p, mkPetal(SW, SH), { y: -20 });
      }
      requestAnimationFrame(animateSakura);
    };
    animateSakura();
    window.addEventListener("resize", () => { SW=window.innerWidth; SH=window.innerHeight; sCanvas.width=SW; sCanvas.height=SH; });
  }



  /* ══════════════════════════════════════════
     ROLE SWITCHER
  ══════════════════════════════════════════ */
  const roleTabs = document.getElementById("roleTabs");
  const roleText = document.getElementById("roleText");
  const ROLE_COPY = {
    gamer:   "As a <strong>Gamer</strong>, I love exploring new worlds, mastering game mechanics, and learning from every match.",
    creator: "As a <strong>Game Creator</strong>, I imagine levels, stories, and mechanics that could become real games, inspired by anime and Pokémon worlds.",
    otaku:   "As an <strong>Otaku</strong>, I live for epic anime arcs, stunning animation, and the lessons that only anime can teach — about perseverance, bonds, and going beyond limits.",
    trainer: "As a <strong>Pokémon Trainer</strong>, I build strategic teams, study type matchups, and dream of a world where every creature has a story. My starter? Charmander. Always. 🔥",
  };
  if (roleTabs && roleText) {
    roleTabs.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const role = t.dataset.role;
      if (!role || !(role in ROLE_COPY)) return;
      roleTabs.querySelectorAll(".pill").forEach(b => b.classList.remove("pill--active"));
      t.classList.add("pill--active");
      roleText.style.opacity = "0";
      setTimeout(() => { roleText.innerHTML = ROLE_COPY[role]; roleText.style.opacity = "1"; }, 180);
    });
    roleText.style.transition = "opacity .2s ease";
  }

  /* ══════════════════════════════════════════
     THEME TOGGLE
  ══════════════════════════════════════════ */
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    if (localStorage.getItem("abhinav-theme") === "light") document.body.classList.add("theme-light");
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("theme-light");
      localStorage.setItem("abhinav-theme", document.body.classList.contains("theme-light") ? "light" : "dark");
    });
  }

  /* ══════════════════════════════════════════
     HAMBURGER MOBILE NAV
  ══════════════════════════════════════════ */
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => mobileNav.classList.toggle("open"));
    mobileNav.querySelectorAll(".mobile-link").forEach(l => l.addEventListener("click", () => mobileNav.classList.remove("open")));
  }

  /* ══════════════════════════════════════════
     ACTIVE NAV ON SCROLL
  ══════════════════════════════════════════ */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove("active"));
        const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (a) a.classList.add("active");
      }
    });
  }, { rootMargin: "-30% 0px -60% 0px" }).observe && sections.forEach(s =>
    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.remove("active"));
          const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
          if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" }).observe(s)
  );

  /* ══════════════════════════════════════════
     STAT COUNTERS (hero + anime)
  ══════════════════════════════════════════ */
  let countersPlayed = false;
  const animateCounters = (scope) => {
    const els = (scope || document).querySelectorAll("[data-target]");
    els.forEach(el => {
      const target = parseInt(el.getAttribute("data-target"), 10);
      if (isNaN(target)) return;
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1100, 1);
        const ease = 1 - Math.pow(1-p, 3);
        el.textContent = Math.floor(ease * target).toString();
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toString();
      };
      requestAnimationFrame(step);
    });
  };

  /* ══════════════════════════════════════════
     ANIME SECTION COUNTER TRIGGER
  ══════════════════════════════════════════ */
  const animeSection = document.getElementById("anime");
  if (animeSection) {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounters(animeSection);
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 }).observe(animeSection);
  }

  /* ══════════════════════════════════════════
     3D TILT EFFECT
  ══════════════════════════════════════════ */
  document.querySelectorAll(".tilt-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 768) return;
      const r = card.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - .5;
      const cy = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `perspective(700px) rotateY(${cx*10}deg) rotateX(${-cy*10}deg) translateZ(8px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateY(0deg) rotateX(0deg) translateZ(0)";
    });
  });

  /* ══════════════════════════════════════════
     SKILL BAR ANIMATION
  ══════════════════════════════════════════ */
  new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add("animated"), 150); obs.unobserve(e.target); }
    });
  }, { threshold: 0.5 }).observe && document.querySelectorAll(".skill-bar").forEach(bar =>
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) { setTimeout(() => e.target.classList.add("animated"), 150); obs.unobserve(e.target); }
      });
    }, { threshold: 0.5 }).observe(bar)
  );

  /* ══════════════════════════════════════════
     SCROLL REVEAL (staggered)
  ══════════════════════════════════════════ */
  const revealEls = document.querySelectorAll(".section,.card,.concept-card,.anime-card,.hero-card,.flip-card");
  revealEls.forEach(el => {
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const parent = e.target.parentElement;
        const siblings = parent ? [...parent.children].filter(c =>
          c.classList.contains("card") || c.classList.contains("concept-card") ||
          c.classList.contains("anime-card") || c.classList.contains("flip-card")
        ) : [];
        const idx = siblings.indexOf(e.target);
        const delay = idx >= 0 ? idx * 90 : 0;
        setTimeout(() => {
          e.target.classList.add("reveal-in");
          if (e.target.id === "hero") { if (!countersPlayed) { countersPlayed = true; animateCounters(); } }
        }, delay);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.1 }).observe(el);
  });

  /* ══════════════════════════════════════════
     POKÉBALL HOVER SOUND EFFECT (visual only)
  ══════════════════════════════════════════ */
  document.querySelectorAll(".poke-flip").forEach(card => {
    card.addEventListener("mouseenter", () => {
      card.querySelector(".flip-front")?.classList.add("poke-shake");
    });
    card.addEventListener("mouseleave", () => {
      card.querySelector(".flip-front")?.classList.remove("poke-shake");
    });
  });

  /* ══════════════════════════════════════════
     MOBILE FLIP (TAP)
  ══════════════════════════════════════════ */
  document.querySelectorAll(".flip-card, .poke-flip").forEach(card => {
    card.addEventListener("click", () => {
      if (window.innerWidth >= 768) return;
      const inner = card.querySelector(".flip-inner");
      if (inner) inner.style.transform = inner.style.transform === "rotateY(180deg)" ? "" : "rotateY(180deg)";
    });
  });

  /* ══════════════════════════════════════════
     CONTACT FORM
  ══════════════════════════════════════════ */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button[type=submit]");
      if (btn) {
        btn.textContent = "✅ Sent! Let's connect!";
        btn.style.background = "linear-gradient(120deg,#00ff88,#ffb7c5)";
        btn.style.color = "#020311";
        setTimeout(() => {
          btn.innerHTML = '<span class="btn-glow"></span>🚀 Send Message';
          btn.style.background = "";
          btn.style.color = "";
        }, 3500);
      }
      contactForm.reset();
    });
  }

  /* ══════════════════════════════════════════
     CURSOR GLOW
  ══════════════════════════════════════════ */
  const glow = document.createElement("div");
  glow.style.cssText = "position:fixed;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(255,183,197,.07) 0%,transparent 70%);pointer-events:none;transform:translate(-50%,-50%);z-index:0;transition:opacity .3s ease";
  document.body.appendChild(glow);
  document.addEventListener("mousemove", e => { glow.style.left=e.clientX+"px"; glow.style.top=e.clientY+"px"; });
  document.addEventListener("mouseleave", () => glow.style.opacity="0");
  document.addEventListener("mouseenter", () => glow.style.opacity="1");

});
