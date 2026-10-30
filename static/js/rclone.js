"use strict";

// Las páginas técnicas comparten la misma preferencia visual que el sitio principal.
(() => {
  const button = document.getElementById("rclone-theme-toggle");
  if (!button) return;
  const meta = document.querySelector('meta[name="theme-color"]');
  const icon = button.querySelector(".rclone-theme-icon");
  const label = button.querySelector(".rclone-theme-text");

  function applyTheme(theme, persist = true) {
    const isDark = theme !== "light";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    icon.textContent = isDark ? "☀" : "☾";
    label.textContent = isDark ? "Claro" : "Oscuro";
    button.setAttribute("aria-label", isDark ? "Activar modo claro" : "Activar modo oscuro");
    button.title = isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    meta?.setAttribute("content", isDark ? "#08151c" : "#f7f9fc");
    if (persist) {
      try { localStorage.setItem("efm-theme", isDark ? "dark" : "light"); }
      catch { /* Conserva la preferencia solo durante esta visita. */ }
    }
  }

  applyTheme(document.documentElement.dataset.theme, false);
  button.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });
})();
