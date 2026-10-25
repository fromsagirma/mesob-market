import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';
import {
  validateEmail,
  validateName,
  validatePassword,
  validateSignupData,
  validateLoginData,
  signupSchema,
  loginSchema
} from '../lib/authValidation.js';

describe('Frontend Client Auth Validation', () => {
  describe('validateEmail()', () => {
    it('accepts valid email addresses', () => {
      const res = validateEmail('user@example.com');
      assert.strictEqual(res.valid, true);
      assert.strictEqual(res.value, 'user@example.com');
    });

    it('rejects malformed email addresses', () => {
      assert.strictEqual(validateEmail('notanemail').valid, false);
      assert.strictEqual(validateEmail('user@').valid, false);
      assert.strictEqual(validateEmail('').valid, false);
    });
  });

  describe('validateName()', () => {
    it('accepts valid alphabetic names with spaces or hyphens', () => {
      assert.strictEqual(validateName('Abebe Bikila').valid, true);
      assert.strictEqual(validateName("Almaz Ayana-Dibaba").valid, true);
    });

    it('rejects names shorter than 3 characters', () => {
      assert.strictEqual(validateName('Ab').valid, false);
    });

    it('rejects names with numbers or symbols', () => {
      assert.strictEqual(validateName('User123').valid, false);
    });
  });

  describe('validatePassword()', () => {
    it('accepts passwords meeting all complexity criteria', () => {
      assert.strictEqual(validatePassword('StrongP@ss123').valid, true);
    });

    it('rejects passwords shorter than 8 characters', () => {
      assert.strictEqual(validatePassword('Sh0rt!').valid, false);
    });

    it('rejects passwords missing uppercase letters', () => {
      assert.strictEqual(validatePassword('strongp@ss123').valid, false);
    });

    it('rejects passwords missing numbers', () => {
      assert.strictEqual(validatePassword('StrongPass@!').valid, false);
    });

    it('rejects passwords missing special characters', () => {
      assert.strictEqual(validatePassword('StrongPass123').valid, false);
    });
  });

  describe('signupSchema & loginSchema', () => {
    it('validates matching passwords during signup', () => {
      const validPayload = {
        name: 'Abebe Bikila',
        email: 'abebe@example.com',
        password: 'ValidP@ss123',
        confirmPassword: 'ValidP@ss123'
      };
      assert.doesNotThrow(() => signupSchema.parse(validPayload));
    });

    it('throws error when passwords do not match', () => {
      const mismatchedPayload = {
        name: 'Abebe Bikila',
        email: 'abebe@example.com',
        password: 'ValidP@ss123',
        confirmPassword: 'DifferentP@ss123'
      };
      assert.throws(() => signupSchema.parse(mismatchedPayload), /match/);
    });

    it('validates login input with safeParse', () => {
      const valid = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' });
      assert.strictEqual(valid.success, true);

      const invalid = loginSchema.safeParse({ email: '', password: '' });
      assert.strictEqual(invalid.success, false);
    });
  });
});
