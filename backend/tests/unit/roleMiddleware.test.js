import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';
import { authorize } from '../../middleware/role.middleware.js';

describe('Role-Based Authorization Middleware', () => {
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

  it('should return 401 when req.user is missing', () => {
    const req = {};
    const res = createMockRes();
    let nextCalled = false;

    const middleware = authorize(['admin']);
    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.jsonData.message, 'Unauthorized');
    assert.strictEqual(nextCalled, false);
  });

  it('should return 403 when user lacks required role', () => {
    const req = { user: { role: ['user'] } };
    const res = createMockRes();
    let nextCalled = false;

    const middleware = authorize(['admin']);
    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.jsonData.message, 'Forbidden');
    assert.strictEqual(nextCalled, false);
  });

  it('should call next() when user has the exact required role', () => {
    const req = { user: { role: ['admin'] } };
    const res = createMockRes();
    let nextCalled = false;

    const middleware = authorize(['admin']);
    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(res.statusCode, null);
    assert.strictEqual(nextCalled, true);
  });

  it('should call next() when user matches one of several authorized roles', () => {
    const req = { user: { role: ['moderator'] } };
    const res = createMockRes();
    let nextCalled = false;

    const middleware = authorize(['admin', 'moderator', 'support']);
    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
  });

  it('should handle role passed as a scalar string rather than an array', () => {
    const req = { user: { role: 'admin' } };
    const res = createMockRes();
    let nextCalled = false;

    const middleware = authorize(['admin']);
    middleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
  });
});
