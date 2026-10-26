import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';
import { parseMonetaryValue } from '../../services/payment.service.js';

describe('Monetary Value Parser', () => {
  it('should parse standard numeric inputs', () => {
    assert.strictEqual(parseMonetaryValue(150), 150);
    assert.strictEqual(parseMonetaryValue(99.99), 99.99);
    assert.strictEqual(parseMonetaryValue(0), 0);
  });

  it('should parse numeric strings', () => {
    assert.strictEqual(parseMonetaryValue('2500'), 2500);
    assert.strictEqual(parseMonetaryValue('199.50'), 199.5);
  });

  it('should strip currency symbols and thousands separators', () => {
    assert.strictEqual(parseMonetaryValue('ETB 1,500.00'), 1500);
    assert.strictEqual(parseMonetaryValue('$ 3,450.75'), 3450.75);
    assert.strictEqual(parseMonetaryValue('  450 ETB  '), 450);
  });

  it('should return 0 for null, undefined, or empty values', () => {
    assert.strictEqual(parseMonetaryValue(null), 0);
    assert.strictEqual(parseMonetaryValue(undefined), 0);
    assert.strictEqual(parseMonetaryValue(''), 0);
    assert.strictEqual(parseMonetaryValue('abc'), 0);
  });

  it('should return 0 for non-finite values', () => {
    assert.strictEqual(parseMonetaryValue(Infinity), 0);
    assert.strictEqual(parseMonetaryValue(-Infinity), 0);
    assert.strictEqual(parseMonetaryValue(NaN), 0);
  });
});
