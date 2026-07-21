// =======================================================
//  JAREK · NEOTECH JS PREMIUM
// =======================================================
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------------
  // 1) INTRO OPTIMIZADA
  // ---------------------------------------------------
  const intro = document.getElementById("intro");
  const introLoader = document.getElementById("intro-loader");
  const introText = document.getElementById("intro-text");

  if (intro) {
    // Simulación suave de carga del loader
    if (introLoader) {
      introLoader.style.transform = "scaleX(0)";
      introLoader.style.transformOrigin = "left";
      introLoader.style.transition = "transform 2.2s ease-out";
      requestAnimationFrame(() => {
        introLoader.style.transform = "scaleX(1)";
      });
    }

    // Ligero fade del texto antes de desaparecer
    if (introText) {
      introText.style.transition = "opacity 0.6s ease";
      setTimeout(() => {
        introText.style.opacity = "0.78";
      }, 1600);
    }

    // Remover el overlay después de la animación CSS
    setTimeout(() => {
      intro.style.pointerEvents = "none";
      intro.style.display = "none";
      document.body.classList.add("app-ready");
    }, 3200); // ligeramente más que tu animación CSS
  }

  // ---------------------------------------------------
  // 2) CANVAS DINÁMICO TECH DE FONDO (#bg-canvas)
  // ---------------------------------------------------
  const canvas = document.getElementById("bg-canvas");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let width, height, particles;

    const PARTICLE_COUNT = 80;
    const MAX_DISTANCE = 160;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 1 + Math.random() * 1.2,
          alpha: 0.3 + Math.random() * 0.4
        });
      }
    }

    function updateParticles() {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      // puntos
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 230, 255, ${p.alpha})`;
        ctx.fill();
      }

      // líneas entre puntos cercanos
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DISTANCE) {
            const alpha = 1 - dist / MAX_DISTANCE;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 190, 255, ${0.14 * alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      updateParticles();
      drawParticles();
      requestAnimationFrame(animate);
    }

    // init
    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });
  }

  // ---------------------------------------------------
  // 3) SCROLLREVEAL PRO (fade, slide, holo)
  // ---------------------------------------------------
  const revealConfig = [
    { selector: ".section", effect: "fade-up" },
    { selector: ".service-card", effect: "fade-up" },
    { selector: ".app-card", effect: "fade-up" },
    { selector: ".project-card", effect: "fade-up" },
    { selector: ".tech-item", effect: "fade-up" },
    { selector: ".timeline .tl-item", effect: "fade-up" },
    { selector: ".music-panel, .music-card", effect: "fade-up" }
  ];

  const revealTargets = [];

  revealConfig.forEach(cfg => {
    document.querySelectorAll(cfg.selector).forEach(el => {
      el.dataset.srEffect = cfg.effect;
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity 0.7s ease-out, transform 0.7s ease-out";
      revealTargets.push(el);
    });
  });

  if ("IntersectionObserver" in window) {
    const srObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            srObserver.unobserve(el);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    revealTargets.forEach(el => srObserver.observe(el));
  } else {
    // fallback simple
    revealTargets.forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }

  // ---------------------------------------------------
  // 4) PARALLAX DEL HOLOGRAMA
  // ---------------------------------------------------
  const heroHoloFrame =
    document.querySelector(".hero-holo-frame") ||
    document.querySelector(".hero-holo");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (heroHoloFrame && !prefersReducedMotion) {
    let parallaxEnabled = window.innerWidth > 900;

    function handleParallax(e) {
      if (!parallaxEnabled) return;

      const rect = heroHoloFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 a 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const maxTranslate = 10; // px
      const tx = -x * maxTranslate;
      const ty = -y * maxTranslate;

      heroHoloFrame.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    }

    function resetParallax() {
      heroHoloFrame.style.transform = "translate3d(0, 0, 0)";
    }

    window.addEventListener("mousemove", handleParallax);
    heroHoloFrame.addEventListener("mouseleave", resetParallax);

    window.addEventListener("resize", () => {
      parallaxEnabled = window.innerWidth > 900;
      if (!parallaxEnabled) resetParallax();
    });
  }

  // ---------------------------------------------------
  // 5) BRILLO INTELIGENTE EN CARDS (hover reactivo)
  // ---------------------------------------------------
  const glowSelectors = [
    ".service-card",
    ".app-card",
    ".project-card",
    ".music-panel",
    ".music-card"
  ];

  const glowCards = document.querySelectorAll(glowSelectors.join(","));

  glowCards.forEach(card => {
    card.style.position = card.style.position || "relative";
    card.style.overflow = card.style.overflow || "hidden";

    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      // gradient suave según la posición del mouse
      card.style.backgroundImage = `
        radial-gradient(circle at ${x}% ${y}%,
          rgba(0, 225, 255, 0.18),
          rgba(255, 255, 255, 0.02)
        )
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.backgroundImage = "";
    });
  });

  // ---------------------------------------------------
  // 6) HEADER INTELIGENTE (blur / opacidad dinámicos)
  // ---------------------------------------------------
  const header = document.getElementById("header");
  if (header) {
    const baseBg = "rgba(5, 8, 18, ";
    const baseShadow =
      "0 6px 22px rgba(0, 0, 0, 0.45)";
    const strongShadow =
      "0 10px 30px rgba(0, 0, 0, 0.75)";

    function updateHeader() {
      const y = window.scrollY || window.pageYOffset;
      const t = Math.min(y / 160, 1); // 0 → 1

      const opacity = 0.55 + t * 0.35; // 0.55 a 0.9
      header.style.background = `${baseBg}${opacity})`;
      header.style.boxShadow =
        t > 0.1 ? strongShadow : baseShadow;
      header.style.backdropFilter = `blur(${14 + t * 4}px)`;
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader);
  }
});
// ==========================================================
//  GITHUB PRO — Carrusel + Skeleton + Lenguajes + Estrellas
// ==========================================================

