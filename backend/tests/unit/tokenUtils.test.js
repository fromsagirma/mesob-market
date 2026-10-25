import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import '../setup.js';
import { generateRefreshTokenString, hashToken } from '../../services/auth.service.js';
import { getCookieOptions, getClearCookieOptions } from '../../config/cookie.js';

describe('Auth & Token Utilities', () => {
  it('should generate a 128-character hex refresh token', () => {
    const token = generateRefreshTokenString();
    assert.strictEqual(typeof token, 'string');
    assert.strictEqual(token.length, 128);
    assert.match(token, /^[a-f0-9]{128}$/);
  });

  it('should generate distinct cryptographically random tokens', () => {
    const token1 = generateRefreshTokenString();
    const token2 = generateRefreshTokenString();
    assert.notStrictEqual(token1, token2);
  });

  it('should produce deterministic SHA-256 token hashes', () => {
    const rawToken = 'sample-random-token-string-for-testing';
    const hash1 = hashToken(rawToken);
    const hash2 = hashToken(rawToken);

    assert.strictEqual(hash1, hash2);
    assert.strictEqual(hash1.length, 64);

    const expected = crypto.createHash('sha256').update(rawToken).digest('hex');
    assert.strictEqual(hash1, expected);
  });

  it('should return hardened cookie configuration options', () => {
    const options = getCookieOptions();
    assert.strictEqual(options.httpOnly, true);
    assert.strictEqual(options.path, '/');
    assert.strictEqual(typeof options.maxAge, 'number');
    assert.ok(options.maxAge > 0);
  });

  it('should return valid clear cookie configuration options', () => {
    const clearOptions = getClearCookieOptions();
    assert.strictEqual(clearOptions.httpOnly, true);
    assert.strictEqual(clearOptions.path, '/');
    assert.strictEqual(clearOptions.maxAge, undefined);
  });
});
