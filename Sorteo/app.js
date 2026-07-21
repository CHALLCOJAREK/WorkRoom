/* ============================================================
   SORTEO PRO — JS FÉNIX PRIME (FIXED + MEJORADO)
   ✔ Todos los botones del HTML funcionan
   ✔ Confirmar ganador agrega a la lista
   ✔ Re-roll funciona (reanima y vuelve a parar)
   ✔ Evita “ganador fantasma” cuando no hay elegibles
   ✔ Respeta cantidad de ganadores
   ✔ Import CSV robusto (coma / punto y coma / tabs)
   ✔ Acento aplica al viewer (CSS var --accent)
   ✔ Fullscreen estable
=========================================================== */

/* --------------------------
   UTILIDADES
--------------------------- */
const $ = (q) => document.querySelector(q);
const byLine = (txt) => txt.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
const unique = (arr) => [...new Set(arr)];
const nowStr = () => new Date().toLocaleString();

function clampInt(v, min, max, fallback) {
  const n = Number.parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

/* --------------------------
   ESTADO
--------------------------- */
let participants = [];
let winners = [];
let spinning = false;
let rafSpin = null;
let currentName = null;
let lastPoolEmpty = false;

/* --------------------------
   ELEMENTOS
--------------------------- */
const namesEl = $("#names");
const countEl = $("#count");

const startBtn = $("#start");
const stopBtn = $("#stop");
const rerollBtn = $("#reroll");
const confirmBtn = $("#confirmWin");
const resetBtn = $("#reset");

const winnersEl = $("#winnersList");
const winsCountEl = $("#winsCount");

const viewer = $("#viewer");
const ticker = $("#ticker");

const winnersQty = $("#winners");
const noRepeat = $("#noRepeat");
const shuffleOnStart = $("#shuffleOnStart");
const accent = $("#accent");

const exportCsvBtn = $("#exportCsv");
const fullscreenBtn = $("#fullscreen");

const cleanBtn = $("#clean");
const dedupeBtn = $("#dedupe");
const loadCsvBtn = $("#loadCsv");
const csvInput = $("#csvInput");

/* ============================================================
   CANVAS FX — FONDO ANIMADO + CONFETI
=========================================================== */
const fx = document.getElementById("fx");
const ctx = fx.getContext("2d");

let particles = [];
let confetti = [];

function resizeCanvas() {
  fx.width = window.innerWidth;
  fx.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* -------- PARTICULAS FONDO -------- */
function createParticles() {
  const count = 70;
  particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * fx.width,
      y: Math.random() * fx.height,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
    });
  }
}
createParticles();

/* -------- GENERAR CONFETI -------- */
function launchConfetti() {
  confetti = [];
  const n = 160;

  // usa el acento si es válido, si no, fallback
  const c1 = (accent?.value || "#22d3ee").trim() || "#22d3ee";
  const c2 = "#8b5cf6";

  for (let i = 0; i < n; i++) {
    confetti.push({
      x: Math.random() * fx.width,
      y: -30 - Math.random() * 60,
      size: 4 + Math.random() * 6,
      angle: Math.random() * Math.PI * 2,
      velY: 2 + Math.random() * 3,
      rot: (Math.random() - 0.5) * 0.2,
      color: i % 2 === 0 ? c1 : c2
    });
  }
}

/* -------- LOOP GENERAL -------- */
function render() {
  ctx.clearRect(0, 0, fx.width, fx.height);

  // Fondo (líneas conectadas)
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > fx.width) p.vx *= -1;
    if (p.y < 0 || p.y > fx.height) p.vy *= -1;

    ctx.fillStyle = "rgba(167,139,250,0.75)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 140) {
        ctx.strokeStyle = `rgba(167,139,250, ${1 - dist / 140})`;
        ctx.lineWidth = 0.6;

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  });

  // Confeti
  confetti.forEach(c => {
    c.y += c.velY;
    c.angle += c.rot;
    c.x += Math.sin(c.angle) * 1.4;

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.angle);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
    ctx.restore();
  });

  requestAnimationFrame(render);
}
render();