async function loadGithubRepos() {
  const user = "CHALLCOJAREK";
  const url = `https://api.github.com/users/${user}/repos?per_page=40`;

  const container = document.getElementById("github-carousel");

  try {
    const res = await fetch(url);
    let repos = await res.json();

    // Orden por estrellas y actividad
    repos = repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count);

    container.innerHTML = ""; // limpiar skeletons

    for (const repo of repos) {
      const lang = repo.language ? repo.language : "Sin especificar";

      const card = document.createElement("div");
      card.className = "github-card";

      card.innerHTML = `
        <h4>${repo.name}</h4>
        <p>${repo.description || "Repositorio sin descripción."}</p>

        <span class="gh-lang">${lang}</span>

        <p style="font-size:13px; color:var(--text-soft); margin-bottom:12px;">
          ⭐ ${repo.stargazers_count} — Último push: ${repo.updated_at.slice(0,10)}
        </p>

        <a class="gh-link" href="${repo.html_url}" target="_blank">
          <i class="fa-brands fa-github"></i> Ver repositorio
        </a>
      `;

      container.appendChild(card);
    }

  } catch (err) {
    console.error("Error cargando GitHub:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadGithubRepos);

// =========================
// CERTIFICACIONES (Carrusel + Modal)
// =========================
const CERTS = [
  {
    title: "Certificado de Estudios",
    desc: "Formación académica validada.",
    img: "./Certificados/Certificado_Estudios_Jarek_Challco_page-0001.jpg"
  },
  {
    title: "Certificado Negocios",
    desc: "Formación en negocios y gestión.",
    img: "./Certificados/CERTIFICADO_Negocios.jpg"
  },
  {
    title: "Developer Rocketbot",
    desc: "Desarrollo de automatizaciones empresariales.",
    img: "./Certificados/Developer_Rocketbot.jpg"
  },
  {
    title: "Diploma Nivel 1 Rocketbot",
    desc: "Certificación oficial en automatización RPA.",
    img: "./Certificados/diploma nivel 1_Rocketbot.png"
  },
  {
    title: "Entrepreneurship",
    desc: "Formación en mentalidad y estrategia empresarial.",
    img: "./Certificados/Entrepreneurship.jpg"
  },
  {
    title: "Getting Started with Cisco Packet Tracer",
    desc: "Simulación y fundamentos de redes Cisco.",
    img: "./Certificados/Getting_Started_with_Cisco_Packet_Tracer.jpg"
  },
  {
    title: "Introduction to Cybersecurity",
    desc: "Bases de seguridad informática.",
    img: "./Certificados/Introduction_to_Cybersecurity.jpg"
  },
  {
    title: "Introduction to IoT",
    desc: "Fundamentos de Internet of Things.",
    img: "./Certificados/Introduction_to_IoT.jpg"
  },
  {
    title: "NDG Linux Unhatched",
    desc: "Fundamentos de Linux.",
    img: "./Certificados/NDG Linux Unhatched.jpg"
  },
  {
    title: "Partner - NDG Linux Unhatched",
    desc: "Validación adicional en entorno Linux.",
    img: "./Certificados/Partner-_NDG_Linux_Unhatched.jpg"
  }
];

(function initCertifications() {
  const carousel = document.getElementById("cert-carousel");
  if (!carousel) return;

  // Limpia skeletons
  carousel.innerHTML = "";

  // Render cards
  CERTS.forEach((c, idx) => {
    const card = document.createElement("div");
    card.className = "cert-card";
    card.setAttribute("tabindex", "0");
    card.dataset.index = String(idx);

    card.innerHTML = `
      <div class="cert-thumb">
        <img src="${c.img}" alt="${c.title}">
      </div>
      <h4 class="cert-title">${c.title}</h4>
      <p class="cert-desc">${c.desc}</p>
    `;

    card.addEventListener("click", () => openCertModal(c));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openCertModal(c);
    });

    carousel.appendChild(card);
  });

  // Buttons scroll
  const btnLeft = document.querySelector(".cert-left");
  const btnRight = document.querySelector(".cert-right");

  const scrollByCards = (dir = 1) => {
    const card = carousel.querySelector(".cert-card");
    const step = card ? (card.getBoundingClientRect().width + 18) : 300;
    carousel.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  btnLeft?.addEventListener("click", () => scrollByCards(-1));
  btnRight?.addEventListener("click", () => scrollByCards(1));

  // Drag to scroll (se siente pro)
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  carousel.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX;
    scrollLeft = carousel.scrollLeft;
  });

  window.addEventListener("mouseup", () => (isDown = false));

  carousel.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const walk = (e.pageX - startX) * 1.4;
    carousel.scrollLeft = scrollLeft - walk;
  });
})();

