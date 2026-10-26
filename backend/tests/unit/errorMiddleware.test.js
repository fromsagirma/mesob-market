import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import '../setup.js';
import { errorHandler } from '../../middleware/error.middleware.js';
import { AppError, NotFoundError } from '../../errors/AppError.js';

describe('Centralized Error Middleware', () => {
  const createMockReqRes = (headers = {}, reqId = 'test-trace-id-123') => {
    const req = {
      method: 'GET',
      url: '/api/test',
      id: reqId,
      headers
    };

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

    return { req, res };
  };

  it('should format operational AppError instances with correct status and message', () => {
    const { req, res } = createMockReqRes();
    const error = new NotFoundError('Product with ID not found');

    errorHandler(error, req, res, () => {});

    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.jsonData.success, false);
    assert.strictEqual(res.jsonData.message, 'Product with ID not found');
    assert.strictEqual(res.jsonData.code, 'NOT_FOUND');
    assert.strictEqual(res.jsonData.requestId, 'test-trace-id-123');
  });

  it('should translate Mongoose CastError into a 400 invalid identifier error', () => {
    const { req, res } = createMockReqRes();
    const castError = new Error('Cast to ObjectId failed');
    castError.name = 'CastError';
    castError.path = '_id';
    castError.value = 'invalid-hex-id';

    errorHandler(castError, req, res, () => {});

    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.jsonData.code, 'INVALID_IDENTIFIER');
    assert.match(res.jsonData.message, /Invalid _id/);
  });

  it('should translate duplicate key error code 11000 into a 409 conflict error', () => {
    const { req, res } = createMockReqRes();
    const duplicateError = new Error('E11000 duplicate key');
    duplicateError.code = 11000;
    duplicateError.keyValue = { email: 'test@example.com' };

    errorHandler(duplicateError, req, res, () => {});

    assert.strictEqual(res.statusCode, 409);
    assert.strictEqual(res.jsonData.code, 'DUPLICATE_ENTRY');
    assert.match(res.jsonData.message, /email already exists/i);
  });

  it('should translate JsonWebTokenError into a 401 unauthorized error', () => {
    const { req, res } = createMockReqRes();
    const jwtError = new Error('jwt malformed');
    jwtError.name = 'JsonWebTokenError';

    errorHandler(jwtError, req, res, () => {});

    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.jsonData.code, 'INVALID_TOKEN');
  });
});