/* ============================================================
   PARTICIPANTES
=========================================================== */
function syncParticipants() {
  participants = unique(byLine(namesEl.value));
  countEl.textContent = String(participants.length);

  // si se edita la lista, y ya no aplica el ganador actual, limpiamos
  const pool = getPool();
  if (pool.length === 0) {
    currentName = null;
    lastPoolEmpty = true;
  } else {
    lastPoolEmpty = false;
  }

  refreshButtons();
}

namesEl.addEventListener("input", syncParticipants);

cleanBtn.addEventListener("click", () => {
  namesEl.value = "";
  syncParticipants();
});

dedupeBtn.addEventListener("click", () => {
  namesEl.value = unique(byLine(namesEl.value)).join("\n");
  syncParticipants();
});

/* ------------- CSV IMPORT ------------- */
loadCsvBtn.addEventListener("click", () => csvInput.click());

csvInput.addEventListener("change", (e) => {
  const f = e.target.files?.[0];
  if (!f) return;

  const reader = new FileReader();
  reader.onload = () => {
    const text = String(reader.result || "");
    const rows = text.split(/\r?\n/).filter(Boolean);

    // Soporta: comma, ;, tab, pipe
    const firstCol = rows
      .map(r => r.split(/[,;\t|]/)[0]?.trim())
      .filter(Boolean);

    const current = namesEl.value.trim();
    namesEl.value = current
      ? `${current}\n${firstCol.join("\n")}`
      : firstCol.join("\n");

    syncParticipants();
    csvInput.value = ""; // reset input
  };

  reader.readAsText(f, "utf-8");
});

/* ============================================================
   SORTEO — LÓGICA CENTRAL
=========================================================== */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getDesiredWinnersQty() {
  // mínimo 1, máximo participants.length (para no quedar raro)
  const max = Math.max(1, participants.length);
  return clampInt(winnersQty.value, 1, max, 1);
}

function getPool() {
  if (!participants.length) return [];

  if (!noRepeat.checked) return participants;

  const used = new Set(winners.map(w => w.name));
  return participants.filter(p => !used.has(p));
}

function canAddMoreWinners() {
  return winners.length < getDesiredWinnersQty();
}

function setTicker(text) {
  ticker.textContent = text;
}

function refreshButtons() {
  const pool = getPool();
  const hasParticipants = participants.length > 0;
  const canPick = pool.length > 0 && canAddMoreWinners();

  // Start solo si hay participantes, no está girando y todavía faltan ganadores
  startBtn.disabled = !(hasParticipants && !spinning && canAddMoreWinners());

  // Stop solo si está girando
  stopBtn.disabled = !spinning;

  // Confirm: solo si no gira, hay currentName válido, y faltan ganadores
  confirmBtn.disabled = spinning || !currentName || !canAddMoreWinners();

  // Reroll: solo si no gira, faltan ganadores y existe pool
  rerollBtn.disabled = spinning || !canAddMoreWinners() || pool.length === 0;

  // Export siempre disponible (pero mostrará alert si vacío)
  exportCsvBtn.disabled = false;
}

function spin() {
  const speed = 90;
  let last = 0;

  const loop = (t) => {
    if (!spinning) {
      if (rafSpin) cancelAnimationFrame(rafSpin);
      rafSpin = null;
      return;
    }

    if (!last || t - last > speed) {
      const pool = getPool();

      if (pool.length === 0) {
        currentName = null;
        lastPoolEmpty = true;
        setTicker("No quedan elegibles");
        refreshButtons();
      } else {
        lastPoolEmpty = false;
        currentName = pool[Math.floor(Math.random() * pool.length)];
        setTicker(currentName);
        refreshButtons();
      }

      last = t;
    }

    rafSpin = requestAnimationFrame(loop);
  };

  rafSpin = requestAnimationFrame(loop);
}

function start() {
  syncParticipants();

  if (participants.length === 0) {
    alert("Agrega participantes primero.");
    return;
  }

  if (!canAddMoreWinners()) {
    alert("Ya se alcanzó la cantidad de ganadores.");
    return;
  }

  // Mezclar solo al iniciar (si está marcado)
  if (shuffleOnStart.checked) participants = shuffle(participants);

  // Pool inicial
  const pool = getPool();
  if (pool.length === 0) {
    currentName = null;
    setTicker("No quedan elegibles");
    refreshButtons();
    return;
  }

  spinning = true;

  // UI state
  setTicker("...");
  ticker.classList.remove("stopped");
  startBtn.disabled = true;
  stopBtn.disabled = false;
  rerollBtn.disabled = true;
  confirmBtn.disabled = true;

  spin();
}

