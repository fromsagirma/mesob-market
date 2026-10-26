import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  BRAND_FULL_TITLE,
  formatPageTitle,
  getLogoSizeClasses
} from '../lib/brand.js';

describe('Frontend Brand Configuration & Title Utilities', () => {
  it('exposes correct brand constants', () => {
    assert.strictEqual(BRAND_NAME, 'Mesob Market');
    assert.strictEqual(BRAND_TAGLINE, 'Ethiopian E-Commerce Platform');
    assert.strictEqual(BRAND_FULL_TITLE, 'Mesob Market — Ethiopian E-Commerce Platform');
  });

  describe('formatPageTitle()', () => {
    it('formats specific page titles with brand suffix', () => {
      assert.strictEqual(formatPageTitle('Products'), 'Products | Mesob Market');
      assert.strictEqual(formatPageTitle('Checkout'), 'Checkout | Mesob Market');
      assert.strictEqual(formatPageTitle('My Cart'), 'My Cart | Mesob Market');
    });

    it('falls back to full default brand title when input is empty or null', () => {
      assert.strictEqual(formatPageTitle(''), BRAND_FULL_TITLE);
      assert.strictEqual(formatPageTitle(null), BRAND_FULL_TITLE);
      assert.strictEqual(formatPageTitle(undefined), BRAND_FULL_TITLE);
      assert.strictEqual(formatPageTitle('   '), BRAND_FULL_TITLE);
    });
  });

  describe('getLogoSizeClasses()', () => {
    it('returns appropriate tailwind classes for each size variant', () => {
      assert.match(getLogoSizeClasses('sm'), /h-8/);
      assert.match(getLogoSizeClasses('md'), /h-20/);
      assert.match(getLogoSizeClasses('lg'), /h-24/);
    });

    it('defaults to medium size for invalid or unknown size keys', () => {
      assert.strictEqual(getLogoSizeClasses('extra-large'), getLogoSizeClasses('md'));
      assert.strictEqual(getLogoSizeClasses(null), getLogoSizeClasses('md'));
    });
  });
});
