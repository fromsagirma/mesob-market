import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';
import { calculateDiscountedPrice, withDiscountedPrice } from '../../services/product.service.js';

describe('Discount Calculator', () => {
  it('should return the original price when discount is zero', () => {
    assert.strictEqual(calculateDiscountedPrice(1000, 0), 1000);
    assert.strictEqual(calculateDiscountedPrice(500), 500);
  });

  it('should correctly apply percentage discounts', () => {
    assert.strictEqual(calculateDiscountedPrice(1000, 20), 800);
    assert.strictEqual(calculateDiscountedPrice(250, 10), 225);
    assert.strictEqual(calculateDiscountedPrice(100, 50), 50);
  });

  it('should return 0 when discount is 100% or greater', () => {
    assert.strictEqual(calculateDiscountedPrice(1000, 100), 0);
    assert.strictEqual(calculateDiscountedPrice(500, 120), 0);
  });

  it('should treat negative discounts as zero', () => {
    assert.strictEqual(calculateDiscountedPrice(1000, -15), 1000);
  });

  it('should round fractional amounts to 2 decimal places', () => {
    // 99.99 with 15% discount: 99.99 * 0.85 = 84.9915 -> 84.99
    assert.strictEqual(calculateDiscountedPrice(99.99, 15), 84.99);
  });

  it('should enrich a product object with discountedPrice', () => {
    const raw = { name: 'Traditional Ethiopian Coffee Set', price: 1200, discount: 25 };
    const enriched = withDiscountedPrice(raw);

    assert.strictEqual(enriched.name, raw.name);
    assert.strictEqual(enriched.price, 1200);
    assert.strictEqual(enriched.discountedPrice, 900);
  });

  it('should return null if product document is null', () => {
    assert.strictEqual(withDiscountedPrice(null), null);
    assert.strictEqual(withDiscountedPrice(undefined), null);
  });
});
