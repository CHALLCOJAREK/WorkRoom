/* =========================================================
   J² TOOLS — GENERADOR DNI A4
   JS Mejorado + Minimal + Modal Elegante + Partículas
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================
       REFERENCIAS DOM
       ========================================= */
    const introLoader = document.getElementById("introLoader");
    const particleCanvas = document.getElementById("particleCanvas");

    const file1Input = document.getElementById("file1");
    const file2Input = document.getElementById("file2");

    const file1Name = document.getElementById("file1Name");
    const file2Name = document.getElementById("file2Name");

    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");

    const placeholder1 = document.getElementById("placeholder1");
    const placeholder2 = document.getElementById("placeholder2");

    const printBtn = document.getElementById("printBtn");
    const clearBtn = document.getElementById("clearBtn");

    const customModal = document.getElementById("customModal");
    const customModalTitle = document.getElementById("customModalTitle");
    const customModalMessage = document.getElementById("customModalMessage");
    const customModalOk = document.getElementById("customModalOk");

    /* =========================================
       ESTADO
       ========================================= */
    const state = {
        image1Loaded: false,
        image2Loaded: false,
        introHidden: false,
    };

    /* =========================================
       MODAL ELEGANTE
       ========================================= */
    function showModal(message, title = "Atención") {
        if (!customModal || !customModalMessage || !customModalTitle) return;

        customModalTitle.textContent = title;
        customModalMessage.textContent = message;
        customModal.classList.add("is-open");
        customModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        if (customModalOk) {
            setTimeout(() => customModalOk.focus(), 60);
        }
    }

    function closeModal() {
        if (!customModal) return;

        customModal.classList.remove("is-open");
        customModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    if (customModalOk) {
        customModalOk.addEventListener("click", closeModal);
    }

    if (customModal) {
        customModal.addEventListener("click", (e) => {
            if (
                e.target.classList.contains("custom-modal") ||
                e.target.classList.contains("custom-modal__backdrop")
            ) {
                closeModal();
            }
        });
    }

    /* =========================================
       UTILIDADES
       ========================================= */
    function updateFileMeta(metaElement, fileName) {
        if (!metaElement) return;

        metaElement.innerHTML = `
            <i class="fa-regular fa-file-image"></i>
            <span>${fileName || "Ningún archivo seleccionado"}</span>
        `;
    }

    function showPlaceholder(imgEl, placeholderEl) {
        if (!imgEl || !placeholderEl) return;
        imgEl.style.display = "none";
        placeholderEl.style.display = "flex";
    }

    function hidePlaceholder(imgEl, placeholderEl) {
        if (!imgEl || !placeholderEl) return;
        imgEl.style.display = "block";
        placeholderEl.style.display = "none";
    }

    function clearImage(inputEl, imgEl, placeholderEl, metaEl) {
        if (inputEl) inputEl.value = "";

        if (imgEl) {
            imgEl.removeAttribute("src");
            imgEl.style.display = "none";
            imgEl.onload = null;
            imgEl.onerror = null;
        }

        if (placeholderEl) {
            placeholderEl.style.display = "flex";
        }

        updateFileMeta(metaEl, "Ningún archivo seleccionado");
    }

    function isImageFile(file) {
        return Boolean(file && file.type && file.type.startsWith("image/"));
    }

    function hasValidImage(imgEl, stateKey) {
        return Boolean(
            state[stateKey] &&
            imgEl &&
            imgEl.getAttribute("src") &&
            imgEl.naturalWidth > 0
        );
    }

    function validateBeforePrint() {
        const hasFront = hasValidImage(img1, "image1Loaded");
        const hasBack = hasValidImage(img2, "image2Loaded");

        if (!hasFront || !hasBack) {
            showModal("Sube ambas fotos antes de imprimir.", "Faltan imágenes");
            return false;
        }

        return true;
    }

    /* =========================================
       CARGA DE IMÁGENES
       ========================================= */
    function setupImageLoader({
        inputEl,
        imgEl,
        placeholderEl,
        metaEl,
        stateKey,
        friendlyName,
    }) {
        if (!inputEl || !imgEl || !placeholderEl || !metaEl) return;

        inputEl.addEventListener("change", () => {
            const file = inputEl.files?.[0];

            if (!file) {
                state[stateKey] = false;
                clearImage(inputEl, imgEl, placeholderEl, metaEl);
                return;
            }

            if (!isImageFile(file)) {
                state[stateKey] = false;
                clearImage(inputEl, imgEl, placeholderEl, metaEl);
                showModal(`El archivo seleccionado para ${friendlyName} no es una imagen válida.`, "Archivo no válido");
                return;
            }

            updateFileMeta(metaEl, file.name);

            const reader = new FileReader();

            reader.onload = (event) => {
                const result = event.target?.result;

                if (!result) {
                    state[stateKey] = false;
                    clearImage(inputEl, imgEl, placeholderEl, metaEl);
                    showModal(`No se pudo leer la imagen de ${friendlyName}.`, "Error al cargar");
                    return;
                }

                imgEl.onload = () => {
                    hidePlaceholder(imgEl, placeholderEl);
                    state[stateKey] = true;
                };

                imgEl.onerror = () => {
                    state[stateKey] = false;
                    clearImage(inputEl, imgEl, placeholderEl, metaEl);
                    showModal(`Hubo un problema al cargar la imagen de ${friendlyName}.`, "Error al mostrar");
                };

                imgEl.src = result;
            };

            reader.onerror = () => {
                state[stateKey] = false;
                clearImage(inputEl, imgEl, placeholderEl, metaEl);
                showModal(`No se pudo procesar el archivo de ${friendlyName}.`, "Error de lectura");
            };

            reader.readAsDataURL(file);
        });
    }

    setupImageLoader({
        inputEl: file1Input,
        imgEl: img1,
        placeholderEl: placeholder1,
        metaEl: file1Name,
        stateKey: "image1Loaded",
        friendlyName: "anverso",
    });

    setupImageLoader({
        inputEl: file2Input,
        imgEl: img2,
        placeholderEl: placeholder2,
        metaEl: file2Name,
        stateKey: "image2Loaded",
        friendlyName: "reverso",
    });

    /* =========================================
       BOTÓN IMPRIMIR
       ========================================= */
    if (printBtn) {
        printBtn.addEventListener("click", () => {
            if (!validateBeforePrint()) return;
            window.print();
        });
    }

    /* =========================================
       BOTÓN LIMPIAR
       ========================================= */
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            clearImage(file1Input, img1, placeholder1, file1Name);
            clearImage(file2Input, img2, placeholder2, file2Name);

            state.image1Loaded = false;
            state.image2Loaded = false;
        });
    }

    /* =========================================
       INTRO LOADER
       ========================================= */
    function hideIntroLoader() {
        if (!introLoader || state.introHidden) return;

        state.introHidden = true;
        introLoader.classList.add("is-hidden");

        setTimeout(() => {
            if (introLoader) {
                introLoader.style.display = "none";
            }
        }, 500);
    }

    window.addEventListener("load", () => {
        setTimeout(hideIntroLoader, 1200);
    });

    /* =========================================
       PARTÍCULAS / MOLÉCULAS
       ========================================= */
    function initParticles(canvas) {
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let particles = [];
        let animationId = null;

        const PARTICLE_COUNT = window.innerWidth < 768 ? 42 : 78;
        const LINK_DISTANCE = window.innerWidth < 768 ? 90 : 130;

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : Math.random() * height;

                this.size = Math.random() * 1.8 + 0.8;
                this.speedX = (Math.random() - 0.5) * 0.18;
                this.speedY = (Math.random() - 0.5) * 0.18;

                this.opacity = Math.random() * 0.28 + 0.14;
                this.pulse = Math.random() * 0.015 + 0.003;
                this.pulseDir = Math.random() > 0.5 ? 1 : -1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                this.opacity += this.pulse * this.pulseDir;

                if (this.opacity >= 0.42) this.pulseDir = -1;
                if (this.opacity <= 0.12) this.pulseDir = 1;

                if (this.x < -20) this.x = width + 20;
                if (this.x > width + 20) this.x = -20;
                if (this.y < -20) this.y = height + 20;
                if (this.y > height + 20) this.y = -20;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(232, 238, 248, ${this.opacity})`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = "rgba(220, 230, 245, 0.22)";
                ctx.fill();
                ctx.closePath();
                ctx.shadowBlur = 0;
            }
        }

        function createParticles() {
            particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
        }

        function drawLinks() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];

                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.hypot(dx, dy);

                    if (dist < LINK_DISTANCE) {
                        const opacity = (1 - dist / LINK_DISTANCE) * 0.08;

                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(220, 228, 240, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        }

        function drawAmbientGlow() {
            const gradient = ctx.createRadialGradient(
                width * 0.5,
                height * 0.45,
                0,
                width * 0.5,
                height * 0.45,
                Math.max(width, height) * 0.5
            );

            gradient.addColorStop(0, "rgba(210, 220, 235, 0.03)");
            gradient.addColorStop(0.5, "rgba(160, 180, 210, 0.012)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            drawAmbientGlow();

            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            drawLinks();

            animationId = requestAnimationFrame(animate);
        }

        function handleResize() {
            resizeCanvas();
            createParticles();
        }

        resizeCanvas();
        createParticles();
        animate();

        window.addEventListener("resize", handleResize);

        window.addEventListener("beforeunload", () => {
            if (animationId) cancelAnimationFrame(animationId);
        });
    }

    initParticles(particleCanvas);

    /* =========================================
       ESTADO INICIAL
       ========================================= */
    showPlaceholder(img1, placeholder1);
    showPlaceholder(img2, placeholder2);
    updateFileMeta(file1Name, "Ningún archivo seleccionado");
    updateFileMeta(file2Name, "Ningún archivo seleccionado");

    /* =========================================
       ATAJOS DE TECLADO
       ========================================= */
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (customModal?.classList.contains("is-open")) {
                closeModal();
                return;
            }
        }
    });

    /* =========================================
       MINI LOG
       ========================================= */
    console.log("J² Tools DNI A4 listo. Minimal, fino y operativo.");
});