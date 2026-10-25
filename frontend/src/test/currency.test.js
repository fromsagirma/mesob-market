import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';
import { formatCurrency, formatETB, formatCompactETB } from '../lib/currency.js';

describe('Frontend Currency Utilities', () => {
  describe('formatETB()', () => {
    it('formats integer amounts with two decimal places', () => {
      const result = formatETB(1500);
      assert.strictEqual(result, 'ETB 1,500.00');
    });

    it('formats float amounts accurately', () => {
      const result = formatETB(249.99);
      assert.strictEqual(result, 'ETB 249.99');
    });

    it('handles numeric string inputs correctly', () => {
      const result = formatETB('1250.5');
      assert.strictEqual(result, 'ETB 1,250.50');
    });

    it('falls back to 0.00 for invalid or null inputs', () => {
      assert.strictEqual(formatETB(null), 'ETB 0.00');
      assert.strictEqual(formatETB(undefined), 'ETB 0.00');
      assert.strictEqual(formatETB('not-a-number'), 'ETB 0.00');
    });
  });

  describe('formatCompactETB()', () => {
    it('formats numbers under 1,000 without suffix', () => {
      assert.strictEqual(formatCompactETB(500), '500 ETB');
    });

    it('formats thousands with K suffix', () => {
      assert.strictEqual(formatCompactETB(2500), '2.5K ETB');
      assert.strictEqual(formatCompactETB(10000), '10.0K ETB');
    });

    it('formats millions with M suffix', () => {
      assert.strictEqual(formatCompactETB(1500000), '1.5M ETB');
    });
  });

  describe('formatCurrency()', () => {
    it('formats ETB currency by default', () => {
      const result = formatCurrency(100);
      assert.match(result, /ETB/);
      assert.match(result, /100\.00/);
    });
  });
});