// Modal
const certModal = document.getElementById("cert-modal");
const certModalImg = document.getElementById("cert-modal-img");
const certModalTitle = document.getElementById("cert-modal-title");
const certModalDesc = document.getElementById("cert-modal-desc");
const certModalClose = document.getElementById("cert-modal-close");

function openCertModal(c) {
  if (!certModal) return;
  certModalImg.src = c.img;
  certModalTitle.textContent = c.title;
  certModalDesc.textContent = c.desc;
  certModal.classList.add("is-open");
  certModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCertModal() {
  if (!certModal) return;
  certModal.classList.remove("is-open");
  certModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

certModalClose?.addEventListener("click", closeCertModal);
certModal?.addEventListener("click", (e) => {
  if (e.target && e.target.dataset && e.target.dataset.close === "1") closeCertModal();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCertModal();
});


// ==========================================================
//  Flechas de scroll
// ==========================================================

const ghCarousel = document.getElementById("github-carousel");

document.querySelector(".gh-left").addEventListener("click", () => {
  ghCarousel.scrollBy({ left: -350, behavior: "smooth" });
});
document.querySelector(".gh-right").addEventListener("click", () => {
  ghCarousel.scrollBy({ left: 350, behavior: "smooth" });
});


// ==========================================================
//  Auto-scroll suave cada 5s
// ==========================================================

setInterval(() => {
  ghCarousel.scrollBy({ left: 320, behavior: "smooth" });
}, 5000);


// ==========================================================
//  ScrollReveal para animar entrada
// ==========================================================

ScrollReveal().reveal("#github .section-title", {
  distance: "40px",
  duration: 900,
  origin: "bottom"
});
ScrollReveal().reveal("#github .section-intro", {
  distance: "40px",
  duration: 1000,
  origin: "bottom",
  delay: 150
});
ScrollReveal().reveal("#github .github-wrapper", {
  distance: "60px",
  duration: 1100,
  origin: "bottom",
  delay: 200
});
// =========================
// CV MODAL (thumbnail -> pdf)
// =========================
const cvOpen = document.getElementById("cv-open");
const cvModal = document.getElementById("cv-modal");
const cvClose = document.getElementById("cv-modal-close");
const cvFrame = document.getElementById("cv-frame");

const CV_URL = "./docs/Jarek_CV_2025.pdf";

function openCV(){
  if (!cvModal || !cvFrame) return;
  cvFrame.src = CV_URL + "#toolbar=0&navpanes=0";
  cvModal.classList.add("is-open");
  cvModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCV(){
  if (!cvModal || !cvFrame) return;
  cvModal.classList.remove("is-open");
  cvModal.setAttribute("aria-hidden", "true");
  cvFrame.src = "";
  document.body.style.overflow = "";
}

cvOpen?.addEventListener("click", openCV);
cvOpen?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") openCV();
});

cvClose?.addEventListener("click", closeCV);
cvModal?.addEventListener("click", (e) => {
  if (e.target && e.target.dataset && e.target.dataset.close === "1") closeCV();
});
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCV();
});