function stop() {
  if (!spinning) return;

  spinning = false;

  // Si se quedó sin pool, no celebramos
  if (!currentName) {
    setTicker("No hay participantes elegibles");
    ticker.classList.add("stopped");
    refreshButtons();
    return;
  }

  // UI state
  ticker.classList.add("stopped");
  launchConfetti();

  refreshButtons();
}

function addWinner(name) {
  if (!name) {
    alert("No hay nombre seleccionado.");
    return;
  }

  if (!canAddMoreWinners()) {
    alert("Ya se alcanzó la cantidad de ganadores.");
    refreshButtons();
    return;
  }

  // Si noRepeat está activo, evitamos agregar duplicado igual (por seguridad)
  if (noRepeat.checked && winners.some(w => w.name === name)) {
    alert("Ese nombre ya fue ganador. Usa 'Volver a sortear'.");
    refreshButtons();
    return;
  }

  const item = { name, time: nowStr() };
  winners.push(item);

  winsCountEl.textContent = String(winners.length);

  const row = document.createElement("div");
  row.className = "winner";
  row.innerHTML = `
    <strong>${escapeHtml(name)}</strong>
    <small>${escapeHtml(item.time)}</small>
  `;
  winnersEl.prepend(row);

  // Si ya llegó al límite, bloquea acciones de sorteo
  if (!canAddMoreWinners()) {
    setTicker("Sorteo completado");
    currentName = null;
  } else {
    // Deja listo para el siguiente
    currentName = null;
    setTicker("Listo para el siguiente");
  }

  ticker.classList.remove("stopped");
  refreshButtons();
}

function reroll() {
  if (spinning) return;

  // Solo re-roll si aún faltan ganadores
  if (!canAddMoreWinners()) {
    alert("Ya se alcanzó la cantidad de ganadores.");
    refreshButtons();
    return;
  }

  // Start + auto stop para animación
  start();
  if (spinning) {
    setTimeout(() => stop(), 1200 + Math.random() * 900);
  }
}

function resetAll() {
  spinning = false;
  if (rafSpin) cancelAnimationFrame(rafSpin);
  rafSpin = null;

  winners = [];
  winnersEl.innerHTML = "";
  winsCountEl.textContent = "0";

  currentName = null;
  lastPoolEmpty = false;

  setTicker("Listo para comenzar");
  ticker.classList.remove("stopped");

  refreshButtons();
}

/* ============================================================
   EXPORTAR CSV
=========================================================== */
function exportCsv() {
  if (winners.length === 0) {
    alert("No hay ganadores para exportar.");
    return;
  }

  const header = "Nombre,Fecha y hora\n";
  const body = winners
    .map(w => `"${String(w.name).replace(/"/g, '""')}","${String(w.time).replace(/"/g, '""')}"`)
    .join("\n");

  const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "ganadores.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();

  setTimeout(() => URL.revokeObjectURL(url), 800);
}

/* ============================================================
   COLOR ACENTO (aplica variable al viewer)
=========================================================== */
function applyAccent() {
  if (!viewer) return;
  viewer.style.setProperty("--accent", (accent.value || "#22d3ee").trim());
}
accent.addEventListener("input", applyAccent);

/* ============================================================
   PANTALLA COMPLETA
=========================================================== */
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch?.(() => {});
  } else {
    document.exitFullscreen?.().catch?.(() => {});
  }
});

/* ============================================================
   HELPERS
=========================================================== */
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  }[c]));
}

/* ============================================================
   INTRO LOADER
=========================================================== */
window.addEventListener("load", () => {
  setTimeout(() => {
    $("#intro")?.classList.add("hidden");
  }, 700);
});

/* ============================================================
   EVENTOS (BOTONES DEL HTML)
=========================================================== */
startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);

confirmBtn.addEventListener("click", () => {
  addWinner(currentName);
});

rerollBtn.addEventListener("click", reroll);
resetBtn.addEventListener("click", resetAll);
exportCsvBtn.addEventListener("click", exportCsv);

/* ============================================================
   INIT
=========================================================== */
applyAccent();
syncParticipants();
refreshButtons();