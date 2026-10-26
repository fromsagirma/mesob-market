import { create } from 'zustand';
import {
  THEME_STORAGE_KEY,
  THEMES,
  isValidTheme,
  getNextTheme,
  resolveInitialTheme,
  applyThemeToDocument
} from '../lib/theme.js';

const useThemeStore = create((set, get) => ({
  theme: resolveInitialTheme(),

  setTheme: (theme) => {
    const validTheme = isValidTheme(theme) ? theme : THEMES.LIGHT;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, validTheme);
    } catch {
      // ignore storage failure
    }
    applyThemeToDocument(validTheme);
    set({ theme: validTheme });
  },

  toggleTheme: () => {
    const current = get().theme;
    const next = getNextTheme(current);
    get().setTheme(next);
  },

  initTheme: () => {
    const theme = resolveInitialTheme();
    applyThemeToDocument(theme);
    set({ theme });
  }
}));

export default useThemeStore;
