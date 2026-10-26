import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';
import { validatePasswordComplexity } from '../../utils/passwordValidator.js';

describe('Password Complexity Validator', () => {
  it('should reject missing or empty passwords', () => {
    assert.strictEqual(validatePasswordComplexity('').isValid, false);
    assert.strictEqual(validatePasswordComplexity(null).isValid, false);
    assert.strictEqual(validatePasswordComplexity(undefined).isValid, false);
  });

  it('should reject passwords shorter than 8 characters', () => {
    const res = validatePasswordComplexity('Short1!');
    assert.strictEqual(res.isValid, false);
    assert.match(res.message, /at least 8 characters/i);
  });

  it('should reject passwords missing lowercase letters', () => {
    const res = validatePasswordComplexity('ALLUPPER123!');
    assert.strictEqual(res.isValid, false);
    assert.match(res.message, /lowercase letter/i);
  });

  it('should reject passwords missing uppercase letters', () => {
    const res = validatePasswordComplexity('alllower123!');
    assert.strictEqual(res.isValid, false);
    assert.match(res.message, /uppercase letter/i);
  });

  it('should reject passwords missing digits', () => {
    const res = validatePasswordComplexity('NoDigitsHere!');
    assert.strictEqual(res.isValid, false);
    assert.match(res.message, /number/i);
  });

  it('should reject passwords missing special characters', () => {
    const res = validatePasswordComplexity('NoSpecial123');
    assert.strictEqual(res.isValid, false);
    assert.match(res.message, /special character/i);
  });

  it('should accept strong, compliant passwords', () => {
    const res = validatePasswordComplexity('MesobMarket@2026');
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.message, undefined);
  });
});
