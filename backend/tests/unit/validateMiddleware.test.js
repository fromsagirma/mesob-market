import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';
import { validateField, validate } from '../../middleware/validate.middleware.js';

describe('Validation Middleware', () => {
  describe('validateField', () => {
    it('should validate required rules', () => {
      assert.strictEqual(validateField(undefined, { required: true }, 'name'), 'name is required');
      assert.strictEqual(validateField('', { required: true }, 'email'), 'email is required');
      assert.strictEqual(validateField('John', { required: true }, 'name'), null);
    });

    it('should validate string length rules', () => {
      assert.match(validateField('ab', { type: 'string', minLength: 3 }, 'name'), /at least 3 characters/);
      assert.match(validateField('toolongstring', { type: 'string', maxLength: 5 }, 'name'), /cannot exceed 5 characters/);
      assert.strictEqual(validateField('valid', { type: 'string', minLength: 2, maxLength: 10 }, 'name'), null);
    });

    it('should validate regex patterns', () => {
      const emailRule = {
        type: 'string',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Invalid email'
      };
      assert.strictEqual(validateField('not-an-email', emailRule, 'email'), 'Invalid email');
      assert.strictEqual(validateField('user@example.com', emailRule, 'email'), null);
    });

    it('should validate numeric ranges', () => {
      assert.match(validateField(-5, { type: 'number', min: 0 }, 'price'), /at least 0/);
      assert.match(validateField(150, { type: 'number', max: 100 }, 'discount'), /cannot exceed 100/);
      assert.strictEqual(validateField(50, { type: 'number', min: 0, max: 100 }, 'discount'), null);
    });

    it('should validate enum sets', () => {
      const statusRule = { enum: ['used', 'new'] };
      assert.match(validateField('broken', statusRule, 'status'), /must be one of: used, new/);
      assert.strictEqual(validateField('new', statusRule, 'status'), null);
    });
  });

  describe('validate middleware runner', () => {
    const createMockRes = () => {
      const res = {
        statusCode: null,
        jsonData: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.jsonData = data;
          return this;
        }
      };
      return res;
    };

    it('should return 400 when validation fails', () => {
      const schema = {
        body: {
          email: { type: 'string', required: true }
        }
      };

      const req = { body: {} };
      const res = createMockRes();
      let nextCalled = false;

      const mw = validate(schema);
      mw(req, res, () => { nextCalled = true; });

      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.jsonData.success, false);
      assert.ok(res.jsonData.errors.length > 0);
      assert.strictEqual(nextCalled, false);
    });

    it('should call next() when validation succeeds', () => {
      const schema = {
        body: {
          email: { type: 'string', required: true }
        }
      };

      const req = { body: { email: 'test@example.com' } };
      const res = createMockRes();
      let nextCalled = false;

      const mw = validate(schema);
      mw(req, res, () => { nextCalled = true; });

      assert.strictEqual(res.statusCode, null);
      assert.strictEqual(nextCalled, true);
    });
  });
});
