import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';
import {
  calculateTotalPages,
  calculatePaginationPages,
  hasPreviousPage,
  hasNextPage
} from '../lib/pagination.js';

describe('Frontend Pagination Utilities', () => {
  describe('calculateTotalPages()', () => {
    it('calculates pages accurately based on total items and pageSize', () => {
      assert.strictEqual(calculateTotalPages(25, 12), 3);
      assert.strictEqual(calculateTotalPages(24, 12), 2);
      assert.strictEqual(calculateTotalPages(0, 12), 1);
    });

    it('handles negative or invalid numbers safely', () => {
      assert.strictEqual(calculateTotalPages(-10, 10), 1);
      assert.strictEqual(calculateTotalPages(null, null), 1);
    });
  });

  describe('calculatePaginationPages()', () => {
    it('returns single page array when totalPages is 1', () => {
      assert.deepStrictEqual(calculatePaginationPages(1, 1), [1]);
    });

    it('returns complete sequence when totalPages is small (<= 5)', () => {
      assert.deepStrictEqual(calculatePaginationPages(2, 4), [1, 2, 3, 4]);
    });

    it('includes right ellipsis when current is near start of large list', () => {
      const pages = calculatePaginationPages(1, 10);
      assert.deepStrictEqual(pages, [1, 2, '…', 10]);
    });

    it('includes left ellipsis when current is near end of large list', () => {
      const pages = calculatePaginationPages(10, 10);
      assert.deepStrictEqual(pages, [1, '…', 9, 10]);
    });

    it('includes both left and right ellipses when current is in middle', () => {
      const pages = calculatePaginationPages(5, 10);
      assert.deepStrictEqual(pages, [1, '…', 4, 5, 6, '…', 10]);
    });
  });

  describe('navigation helpers', () => {
    it('determines if previous page exists', () => {
      assert.strictEqual(hasPreviousPage(1), false);
      assert.strictEqual(hasPreviousPage(2), true);
    });

    it('determines if next page exists', () => {
      assert.strictEqual(hasNextPage(5, 5), false);
      assert.strictEqual(hasNextPage(4, 5), true);
    });
  });
});
