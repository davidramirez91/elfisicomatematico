"use strict";

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
    file: "./templates/formularios.html",
    title: "Formularios de ciencias | EL FÍSICO MATEMÁTICO",
  },
  contactos: {
    file: "./templates/contactos.html",
    title: "Contactos | EL FÍSICO MATEMÁTICO",
  },
});

// Mantiene compatibles enlaces antiguos que pudieran estar compartidos.
const ROUTE_ALIASES = Object.freeze({
  empresa: "precios",
  formulario: "formularios",
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

function normalizeRoute(routeName) {
  const normalized = String(routeName || "")
    .replace(/^#/, "")
    .trim()
    .toLowerCase();

  return ROUTE_ALIASES[normalized] || normalized;
}

function getRouteFromHash() {
  const routeName = normalizeRoute(window.location.hash);
  return ROUTES[routeName] ? routeName : "inicio";
}

function isCompactNavigation() {
  return (
    window.innerWidth <= MOBILE_BREAKPOINT ||
    window.matchMedia("(hover: none)").matches
  );
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

function updateActiveNavigation(routeName) {
  document.querySelectorAll("[data-route]").forEach((link) => {
    const isActive = link.dataset.route === routeName;

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  submenuItem?.classList.toggle(
    "is-active",
    routeName === "precios" || routeName === "formularios",
  );
}

async function loadRoute(routeName) {
  const canonicalRoute = normalizeRoute(routeName);
  const route = ROUTES[canonicalRoute] || ROUTES.inicio;

  if (!app) return;

  app.innerHTML = `
    <div class="page-loader" role="status">
      <span></span>
      <p>Cargando contenido…</p>
    </div>
  `;

  try {
    const response = await fetch(route.file, { cache: "no-cache" });

    if (!response.ok) {
      throw new Error(`No fue posible cargar ${route.file}`);
    }

    app.innerHTML = await response.text();
    document.title = route.title;

    updateActiveNavigation(canonicalRoute);
    initializeLoadedTemplate(canonicalRoute);
    closeMobileMenu();

    await typesetMath(app);

    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error(error);
    app.innerHTML = `
      <section class="error-panel">
        <h1>No se pudo cargar la sección</h1>
        <p>
          Comprueba que los archivos estén en las carpetas
          <code>templates</code> y <code>static</code>. Para probar localmente,
          utiliza Live Server u otro servidor HTTP.
        </p>
        <a class="btn btn-primary" href="#inicio">Volver al inicio</a>
      </section>
    `;
  }
}

function initializeLoadedTemplate(routeName) {
  if (routeName === "formularios") {
    initializeFormulaTabs();
  }
}

function initializeFormulaTabs() {
  const tabs = [...document.querySelectorAll(".formula-tab")];
  const panels = [...document.querySelectorAll(".formula-panel")];
  const emptyState = document.querySelector("#formula-empty");

  // Guarda el LaTeX original para que la vista de impresión no copie el SVG de MathJax.
  panels.forEach((panel) => {
    panel.__latexSource = panel.innerHTML;
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      const targetPanel = document.getElementById(tab.dataset.formulaTarget);
      if (!targetPanel) return;

      tabs.forEach((button) => {
        const isActive = button === tab;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
      });

      panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel === targetPanel);
      });

      if (emptyState) {
        emptyState.hidden = true;
      }

      await typesetMath(targetPanel);
      targetPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

async function typesetMath(container) {
  if (!container || !window.MathJax?.typesetPromise) return;

  try {
    await window.MathJax.typesetPromise([container]);
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
  const logoUrl = new URL("./static/img/logo.png", window.location.href).href;
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
      ? "light"
      : "dark";
  } catch {
    return "dark";
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // El tema sigue funcionando aunque el navegador bloquee localStorage.
  }
}

function applyTheme(theme, persist = true) {
  const normalizedTheme = theme === "light" ? "light" : "dark";
  const darkMode = normalizedTheme === "dark";

  document.documentElement.dataset.theme = normalizedTheme;

  if (persist) {
    saveTheme(normalizedTheme);
  }

  const icon = themeToggle?.querySelector(".theme-icon");
  const text = themeToggle?.querySelector(".theme-text");

  if (icon) icon.textContent = darkMode ? "☀" : "☾";
  if (text) text.textContent = darkMode ? "Claro" : "Oscuro";

  themeToggle?.setAttribute(
    "aria-label",
    darkMode ? "Activar modo claro" : "Activar modo oscuro",
  );
  themeToggle?.setAttribute(
    "title",
    darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro",
  );
  themeColorMeta?.setAttribute("content", darkMode ? "#08151c" : "#f7f9fc");
}


function initializeTheme() {
  applyTheme(readSavedTheme(), false);
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
  menu?.classList.toggle("is-open", !isOpen);

  if (isOpen) closeSubmenu();
});

submenuTrigger?.addEventListener("click", (event) => {
  if (!isCompactNavigation()) return;

  event.preventDefault();
  event.stopPropagation();
  toggleSubmenu();
});

themeToggle?.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

document.addEventListener("click", (event) => {
  const printButton = event.target.closest("[data-print-section]");
  if (printButton) {
    openPrintView(printButton.dataset.printSection);
    return;
  }

  if (!submenuItem?.contains(event.target)) {
    closeSubmenu();
  }

  const routeLink = event.target.closest("a[href^='#']");
  if (routeLink && window.innerWidth <= MOBILE_BREAKPOINT) {
    closeMobileMenu();
  }
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

  if (window.location.hash !== expectedHash) {
    history.replaceState(null, "", expectedHash);
  }

  loadRoute(routeName);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > MOBILE_BREAKPOINT) {
    closeMobileMenu();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();

  const initialRoute = getRouteFromHash();
  const expectedHash = `#${initialRoute}`;

  if (window.location.hash !== expectedHash) {
    history.replaceState(null, "", expectedHash);
  }

  loadRoute(initialRoute);
});
