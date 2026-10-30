"use strict";

// Aquí se registran TODOS los formularios. Añadir un tema solo requiere:
// 1) Crear templates/formulario_nuevo_tema.html (ver README.md).
// 2) Añadir un objeto a FORMULA_TOPICS. La biblioteca y el menú se generan solos.
const FORMULA_TOPICS = Object.freeze([
  {
    route: "formulario_identidades",
    file: "./templates/formulario_identidades.html",
    label: "Identidades",
    title: "Identidades trigonométricas",
    description: "Relaciones trigonométricas, círculo unitario y triángulos notables.",
    icon: "θ",
    group: "Matemáticas",
  },
  {
    route: "formulario_logaritmos",
    file: "./templates/formulario_logaritmos.html",
    label: "Potencias y logaritmos",
    title: "Potencias y logaritmos",
    description: "Propiedades de exponentes, radicales y leyes de los logaritmos.",
    icon: "log",
    group: "Matemáticas",
  },
  {
    route: "formulario_derivadas",
    file: "./templates/formulario_derivadas.html",
    label: "Límites y derivadas",
    title: "Cálculo 1 · Límites y derivadas",
    description: "Límites notables, reglas de derivación y funciones elementales.",
    icon: "d/dx",
    group: "Cálculo",
  },
  {
    route: "formulario_integrales",
    file: "./templates/formulario_integrales.html",
    label: "Integrales",
    title: "Cálculo 2 · Integrales",
    description: "Integrales inmediatas, sustitución, partes y aplicaciones.",
    icon: "∫",
    group: "Cálculo",
  },
  {
    route: "formulario_edos",
    file: "./templates/formulario_edos.html",
    label: "Ecuaciones diferenciales",
    title: "Cálculo 3 · Ecuaciones diferenciales",
    description: "EDO de primer orden, orden superior y transformada de Laplace.",
    icon: "y′",
    group: "Cálculo",
  },
  {
    route: "formulario_fourier_taylor",
    file: "./templates/formulario_fourier_taylor.html",
    label: "Fourier y Taylor",
    title: "Cálculo 4 · Fourier y Taylor",
    description: "Series de Taylor, Fourier y transformadas frecuentes.",
    icon: "Σ",
    group: "Cálculo",
  },
  {
    route: "formulario_fisica",
    file: "./templates/formulario_fisica.html",
    label: "Física",
    title: "Física · Compendio principal",
    description: "Mecánica, fluidos, termodinámica, electricidad, ondas y óptica.",
    icon: "F",
    group: "Física",
  },
]);

const FORMULA_BY_ROUTE = Object.freeze(
  Object.fromEntries(FORMULA_TOPICS.map((topic) => [topic.route, topic])),
);

const ROUTES = Object.freeze({
  inicio: {
    file: "./templates/inicio.html",
    title: "Inicio | EL FÍSICO MATEMÁTICO",
  },
  precios: {
    file: "./templates/elfisicomatematico.html",
    title: "Cursos, horarios y precios | EL FÍSICO MATEMÁTICO",
  },
  formularios: {
    file: null, // La biblioteca se construye automáticamente, sin formularios.html.
    title: "Biblioteca de formularios | EL FÍSICO MATEMÁTICO",
  },
  contactos: {
    file: "./templates/contactos.html",
    title: "Contactos | EL FÍSICO MATEMÁTICO",
  },
  ...Object.fromEntries(
    FORMULA_TOPICS.map((topic) => [topic.route, {
      file: topic.file,
      title: `${topic.title} | EL FÍSICO MATEMÁTICO`,
    }]),
  ),
});

// Enlaces anteriores siguen dirigiendo a la biblioteca general.
const ROUTE_ALIASES = Object.freeze({
  empresa: "precios",
  formulario: "formularios",
  formulario_fourier: "formulario_fourier_taylor",
});

const MOBILE_BREAKPOINT = 790;
const THEME_STORAGE_KEY = "efm-theme";

