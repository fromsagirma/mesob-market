import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';
import {
  DEFAULT_TAX_RATE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  calculateOrderSummary
} from '../lib/orderSummary.js';

describe('Frontend Order Fee and Tax Calculator', () => {
  it('calculates standard 8% tax accurately', () => {
    const summary = calculateOrderSummary({ subtotal: 1000 });
    assert.strictEqual(summary.subtotal, 1000);
    assert.strictEqual(summary.tax, 80);
    assert.strictEqual(summary.grandTotal, 1080);
  });

  it('applies discount before tax calculation', () => {
    const summary = calculateOrderSummary({ subtotal: 1000, discount: 200 });
    assert.strictEqual(summary.discountedSubtotal, 800);
    assert.strictEqual(summary.tax, 64); // 8% of 800
    assert.strictEqual(summary.grandTotal, 864);
  });

  describe('Shipping fee rules', () => {
    it('applies standard delivery fee when subtotal is below free shipping threshold', () => {
      const summary = calculateOrderSummary({ subtotal: 500, includeShipping: true });
      assert.strictEqual(summary.shipping, STANDARD_SHIPPING_FEE);
      assert.strictEqual(summary.isFreeShipping, false);
      assert.strictEqual(summary.grandTotal, 500 + 40 + STANDARD_SHIPPING_FEE);
    });

    it('waives delivery fee when subtotal meets or exceeds 1,500 ETB', () => {
      const summary = calculateOrderSummary({ subtotal: FREE_SHIPPING_THRESHOLD, includeShipping: true });
      assert.strictEqual(summary.shipping, 0);
      assert.strictEqual(summary.isFreeShipping, true);
      assert.strictEqual(summary.grandTotal, 1500 + 120);
    });
  });

  describe('Edge cases and input sanitization', () => {
    it('handles empty cart (subtotal 0) safely', () => {
      const summary = calculateOrderSummary({ subtotal: 0, includeShipping: true });
      assert.strictEqual(summary.subtotal, 0);
      assert.strictEqual(summary.tax, 0);
      assert.strictEqual(summary.shipping, 0);
      assert.strictEqual(summary.grandTotal, 0);
    });

    it('clamps negative subtotals to zero', () => {
      const summary = calculateOrderSummary({ subtotal: -50 });
      assert.strictEqual(summary.subtotal, 0);
      assert.strictEqual(summary.grandTotal, 0);
    });

    it('caps discount amount to not exceed subtotal', () => {
      const summary = calculateOrderSummary({ subtotal: 100, discount: 500 });
      assert.strictEqual(summary.discount, 100);
      assert.strictEqual(summary.discountedSubtotal, 0);
      assert.strictEqual(summary.grandTotal, 0);
    });
  });
});
