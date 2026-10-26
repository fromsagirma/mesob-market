import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';
import {
  resolveProductId,
  mergeCartItem,
  updateCartItemQuantity,
  removeCartItem,
  calculateCartTotals
} from '../lib/cartCalculations.js';

describe('Frontend Cart Store & Calculation Actions', () => {
  describe('resolveProductId()', () => {
    it('extracts ID from various product object shapes', () => {
      assert.strictEqual(resolveProductId({ product: { _id: 'prod-123' } }), 'prod-123');
      assert.strictEqual(resolveProductId({ product: 'prod-456' }), 'prod-456');
      assert.strictEqual(resolveProductId({ productId: { _id: 'prod-789' } }), 'prod-789');
      assert.strictEqual(resolveProductId({ id: 'prod-000' }), 'prod-000');
      assert.strictEqual(resolveProductId(null), null);
    });
  });

  describe('mergeCartItem()', () => {
    it('appends a new product when not currently in cart', () => {
      const items = [{ product: 'prod-1', quantity: 1, price: 100 }];
      const result = mergeCartItem(items, { product: 'prod-2', quantity: 2, price: 50 });

      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[1].product, 'prod-2');
      assert.strictEqual(result[1].quantity, 2);
    });

    it('increments quantity when product already exists in cart', () => {
      const items = [{ product: 'prod-1', quantity: 2, price: 100 }];
      const result = mergeCartItem(items, { product: 'prod-1', quantity: 3, price: 100 });

      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].quantity, 5);
    });

    it('throws error when product has no resolvable ID', () => {
      assert.throws(() => mergeCartItem([], {}), /Invalid product data/);
    });
  });

  describe('updateCartItemQuantity() and removeCartItem()', () => {
    it('updates quantity of existing item', () => {
      const items = [{ product: 'prod-1', quantity: 1, price: 100 }];
      const result = updateCartItemQuantity(items, 'prod-1', 4);
      assert.strictEqual(result[0].quantity, 4);
    });

    it('removes item if updated quantity is 0 or negative', () => {
      const items = [{ product: 'prod-1', quantity: 1, price: 100 }];
      const result = updateCartItemQuantity(items, 'prod-1', 0);
      assert.strictEqual(result.length, 0);
    });

    it('removes specific item by product ID', () => {
      const items = [
        { product: 'prod-1', quantity: 1, price: 100 },
        { product: 'prod-2', quantity: 2, price: 200 }
      ];
      const result = removeCartItem(items, 'prod-1');
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].product, 'prod-2');
    });
  });

  describe('calculateCartTotals()', () => {
    it('calculates totalPrice and totalCount accurately', () => {
      const items = [
        { product: 'prod-1', quantity: 2, price: 250 },
        { product: 'prod-2', quantity: 1, price: 150.5 }
      ];
      const { totalPrice, totalCount } = calculateCartTotals(items);
      assert.strictEqual(totalPrice, 650.5);
      assert.strictEqual(totalCount, 3);
    });

    it('returns zero totals for empty cart', () => {
      const { totalPrice, totalCount } = calculateCartTotals([]);
      assert.strictEqual(totalPrice, 0);
      assert.strictEqual(totalCount, 0);
    });
  });
});
