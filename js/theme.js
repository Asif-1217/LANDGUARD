/**
 * LANDGUARD — Land Conflict Intelligence System
 * Theme Controller — Light & Dark Mode
 *
 * Handles persistent theme selection with system preference detection
 * and accessibility support.
 */

const ThemeManager = (() => {
  const STORAGE_KEY = "landguard_theme";

  function getSystemPreference() {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  }

  let currentTheme = (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY)) || getSystemPreference();

  function applyTheme(theme) {
    currentTheme = theme === "dark" ? "dark" : "light";
    if (typeof document !== "undefined" && document.documentElement && document.documentElement.setAttribute) {
      document.documentElement.setAttribute("data-theme", currentTheme);
      updateThemeButtons();
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, currentTheme);
    }
    if (typeof window !== "undefined" && typeof CustomEvent !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("landguard_theme_changed", { detail: { theme: currentTheme } }));
    }
  }

  function updateThemeButtons() {
    const btns = document.querySelectorAll("[data-theme-toggle]");
    btns.forEach(btn => {
      const isDark = currentTheme === "dark";
      btn.setAttribute("aria-label", isDark ? I18n.t("themeLight", "Light Mode") : I18n.t("themeDark", "Dark Mode"));
      btn.setAttribute("title", isDark ? I18n.t("themeLight", "Light Mode") : I18n.t("themeDark", "Dark Mode"));
      btn.innerHTML = isDark
        ? `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
        : `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    });
  }

  function toggleTheme() {
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  }

  function init() {
    // System listener if no manual preference stored
    if (typeof window !== "undefined" && window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? "dark" : "light");
        }
      });
    }

    applyTheme(currentTheme);
  }

  return {
    init,
    toggleTheme,
    getTheme: () => currentTheme,
    setTheme: applyTheme
  };
})();

// Immediate application to prevent theme flash
if (typeof document !== "undefined") {
  const initialTheme = (typeof localStorage !== "undefined" && localStorage.getItem("landguard_theme")) ||
    (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initialTheme);
}