const app = document.querySelector("#app");
const menu = document.querySelector("#main-menu");
const menuToggle = document.querySelector("#menu-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const submenuItem = document.querySelector(".menu-item--submenu");
const submenuTrigger = document.querySelector("#submenu-trigger");
const submenu = document.querySelector("#formula-submenu");
let latestRouteLoad = 0;

function normalizeRoute(routeName) {
  const normalized = String(routeName || "")
    .replace(/^#/, "")
    .trim()
    .toLowerCase();
  return ROUTE_ALIASES[normalized] || normalized;
}

// Los fragmentos #... siguen siendo la navegación habitual.
// Para compartir una sección con vista previa social, también aceptamos
// ?seccion=..., porque los rastreadores HTTP no reciben fragmentos de URL.
function getRouteFromHash() {
  const sharedRoute = new URLSearchParams(window.location.search).get("seccion");
  const routeName = normalizeRoute(window.location.hash || sharedRoute);
  return Object.hasOwn(ROUTES, routeName) ? routeName : "inicio";
}

function closeSubmenu() {
  submenuItem?.classList.remove("submenu-open");
  submenuTrigger?.setAttribute("aria-expanded", "false");
}

function toggleSubmenu() {
  if (!submenuItem || !submenuTrigger) return;
  const isOpen = submenuItem.classList.toggle("submenu-open");
  submenuTrigger.setAttribute("aria-expanded", String(isOpen));
}

function closeMobileMenu() {
  menu?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir menú");
  closeSubmenu();
}

function renderFormulaSubmenu() {
  if (!submenu) return;
  submenu.innerHTML = FORMULA_TOPICS.map((topic) =>
    `<a href="#${topic.route}" data-route="${topic.route}">${escapeHtml(topic.label)}</a>`,
  ).join("");
}

function updateActiveNavigation(routeName) {
  const isFormulas = routeName === "formularios" || Boolean(FORMULA_BY_ROUTE[routeName]);
  document.querySelectorAll("[data-route]").forEach((link) => {
    const isActive = link.dataset.route === routeName ||
      (link.dataset.route === "formularios" && isFormulas);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  submenuItem?.classList.toggle("is-active", isFormulas);
}

function renderFormulaCatalog() {
  return `
    <section class="page-section formula-page formula-catalog">
      <header class="section-heading">
        <span class="eyebrow">Biblioteca de consulta</span>
        <h1>Formularios de Matemática, Cálculo y Física</h1>
        <p>Selecciona un tema para consultar sus fórmulas y abrir su versión A4,
           lista para imprimir o guardar como PDF.</p>
      </header>
      <div class="formula-catalog-meta" aria-label="Cantidad de formularios">
        <span>${FORMULA_TOPICS.length} formularios disponibles</span>
        <span>Contenido independiente por tema</span>
      </div>
      <div class="formula-catalog-grid">
        ${FORMULA_TOPICS.map((topic) => `
          <a class="formula-topic-card" href="#${topic.route}">
            <span class="formula-topic-icon" aria-hidden="true">${escapeHtml(topic.icon)}</span>
            <span class="formula-topic-copy">
              <span class="formula-topic-category">${escapeHtml(topic.group)}</span>
              <strong>${escapeHtml(topic.title)}</strong>
              <span>${escapeHtml(topic.description)}</span>
              <span class="formula-topic-action">Abrir formulario <span aria-hidden="true">→</span></span>
            </span>
          </a>
        `).join("")}
      </div>
    </section>`;
}

function initializeLoadedTemplate(routeName) {
  const topic = FORMULA_BY_ROUTE[routeName];
  if (!topic) return;
  const section = app?.querySelector(".formula-panel");
  if (section) {
    // La impresión conserva el LaTeX original, no el SVG generado por MathJax.
    section.__latexSource = section.innerHTML;
  }
  const topicIndex = FORMULA_TOPICS.indexOf(topic);
  const previous = FORMULA_TOPICS[topicIndex - 1];
  const next = FORMULA_TOPICS[topicIndex + 1];
  const navigation = app?.querySelector("[data-topic-navigation]");
  if (navigation) {
    navigation.innerHTML = `
      ${previous ? `<a href="#${previous.route}" aria-label="Formulario anterior: ${escapeHtml(previous.label)}">← ${escapeHtml(previous.label)}</a>` : "<span></span>"}
      <a href="#formularios">Todos los formularios</a>
      ${next ? `<a href="#${next.route}" aria-label="Formulario siguiente: ${escapeHtml(next.label)}">${escapeHtml(next.label)} →</a>` : "<span></span>"}
    `;
  }
}

async function loadRoute(routeName) {
  const loadId = ++latestRouteLoad;
  const canonicalRoute = normalizeRoute(routeName);
  const route = ROUTES[canonicalRoute] || ROUTES.inicio;
  if (!app) return;

  // Evita dejar referencias de MathJax a nodos que ya no están en el DOM.
  window.MathJax?.typesetClear?.([app]);
  if (canonicalRoute === "formularios") {
    app.innerHTML = renderFormulaCatalog();
    document.title = route.title;
    updateActiveNavigation(canonicalRoute);
    closeMobileMenu();
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }

  app.innerHTML = `
    <div class="page-loader" role="status"><span></span><p>Cargando contenido…</p></div>`;
  try {
    const response = await fetch(route.file, { cache: "no-cache" });
    if (!response.ok) throw new Error(`No fue posible cargar ${route.file}`);
    const html = await response.text();
    if (loadId !== latestRouteLoad) return;
    app.innerHTML = html;
    document.title = route.title;
    updateActiveNavigation(canonicalRoute);
    initializeLoadedTemplate(canonicalRoute);
    closeMobileMenu();
    await typesetMath(app);
    if (loadId !== latestRouteLoad) return;
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  } catch (error) {
    if (loadId !== latestRouteLoad) return;
    console.error(error);
    app.innerHTML = `
      <section class="error-panel">
        <h1>No se pudo cargar la sección</h1>
        <p>Comprueba que el archivo HTML exista en <code>templates/</code>.
           Para probar el sitio localmente, utiliza Live Server o un servidor HTTP.</p>
        <a class="btn btn-primary" href="#formularios">Ir a los formularios</a>
      </section>`;
  }
}

async function typesetMath(container) {
  if (!container || !window.MathJax) return;
  try {
    if (window.MathJax.startup?.promise) await window.MathJax.startup.promise;
    if (window.MathJax.typesetPromise) await window.MathJax.typesetPromise([container]);
  } catch (error) {
    console.warn("MathJax no pudo procesar alguna fórmula.", error);
  }
}

function openPrintView(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    window.alert(
      "El navegador bloqueó la pestaña de impresión. Habilita las ventanas emergentes para este sitio.",
    );
    return;
  }

  const sourceHtml = section.__latexSource || section.innerHTML;
  const logoUrl = new URL("./static/img/logo.png", document.baseURI).href;
  const baseUrl = new URL("./", document.baseURI).href;
  const title =
    section.querySelector("h2")?.textContent?.trim() || "Formulario académico";
  const cleanContent = sourceHtml.replace(/<button[\s\S]*?<\/button>/gi, "");

  printWindow.opener = null;
  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <base href="${escapeHtml(baseUrl)}" />
  <title>${escapeHtml(title)} | EL FÍSICO MATEMÁTICO</title>
  <script>
    window.MathJax = {
      tex: {
        inlineMath: [["\\\\(", "\\\\)"]],
        displayMath: [["$$", "$$"], ["\\\\[", "\\\\]"]]
      },
      svg: { fontCache: "local" }
    };
  <\/script>
  <script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"><\/script>
  <style>
    @page { size: A4; margin: 15mm 14mm 20mm; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #142033; background: #e9eef3; font-family: Arial, Helvetica, sans-serif; line-height: 1.5; }
    .print-toolbar { position: sticky; top: 0; z-index: 10; display: flex; justify-content: center; padding: 12px; background: #0b5f73; }
    .print-toolbar button { padding: 10px 18px; border: 0; border-radius: 9px; color: #fff; background: #cf8b21; font-weight: 700; cursor: pointer; }
    .sheet { position: relative; width: min(210mm, 100%); min-height: 297mm; margin: 18px auto; padding: 14mm 14mm 22mm; overflow: visible; background: #fff; box-shadow: 0 18px 45px rgba(0,0,0,.16); }
    .print-header { position: relative; z-index: 2; display: grid; grid-template-columns: 74px 1fr; align-items: center; padding-bottom: 10px; gap: 14px; border-bottom: 2px solid #0b5f73; }
    .print-header img { width: 68px; height: 68px; object-fit: contain; }
    .print-header h1 { margin: 0; color: #073f4c; font-family: Georgia, serif; font-size: 20px; letter-spacing: .03em; }
    .print-header p { margin: 3px 0 0; color: #596776; font-size: 12px; }
    .watermark { position: fixed; top: 50%; left: 50%; z-index: 0; width: 105mm; max-height: 105mm; opacity: .05; object-fit: contain; transform: translate(-50%, -50%); pointer-events: none; }
    .print-content { position: relative; z-index: 1; padding: 13px 0 20px; }
    .formula-panel-header { display: none; }
    .formula-grid { display: block; }
    .formula-card { break-inside: avoid; margin: 0 0 12px; padding: 12px 14px; border: 1px solid #cfd9df; border-radius: 8px; background: rgba(255,255,255,.94); }
    .formula-card h3 { margin: 0 0 8px; color: #073f4c; font-size: 15px; }
    .formula-card h4 { margin: 12px 0 5px; color: #9b6113; }
    .formula-card p, .formula-card li { font-size: 11px; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; }
    th, td { padding: 5px; border: 1px solid #cfd9df; text-align: center; }
    .formula-note { padding: 8px 10px; border-left: 3px solid #cf8b21; background: #fff7e7; font-size: 10px; }
    mjx-container { max-width: 100%; overflow: visible !important; font-size: 91% !important; }
    .print-footer { position: fixed; right: 14mm; bottom: 7mm; left: 14mm; z-index: 3; display: flex; justify-content: space-between; padding-top: 5px; gap: 12px; border-top: 1px solid #91a4ae; color: #4f5e69; font-size: 9.5px; }
    @media print {
      body { background: #fff; }
      .print-toolbar { display: none; }
      .sheet { width: auto; min-height: auto; margin: 0; padding: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="print-toolbar">
    <button type="button" onclick="window.print()">Imprimir o guardar como PDF</button>
  </div>
  <main class="sheet">
    <img class="watermark" src="${logoUrl}" alt="" />
    <header class="print-header">
      <img src="${logoUrl}" alt="Logo de EL FÍSICO MATEMÁTICO" />
      <div>
        <h1>EL FÍSICO MATEMÁTICO</h1>
        <p>${escapeHtml(title)} · Comprende, practica y destaca</p>
      </div>
    </header>
    <section class="print-content">${cleanContent}</section>
    <footer class="print-footer">
      <span>Av. Canónigo Ramos &amp; Luis Moscoso · A una cuadra de la ESPOCH</span>
      <span>0998998947 · 0961940111</span>
    </footer>
  </main>
</body>
</html>`);
  printWindow.document.close();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function readSavedTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "light"
      ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // El tema continúa funcionando aunque localStorage esté bloqueado.
  }
}

function applyTheme(theme, persist = true) {
  const normalizedTheme = theme === "light" ? "light" : "dark";
  const darkMode = normalizedTheme === "dark";
  document.documentElement.dataset.theme = normalizedTheme;
  if (persist) saveTheme(normalizedTheme);
  const icon = themeToggle?.querySelector(".theme-icon");
  const text = themeToggle?.querySelector(".theme-text");
  if (icon) icon.textContent = darkMode ? "☀" : "☾";
  if (text) text.textContent = darkMode ? "Claro" : "Oscuro";
  themeToggle?.setAttribute("aria-label", darkMode ? "Activar modo claro" : "Activar modo oscuro");
  themeToggle?.setAttribute("title", darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  themeColorMeta?.setAttribute("content", darkMode ? "#08151c" : "#f7f9fc");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  menu?.classList.toggle("is-open", !isOpen);
  if (isOpen) closeSubmenu();
});

submenuTrigger?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  toggleSubmenu();
});

themeToggle?.addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const printButton = target.closest("[data-print-section]");
  if (printButton) {
    openPrintView(printButton.dataset.printSection);
    return;
  }
  if (!submenuItem?.contains(target)) closeSubmenu();
  const routeLink = target.closest("a[href^='#']");
  if (routeLink && window.innerWidth <= MOBILE_BREAKPOINT) closeMobileMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSubmenu();
    closeMobileMenu();
  }
});

window.addEventListener("hashchange", () => {
  const routeName = getRouteFromHash();
  const expectedHash = `#${routeName}`;
  if (window.location.hash !== expectedHash) history.replaceState(null, "", expectedHash);
  loadRoute(routeName);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > MOBILE_BREAKPOINT) closeMobileMenu();
});

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(readSavedTheme(), false);
  renderFormulaSubmenu();
  const initialRoute = getRouteFromHash();
  const expectedHash = `#${initialRoute}`;
  if (window.location.hash !== expectedHash) history.replaceState(null, "", expectedHash);
  loadRoute(initialRoute);
});
