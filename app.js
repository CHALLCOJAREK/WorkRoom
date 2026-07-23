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
    }, 3200);
  }

  // ---------------------------------------------------
  // 2) CANVAS DINÁMICO TECH DE FONDO (#bg-canvas)
  // ---------------------------------------------------
  const canvas = document.getElementById("bg-canvas");

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");

    let width;
    let height;
    let particles;

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
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -1;
        }
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      // Puntos
      for (const particle of particles) {
        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.r,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          `rgba(0, 230, 255, ${particle.alpha})`;

        ctx.fill();
      }

      // Líneas entre puntos cercanos
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const firstParticle = particles[i];
          const secondParticle = particles[j];

          const deltaX =
            firstParticle.x - secondParticle.x;

          const deltaY =
            firstParticle.y - secondParticle.y;

          const distance = Math.sqrt(
            deltaX * deltaX + deltaY * deltaY
          );

          if (distance < MAX_DISTANCE) {
            const opacity =
              1 - distance / MAX_DISTANCE;

            ctx.beginPath();

            ctx.moveTo(
              firstParticle.x,
              firstParticle.y
            );

            ctx.lineTo(
              secondParticle.x,
              secondParticle.y
            );

            ctx.strokeStyle =
              `rgba(0, 190, 255, ${0.14 * opacity})`;

            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function animateCanvas() {
      updateParticles();
      drawParticles();

      requestAnimationFrame(animateCanvas);
    }

    resizeCanvas();
    createParticles();
    animateCanvas();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });
  }

  // ---------------------------------------------------
  // 3) SCROLL REVEAL PRO
  // ---------------------------------------------------
  const revealConfig = [
    {
      selector: ".section",
      effect: "fade-up"
    },
    {
      selector: ".service-card",
      effect: "fade-up"
    },
    {
      selector: ".app-card",
      effect: "fade-up"
    },
    {
      selector: ".project-card",
      effect: "fade-up"
    },
    {
      selector: ".tech-item",
      effect: "fade-up"
    },
    {
      selector: ".timeline .tl-item",
      effect: "fade-up"
    },
    {
      selector: ".music-panel, .music-card",
      effect: "fade-up"
    }
  ];

  const revealTargets = [];

  revealConfig.forEach(config => {
    document
      .querySelectorAll(config.selector)
      .forEach(element => {
        element.dataset.srEffect = config.effect;

        element.style.opacity = "0";
        element.style.transform =
          "translateY(24px)";

        element.style.transition =
          "opacity 0.7s ease-out, " +
          "transform 0.7s ease-out";

        revealTargets.push(element);
      });
  });

  if ("IntersectionObserver" in window) {
    const revealObserver =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const element = entry.target;

            element.style.opacity = "1";
            element.style.transform =
              "translateY(0)";

            revealObserver.unobserve(element);
          });
        },
        {
          threshold: 0.15
        }
      );

    revealTargets.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Compatibilidad con navegadores antiguos
    revealTargets.forEach(element => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
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

    function handleParallax(event) {
      if (!parallaxEnabled) return;

      const rect =
        heroHoloFrame.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
          rect.width -
        0.5;

      const y =
        (event.clientY - rect.top) /
          rect.height -
        0.5;

      const maxTranslate = 10;

      const translateX = -x * maxTranslate;
      const translateY = -y * maxTranslate;

      heroHoloFrame.style.transform =
        `translate3d(
          ${translateX}px,
          ${translateY}px,
          0
        )`;
    }

    function resetParallax() {
      heroHoloFrame.style.transform =
        "translate3d(0, 0, 0)";
    }

    window.addEventListener(
      "mousemove",
      handleParallax,
      { passive: true }
    );

    heroHoloFrame.addEventListener(
      "mouseleave",
      resetParallax
    );

    window.addEventListener("resize", () => {
      parallaxEnabled =
        window.innerWidth > 900;

      if (!parallaxEnabled) {
        resetParallax();
      }
    });
  }

  // ---------------------------------------------------
  // 5) BRILLO INTELIGENTE EN CARDS
  // ---------------------------------------------------
  const glowSelectors = [
    ".service-card",
    ".app-card",
    ".project-card",
    ".music-panel",
    ".music-card"
  ];

  const glowCards = document.querySelectorAll(
    glowSelectors.join(",")
  );

  glowCards.forEach(card => {
    card.style.position =
      card.style.position || "relative";

    card.style.overflow =
      card.style.overflow || "hidden";

    card.addEventListener("mousemove", event => {
      const rect = card.getBoundingClientRect();

      const x =
        ((event.clientX - rect.left) /
          rect.width) *
        100;

      const y =
        ((event.clientY - rect.top) /
          rect.height) *
        100;

      card.style.backgroundImage = `
        radial-gradient(
          circle at ${x}% ${y}%,
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
// 6) HEADER INTELIGENTE · EFECTO BLIP
// Desintegrar al bajar · Reconstruir al subir
// ---------------------------------------------------

const siteHeader = document.getElementById("header");

if (siteHeader) {
  let lastScrollY = Math.max(window.scrollY, 0);
  let scrollTicking = false;
  let headerAnimationTimer = null;
  let headerState = "visible";

  const TOP_LIMIT = 50;
  const HIDE_AFTER = 110;
  const DIRECTION_THRESHOLD = 6;

  const BLIP_DURATION = 720;
  const PARTICLE_COUNT = 75;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // -------------------------------------------------
  // Crear partículas alrededor de todo el header
  // -------------------------------------------------

  function createHeaderBlipParticles(animationType) {
    if (reducedMotion) return;

    const headerRect =
      siteHeader.getBoundingClientRect();

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < PARTICLE_COUNT; index++) {
      const particle = document.createElement("span");

      particle.className =
        `header-blip-particle ${animationType}`;

      /*
        Distribución aleatoria dentro del header.
        Algunas partículas se concentran cerca del logo
        para que el efecto se note mejor.
      */
      const logoZone = index < PARTICLE_COUNT * 0.35;

      const positionX = logoZone
        ? headerRect.left +
          Math.random() *
            Math.min(240, headerRect.width)
        : headerRect.left +
          Math.random() * headerRect.width;

      const positionY =
        headerRect.top +
        Math.random() * headerRect.height;

      /*
        Movimiento horizontal dominante.
        No sube el header: se dispersa lateralmente
        y ligeramente en vertical.
      */
      const direction =
        Math.random() > 0.5 ? 1 : -1;

      const movementX =
        direction * (30 + Math.random() * 130);

      const movementY =
        (Math.random() - 0.5) * 65;

      const delay =
        Math.random() * 170;

      const size =
        1.5 + Math.random() * 3.5;

      const scale =
        0.6 + Math.random() * 1.4;

      particle.style.setProperty(
        "--particle-x",
        `${positionX}px`
      );

      particle.style.setProperty(
        "--particle-y",
        `${positionY}px`
      );

      particle.style.setProperty(
        "--particle-move-x",
        `${movementX}px`
      );

      particle.style.setProperty(
        "--particle-move-y",
        `${movementY}px`
      );

      particle.style.setProperty(
        "--particle-delay",
        `${delay}ms`
      );

      particle.style.setProperty(
        "--particle-scale",
        scale
      );

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      fragment.appendChild(particle);
    }

    document.body.appendChild(fragment);

    window.setTimeout(() => {
      document
        .querySelectorAll(
          `.header-blip-particle.${animationType}`
        )
        .forEach(particle => particle.remove());
    }, BLIP_DURATION + 250);
  }

  // -------------------------------------------------
  // Ocultar con efecto blip
  // -------------------------------------------------

  function hideHeaderWithBlip() {
    if (
      headerState === "hidden" ||
      headerState === "hiding"
    ) {
      return;
    }

    headerState = "hiding";

    window.clearTimeout(headerAnimationTimer);

    siteHeader.classList.remove(
      "header-visible",
      "header-blip-in",
      "header-hidden"
    );

    // Reinicia correctamente la animación CSS
    void siteHeader.offsetWidth;

    siteHeader.classList.add("header-blip-out");

    createHeaderBlipParticles("blip-out");

    headerAnimationTimer = window.setTimeout(() => {
      siteHeader.classList.remove("header-blip-out");
      siteHeader.classList.add("header-hidden");

      headerState = "hidden";
    }, reducedMotion ? 0 : BLIP_DURATION);
  }

  // -------------------------------------------------
  // Mostrar reconstruyendo las partículas
  // -------------------------------------------------

  function showHeaderWithBlip() {
    if (
      headerState === "visible" ||
      headerState === "showing"
    ) {
      return;
    }

    headerState = "showing";

    window.clearTimeout(headerAnimationTimer);

    siteHeader.classList.remove(
      "header-hidden",
      "header-blip-out",
      "header-visible"
    );

    // Reinicia correctamente la animación
    void siteHeader.offsetWidth;

    siteHeader.classList.add("header-blip-in");

    createHeaderBlipParticles("blip-in");

    headerAnimationTimer = window.setTimeout(() => {
      siteHeader.classList.remove("header-blip-in");
      siteHeader.classList.add("header-visible");

      headerState = "visible";
    }, reducedMotion ? 0 : BLIP_DURATION);
  }

  // -------------------------------------------------
  // Scroll principal
  // -------------------------------------------------

  function updateHeaderVisibility() {
    const currentScrollY = Math.max(window.scrollY, 0);

    const scrollDifference =
      currentScrollY - lastScrollY;

    // Apariencia dinámica del cristal
    const scrollProgress = Math.min(
      currentScrollY / 180,
      1
    );

    const backgroundOpacity =
      0.55 + scrollProgress * 0.32;

    const blurAmount =
      14 + scrollProgress * 6;

    siteHeader.style.background =
      `rgba(5, 8, 18, ${backgroundOpacity})`;

    siteHeader.style.boxShadow =
      currentScrollY > TOP_LIMIT
        ? "0 12px 34px rgba(0, 0, 0, 0.68)"
        : "0 6px 22px rgba(0, 0, 0, 0.45)";

    siteHeader.style.backdropFilter =
      `blur(${blurAmount}px) saturate(135%)`;

    siteHeader.style.webkitBackdropFilter =
      `blur(${blurAmount}px) saturate(135%)`;

    // Siempre visible al inicio
    if (currentScrollY <= TOP_LIMIT) {
      showHeaderWithBlip();
    }

    // Bajando: desintegrar
    else if (
      scrollDifference > DIRECTION_THRESHOLD &&
      currentScrollY > HIDE_AFTER
    ) {
      hideHeaderWithBlip();
    }

    // Subiendo: reconstruir
    else if (
      scrollDifference < -DIRECTION_THRESHOLD
    ) {
      showHeaderWithBlip();
    }

    lastScrollY = currentScrollY;
    scrollTicking = false;
  }

  // Estado inicial
  siteHeader.classList.add("header-visible");
  headerState = "visible";

  updateHeaderVisibility();

  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;

      scrollTicking = true;

      window.requestAnimationFrame(
        updateHeaderVisibility
      );
    },
    { passive: true }
  );
}
  // ==================================================
  // 7) GITHUB PRO
  // Carrusel + repositorios + estrellas
  // ==================================================

  async function loadGithubRepos() {
    const githubUser = "CHALLCOJAREK";

    const githubUrl =
      `https://api.github.com/users/` +
      `${githubUser}/repos?per_page=40`;

    const githubContainer =
      document.getElementById(
        "github-carousel"
      );

    if (!githubContainer) return;

    try {
      const response = await fetch(
        githubUrl,
        {
          headers: {
            Accept:
              "application/vnd.github+json"
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          `GitHub respondió con estado ` +
          `${response.status}`
        );
      }

      const githubData =
        await response.json();

      const repositories =
        Array.isArray(githubData)
          ? githubData
              .filter(repository => {
                return !repository.fork;
              })
              .sort(
                (
                  firstRepository,
                  secondRepository
                ) => {
                  const starDifference =
                    (
                      secondRepository
                        .stargazers_count ||
                      0
                    ) -
                    (
                      firstRepository
                        .stargazers_count ||
                      0
                    );

                  if (starDifference !== 0) {
                    return starDifference;
                  }

                  return (
                    new Date(
                      secondRepository.updated_at
                    ) -
                    new Date(
                      firstRepository.updated_at
                    )
                  );
                }
              )
          : [];

      githubContainer.innerHTML = "";

      if (!repositories.length) {
        githubContainer.innerHTML = `
          <p class="github-empty">
            No se encontraron repositorios
            públicos en este momento.
          </p>
        `;

        return;
      }

      repositories.forEach(repository => {
        const language =
          repository.language ||
          "Sin especificar";

        const description =
          repository.description ||
          "Repositorio sin descripción.";

        const updatedAt =
          repository.updated_at
            ? repository.updated_at.slice(
                0,
                10
              )
            : "Sin fecha";

        const repositoryCard =
          document.createElement("article");

        repositoryCard.className =
          "github-card";

        repositoryCard.innerHTML = `
          <h4>${repository.name}</h4>

          <p>${description}</p>

          <span class="gh-lang">
            ${language}
          </span>

          <p
            style="
              font-size: 13px;
              color: var(--text-soft);
              margin-bottom: 12px;
            "
          >
            ⭐ ${
              repository
                .stargazers_count || 0
            }
            — Último push:
            ${updatedAt}
          </p>

          <a
            class="gh-link"
            href="${repository.html_url}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i
              class="fa-brands fa-github"
              aria-hidden="true"
            ></i>

            Ver repositorio
          </a>
        `;

        githubContainer.appendChild(
          repositoryCard
        );
      });
    } catch (error) {
      console.error(
        "Error cargando GitHub:",
        error
      );

      githubContainer.innerHTML = `
        <p class="github-empty">
          No fue posible cargar los
          repositorios en este momento.
        </p>
      `;
    }
  }

  loadGithubRepos();

  // ==================================================
  // 8) CERTIFICACIONES
  // Carrusel + Modal
  // ==================================================

  const CERTS = [
    {
      title: "Certificado de Estudios",
      desc:
        "Formación académica validada.",
      img:
        "./Certificados/" +
        "Certificado_Estudios_" +
        "Jarek_Challco_page-0001.jpg"
    },
    {
      title: "Certificado Negocios",
      desc:
        "Formación en negocios y gestión.",
      img:
        "./Certificados/" +
        "CERTIFICADO_Negocios.jpg"
    },
    {
      title: "Developer Rocketbot",
      desc:
        "Desarrollo de automatizaciones " +
        "empresariales.",
      img:
        "./Certificados/" +
        "Developer_Rocketbot.jpg"
    },
    {
      title:
        "Diploma Nivel 1 Rocketbot",
      desc:
        "Certificación oficial en " +
        "automatización RPA.",
      img:
        "./Certificados/" +
        "diploma nivel 1_Rocketbot.png"
    },
    {
      title: "Entrepreneurship",
      desc:
        "Formación en mentalidad y " +
        "estrategia empresarial.",
      img:
        "./Certificados/" +
        "Entrepreneurship.jpg"
    },
    {
      title:
        "Getting Started with " +
        "Cisco Packet Tracer",
      desc:
        "Simulación y fundamentos " +
        "de redes Cisco.",
      img:
        "./Certificados/" +
        "Getting_Started_with_" +
        "Cisco_Packet_Tracer.jpg"
    },
    {
      title:
        "Introduction to Cybersecurity",
      desc:
        "Bases de seguridad informática.",
      img:
        "./Certificados/" +
        "Introduction_to_" +
        "Cybersecurity.jpg"
    },
        {
      title: "Introduction to IoT",
      desc:
        "Fundamentos de Internet of Things.",
      img:
        "./Certificados/" +
        "Introduction_to_IoT.jpg"
    },
    {
      title: "NDG Linux Unhatched",
      desc:
        "Fundamentos de Linux.",
      img:
        "./Certificados/" +
        "NDG Linux Unhatched.jpg"
    },
    {
      title:
        "Partner - NDG Linux Unhatched",
      desc:
        "Validación adicional en " +
        "entorno Linux.",
      img:
        "./Certificados/" +
        "Partner-_NDG_Linux_Unhatched.jpg"
    }
  ];

  // ---------------------------------------------------
  // 9) MODAL DE CERTIFICACIONES
  // ---------------------------------------------------
  const certModal =
    document.getElementById("cert-modal");

  const certModalImg =
    document.getElementById(
      "cert-modal-img"
    );

  const certModalTitle =
    document.getElementById(
      "cert-modal-title"
    );

  const certModalDesc =
    document.getElementById(
      "cert-modal-desc"
    );

  const certModalClose =
    document.getElementById(
      "cert-modal-close"
    );

  function openCertModal(certificate) {
    if (
      !certModal ||
      !certModalImg ||
      !certModalTitle ||
      !certModalDesc
    ) {
      return;
    }

    certModalImg.src =
      certificate.img;

    certModalImg.alt =
      certificate.title;

    certModalTitle.textContent =
      certificate.title;

    certModalDesc.textContent =
      certificate.desc;

    certModal.classList.add(
      "is-open"
    );

    certModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

    certModalClose?.focus();
  }

  function closeCertModal() {
    if (!certModal) return;

    certModal.classList.remove(
      "is-open"
    );

    certModal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.style.overflow =
      "";
  }

  // ---------------------------------------------------
  // 10) CARRUSEL DE CERTIFICACIONES
  // ---------------------------------------------------
  (function initCertifications() {
    const certCarousel =
      document.getElementById(
        "cert-carousel"
      );

    if (!certCarousel) return;

    certCarousel.innerHTML = "";

    CERTS.forEach(
      (certificate, index) => {
        const certCard =
          document.createElement("article");

        certCard.className =
          "cert-card";

        certCard.setAttribute(
          "tabindex",
          "0"
        );

        certCard.setAttribute(
          "role",
          "button"
        );

        certCard.setAttribute(
          "aria-label",
          `Ver certificado: ` +
            `${certificate.title}`
        );

        certCard.dataset.index =
          String(index);

        certCard.innerHTML = `
          <div class="cert-thumb">
            <img
              src="${certificate.img}"
              alt="${certificate.title}"
              loading="lazy"
            >
          </div>

          <h4 class="cert-title">
            ${certificate.title}
          </h4>

          <p class="cert-desc">
            ${certificate.desc}
          </p>
        `;

        certCard.addEventListener(
          "click",
          () => {
            openCertModal(certificate);
          }
        );

        certCard.addEventListener(
          "keydown",
          event => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();

              openCertModal(
                certificate
              );
            }
          }
        );

        certCarousel.appendChild(
          certCard
        );
      }
    );

    const certLeftButton =
      document.querySelector(
        ".cert-left"
      );

    const certRightButton =
      document.querySelector(
        ".cert-right"
      );

    function scrollCertificateCards(
      direction = 1
    ) {
      const firstCard =
        certCarousel.querySelector(
          ".cert-card"
        );

      const cardWidth = firstCard
        ? firstCard
            .getBoundingClientRect()
            .width
        : 282;

      const gap = 18;
      const step = cardWidth + gap;

      certCarousel.scrollBy({
        left: step * direction,
        behavior: "smooth"
      });
    }

    certLeftButton?.addEventListener(
      "click",
      () => {
        scrollCertificateCards(-1);
      }
    );

    certRightButton?.addEventListener(
      "click",
      () => {
        scrollCertificateCards(1);
      }
    );

    // -----------------------------------------------
    // Drag horizontal con mouse
    // -----------------------------------------------
    let isDragging = false;
    let dragStartX = 0;
    let initialScrollLeft = 0;

    certCarousel.addEventListener(
      "mousedown",
      event => {
        isDragging = true;

        dragStartX = event.pageX;

        initialScrollLeft =
          certCarousel.scrollLeft;

        certCarousel.classList.add(
          "is-dragging"
        );
      }
    );

    window.addEventListener(
      "mouseup",
      () => {
        isDragging = false;

        certCarousel.classList.remove(
          "is-dragging"
        );
      }
    );

    certCarousel.addEventListener(
      "mouseleave",
      () => {
        isDragging = false;

        certCarousel.classList.remove(
          "is-dragging"
        );
      }
    );

    certCarousel.addEventListener(
      "mousemove",
      event => {
        if (!isDragging) return;

        event.preventDefault();

        const movement =
          (event.pageX - dragStartX) *
          1.4;

        certCarousel.scrollLeft =
          initialScrollLeft - movement;
      }
    );
  })();

  certModalClose?.addEventListener(
    "click",
    closeCertModal
  );

  certModal?.addEventListener(
    "click",
    event => {
      const clickedElement =
        event.target;

      if (
        clickedElement instanceof
          HTMLElement &&
        clickedElement.dataset.close ===
          "1"
      ) {
        closeCertModal();
      }
    }
  );

  // ---------------------------------------------------
  // 11) CONTROLES DEL CARRUSEL GITHUB
  // ---------------------------------------------------
  const ghCarousel =
    document.getElementById(
      "github-carousel"
    );

  const ghLeftButton =
    document.querySelector(
      ".gh-left"
    );

  const ghRightButton =
    document.querySelector(
      ".gh-right"
    );

  if (ghCarousel) {
    ghLeftButton?.addEventListener(
      "click",
      () => {
        ghCarousel.scrollBy({
          left: -350,
          behavior: "smooth"
        });
      }
    );

    ghRightButton?.addEventListener(
      "click",
      () => {
        ghCarousel.scrollBy({
          left: 350,
          behavior: "smooth"
        });
      }
    );

    // -----------------------------------------------
    // Auto-scroll pausado al interactuar
    // -----------------------------------------------
    let githubAutoScrollPaused =
      false;

    function pauseGithubAutoScroll() {
      githubAutoScrollPaused = true;
    }

    function resumeGithubAutoScroll() {
      githubAutoScrollPaused = false;
    }

    ghCarousel.addEventListener(
      "mouseenter",
      pauseGithubAutoScroll
    );

    ghCarousel.addEventListener(
      "mouseleave",
      resumeGithubAutoScroll
    );

    ghCarousel.addEventListener(
      "focusin",
      pauseGithubAutoScroll
    );

    ghCarousel.addEventListener(
      "focusout",
      resumeGithubAutoScroll
    );

    ghCarousel.addEventListener(
      "touchstart",
      pauseGithubAutoScroll,
      {
        passive: true
      }
    );

    ghCarousel.addEventListener(
      "touchend",
      resumeGithubAutoScroll,
      {
        passive: true
      }
    );

    window.setInterval(() => {
      if (
        githubAutoScrollPaused ||
        document.hidden ||
        prefersReducedMotion
      ) {
        return;
      }

      const reachedEnd =
        ghCarousel.scrollLeft +
          ghCarousel.clientWidth >=
        ghCarousel.scrollWidth - 8;

      ghCarousel.scrollTo({
        left: reachedEnd
          ? 0
          : ghCarousel.scrollLeft +
            320,

        behavior: "smooth"
      });
    }, 5000);
  }

  // ---------------------------------------------------
  // 12) SCROLLREVEAL EXTERNO PARA GITHUB
  // ---------------------------------------------------
  if (
    typeof window.ScrollReveal ===
    "function"
  ) {
    const githubReveal =
      window.ScrollReveal();

    githubReveal.reveal(
      "#github .section-title",
      {
        distance: "40px",
        duration: 900,
        origin: "bottom"
      }
    );

    githubReveal.reveal(
      "#github .section-intro",
      {
        distance: "40px",
        duration: 1000,
        origin: "bottom",
        delay: 150
      }
    );

    githubReveal.reveal(
      "#github .github-wrapper",
      {
        distance: "60px",
        duration: 1100,
        origin: "bottom",
        delay: 200
      }
    );
  }

  // ---------------------------------------------------
  // 13) MODAL DEL CV
  // ---------------------------------------------------
  const cvOpen =
    document.getElementById(
      "cv-open"
    );

  const cvModal =
    document.getElementById(
      "cv-modal"
    );

  const cvClose =
    document.getElementById(
      "cv-modal-close"
    );

  const cvFrame =
    document.getElementById(
      "cv-frame"
    );

  const CV_URL =
    "./docs/Jarek_CV_2026.pdf";

  function openCV() {
    if (!cvModal || !cvFrame) {
      return;
    }

    cvFrame.src =
      `${CV_URL}` +
      "#toolbar=0&navpanes=0";

    cvModal.classList.add(
      "is-open"
    );

    cvModal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow =
      "hidden";

    cvClose?.focus();
  }

  function closeCV() {
    if (!cvModal || !cvFrame) {
      return;
    }

    cvModal.classList.remove(
      "is-open"
    );

    cvModal.setAttribute(
      "aria-hidden",
      "true"
    );

    cvFrame.src = "";

    document.body.style.overflow =
      "";
  }

  cvOpen?.addEventListener(
    "click",
    openCV
  );

  cvOpen?.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openCV();
      }
    }
  );

  cvClose?.addEventListener(
    "click",
    closeCV
  );

  cvModal?.addEventListener(
    "click",
    event => {
      const clickedElement =
        event.target;

      if (
        clickedElement instanceof
          HTMLElement &&
        clickedElement.dataset.close ===
          "1"
      ) {
        closeCV();
      }
    }
  );
    // ---------------------------------------------------
  // 14) CONTROL GLOBAL DE TECLADO
  // ---------------------------------------------------
  window.addEventListener(
    "keydown",
    event => {
      if (event.key !== "Escape") {
        return;
      }

      if (
        certModal?.classList.contains(
          "is-open"
        )
      ) {
        closeCertModal();
      }

      if (
        cvModal?.classList.contains(
          "is-open"
        )
      ) {
        closeCV();
      }
    }
  );

  // ---------------------------------------------------
  // 15) CONTROL DE VISIBILIDAD DE PÁGINA
  // ---------------------------------------------------
  document.addEventListener(
    "visibilitychange",
    () => {
      /*
        Evita movimientos o efectos innecesarios
        cuando la pestaña no está activa.
      */

      if (document.hidden) {
        siteHeader?.classList.remove(
          "header-visible"
        );
      } else {
        siteHeader?.classList.remove(
          "header-hidden"
        );

        siteHeader?.classList.add(
          "header-visible"
        );
      }
    }
  );

  // ---------------------------------------------------
  // 16) ENLACES EXTERNOS SEGUROS
  // ---------------------------------------------------
  document
    .querySelectorAll(
      'a[target="_blank"]'
    )
    .forEach(link => {
      const currentRel =
        link.getAttribute("rel") || "";

      const relValues =
        new Set(
          currentRel
            .split(" ")
            .filter(Boolean)
        );

      relValues.add("noopener");
      relValues.add("noreferrer");

      link.setAttribute(
        "rel",
        [...relValues].join(" ")
      );
    });

  // ---------------------------------------------------
  // 17) ANCLAJES CON SCROLL SUAVE
  // ---------------------------------------------------
  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(anchor => {
      anchor.addEventListener(
        "click",
        event => {
          const targetId =
            anchor.getAttribute("href");

          if (
            !targetId ||
            targetId === "#"
          ) {
            return;
          }

          const targetElement =
            document.querySelector(
              targetId
            );

          if (!targetElement) return;

          event.preventDefault();

          targetElement.scrollIntoView({
            behavior:
              prefersReducedMotion
                ? "auto"
                : "smooth",

            block: "start"
          });
        }
      );
    });

  // ---------------------------------------------------
  // 18) ESTADO FINAL DE LA APLICACIÓN
  // ---------------------------------------------------
  document.body.classList.add(
    "js-ready"
  );

  console.info(
    "Jarek Neotech UI iniciada correctamente."
  );
});