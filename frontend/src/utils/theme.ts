export type AppTheme = "light" | "dark";

const themeColors: Record<AppTheme, string> = {
  light: "#ffffff",
  dark: "#1d232a",
};

export function applyTheme(theme: AppTheme) {
  document.documentElement.setAttribute("data-theme", theme);

  const themeColorMeta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  themeColorMeta?.setAttribute("content", themeColors[theme]);
}

export function getStoredTheme(): AppTheme {
  try {
    return window.localStorage.getItem("theme") === '"dark"' ? "dark" : "light";
  } catch {
    return "light";
  }
}
