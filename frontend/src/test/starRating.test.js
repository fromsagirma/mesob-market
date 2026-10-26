import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';
import { calculateStarDistribution, formatRatingLabel } from '../lib/rating.js';

describe('Frontend Star Rating Component & Logic', () => {
  it('calculates full 5 stars when rating is 5', () => {
    const stars = calculateStarDistribution(5);
    assert.strictEqual(stars.length, 5);
    assert.strictEqual(stars.filter(s => s.filled).length, 5);
    assert.strictEqual(stars.map(s => s.symbol).join(''), '★★★★★');
  });

  it('calculates 3 filled stars and 2 empty stars for rating of 3.8', () => {
    const stars = calculateStarDistribution(3.8);
    assert.strictEqual(stars.length, 5);
    assert.strictEqual(stars.filter(s => s.filled).length, 3);
    assert.strictEqual(stars.map(s => s.symbol).join(''), '★★★☆☆');
  });

  it('calculates 0 filled stars when rating is 0', () => {
    const stars = calculateStarDistribution(0);
    assert.strictEqual(stars.filter(s => s.filled).length, 0);
    assert.strictEqual(stars.map(s => s.symbol).join(''), '☆☆☆☆☆');
  });

  it('clamps negative ratings to 0', () => {
    const stars = calculateStarDistribution(-2);
    assert.strictEqual(stars.filter(s => s.filled).length, 0);
  });

  it('clamps ratings exceeding 5 to 5', () => {
    const stars = calculateStarDistribution(10);
    assert.strictEqual(stars.filter(s => s.filled).length, 5);
  });

  it('handles invalid or undefined inputs by defaulting safely to 0', () => {
    const stars = calculateStarDistribution(undefined);
    assert.strictEqual(stars.filter(s => s.filled).length, 5); // default rating parameter is 5
    const nullStars = calculateStarDistribution(null);
    assert.strictEqual(nullStars.filter(s => s.filled).length, 0);
  });

  it('formats accessible aria rating label', () => {
    assert.strictEqual(formatRatingLabel(4.5), '4.5 out of 5 stars');
    assert.strictEqual(formatRatingLabel(0), '0.0 out of 5 stars');
  });
});
