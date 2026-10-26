/**
 * Mesob Market - Theme Configuration and DOM Synchronization Utilities
 */

export const THEME_STORAGE_KEY = 'theme';

export const THEMES = Object.freeze({
  LIGHT: 'light',
  DARK: 'dark'
});

export function isValidTheme(theme) {
  return theme === THEMES.LIGHT || theme === THEMES.DARK;
}

export function getNextTheme(currentTheme) {
  return currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
}

export function resolveInitialTheme(storage = globalThis.localStorage, prefersDark = false) {
  try {
    const saved = storage?.getItem?.(THEME_STORAGE_KEY);
    if (isValidTheme(saved)) {
      return saved;
    }
  } catch {
    // Ignore storage read failures
  }
  return prefersDark ? THEMES.DARK : THEMES.LIGHT;
}

export function applyThemeToDocument(theme, doc = globalThis.document) {
  if (!doc?.documentElement?.classList) return;
  if (theme === THEMES.DARK) {
    doc.documentElement.classList.add('dark');
  } else {
    doc.documentElement.classList.remove('dark');
  }
}

export default {
  THEME_STORAGE_KEY,
  THEMES,
  isValidTheme,
  getNextTheme,
  resolveInitialTheme,
  applyThemeToDocument
};
