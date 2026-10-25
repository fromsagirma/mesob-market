import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';
import {
  THEME_STORAGE_KEY,
  THEMES,
  isValidTheme,
  getNextTheme,
  resolveInitialTheme,
  applyThemeToDocument
} from '../lib/theme.js';
import { MockStorage } from './setup.js';

describe('Frontend Theme Store & Toggle Utilities', () => {
  let mockStorage;
  let mockDoc;

  beforeEach(() => {
    mockStorage = new MockStorage();
    const classSet = new Set();
    mockDoc = {
      documentElement: {
        classList: {
          add: (cls) => classSet.add(cls),
          remove: (cls) => classSet.delete(cls),
          contains: (cls) => classSet.has(cls)
        }
      }
    };
  });

  describe('Theme Validation & Toggling', () => {
    it('validates light and dark theme strings', () => {
      assert.strictEqual(isValidTheme('light'), true);
      assert.strictEqual(isValidTheme('dark'), true);
      assert.strictEqual(isValidTheme('neon'), false);
      assert.strictEqual(isValidTheme(null), false);
    });

    it('toggles between light and dark themes', () => {
      assert.strictEqual(getNextTheme(THEMES.LIGHT), THEMES.DARK);
      assert.strictEqual(getNextTheme(THEMES.DARK), THEMES.LIGHT);
    });
  });

  describe('Initial Theme Resolution', () => {
    it('reads saved theme from storage if present and valid', () => {
      mockStorage.setItem(THEME_STORAGE_KEY, 'dark');
      assert.strictEqual(resolveInitialTheme(mockStorage), 'dark');
    });

    it('falls back to light theme when storage is empty', () => {
      assert.strictEqual(resolveInitialTheme(mockStorage, false), 'light');
    });

    it('falls back to dark theme when system preference is dark and storage empty', () => {
      assert.strictEqual(resolveInitialTheme(mockStorage, true), 'dark');
    });
  });

  describe('applyThemeToDocument()', () => {
    it('adds dark class for dark theme and removes it for light theme', () => {
      applyThemeToDocument(THEMES.DARK, mockDoc);
      assert.strictEqual(mockDoc.documentElement.classList.contains('dark'), true);

      applyThemeToDocument(THEMES.LIGHT, mockDoc);
      assert.strictEqual(mockDoc.documentElement.classList.contains('dark'), false);
    });
  });
});
