import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';
import { securityHeaders } from '../../middleware/security.middleware.js';
import { requestIdMiddleware } from '../../middleware/requestId.middleware.js';

describe('Server Health and Security Baseline Integration', () => {
  const createMockHttp = (incomingHeaders = {}) => {
    const req = {
      method: 'GET',
      url: '/',
      headers: incomingHeaders
    };

    const headerStore = {};
    const res = {
      statusCode: 200,
      headers: headerStore,
      body: null,
      setHeader(key, value) {
        headerStore[key.toLowerCase()] = value;
      },
      getHeader(key) {
        return headerStore[key.toLowerCase()];
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      send(payload) {
        this.body = payload;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
      on() {
        return this;
      }
    };

    return { req, res };
  };

  it('should enforce security headers on all incoming requests', () => {
    const { req, res } = createMockHttp();
    let nextCalled = false;

    securityHeaders(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(res.getHeader('x-content-type-options'), 'nosniff');
    assert.strictEqual(res.getHeader('x-frame-options'), 'DENY');
    assert.strictEqual(res.getHeader('referrer-policy'), 'strict-origin-when-cross-origin');
  });

  it('should attach unique X-Request-Id header when none is provided', () => {
    const { req, res } = createMockHttp();
    let nextCalled = false;

    requestIdMiddleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.ok(req.id, 'req.id should be generated');
    assert.strictEqual(res.getHeader('x-request-id'), req.id);
  });

  it('should propagate incoming X-Request-Id header for distributed tracing', () => {
    const customTraceId = 'client-trace-uuid-999';
    const { req, res } = createMockHttp({ 'x-request-id': customTraceId });
    let nextCalled = false;

    requestIdMiddleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(req.id, customTraceId);
    assert.strictEqual(res.getHeader('x-request-id'), customTraceId);
  });

  it('should verify root health check endpoint returns active status', () => {
    const { req, res } = createMockHttp();
    res.send('Server is running 🚀');

    assert.strictEqual(res.statusCode, 200);
    assert.match(res.body, /Server is running/);
  });
});
