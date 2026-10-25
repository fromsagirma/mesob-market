import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import './setup.js';
import {
  AUTH_STORAGE_KEY,
  initialAuthState,
  extractPersistedAuthState,
  loadStoredAuth,
  saveStoredAuth,
  clearStoredAuth,
  isAuthenticated,
  hasRole
} from '../lib/authSession.js';
import { MockStorage } from './setup.js';

describe('Frontend Auth Session & Persistence Utilities', () => {
  let mockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
  });

  describe('extractPersistedAuthState()', () => {
    it('strips non-persistent properties like loading and error', () => {
      const fullState = {
        user: { _id: 'u1', name: 'Abebe', role: 'customer' },
        accessToken: 'access-jwt-token',
        refreshToken: 'refresh-jwt-token',
        loading: true,
        error: 'Network error',
        arbitraryField: 123
      };

      const persisted = extractPersistedAuthState(fullState);
      assert.deepStrictEqual(persisted, {
        user: { _id: 'u1', name: 'Abebe', role: 'customer' },
        accessToken: 'access-jwt-token',
        refreshToken: 'refresh-jwt-token'
      });
      assert.strictEqual(persisted.loading, undefined);
      assert.strictEqual(persisted.error, undefined);
    });
  });

  describe('Storage persistence operations', () => {
    it('saves and reloads session data correctly', () => {
      const session = {
        user: { _id: 'u2', name: 'Almaz', role: 'merchant' },
        accessToken: 'token-abc',
        refreshToken: 'token-xyz'
      };

      saveStoredAuth(session, mockStorage);
      const loaded = loadStoredAuth(mockStorage);

      assert.deepStrictEqual(loaded, session);
    });

    it('returns null when storage is empty or malformed', () => {
      assert.strictEqual(loadStoredAuth(mockStorage), null);

      mockStorage.setItem(AUTH_STORAGE_KEY, 'invalid-json-content');
      assert.strictEqual(loadStoredAuth(mockStorage), null);
    });

    it('clears stored session data', () => {
      saveStoredAuth({ user: { _id: 'u3' } }, mockStorage);
      assert.notStrictEqual(mockStorage.getItem(AUTH_STORAGE_KEY), null);

      clearStoredAuth(mockStorage);
      assert.strictEqual(mockStorage.getItem(AUTH_STORAGE_KEY), null);
    });
  });

  describe('Authorization and Session helpers', () => {
    it('checks if session is authenticated', () => {
      assert.strictEqual(isAuthenticated({ accessToken: 'token', user: { _id: 'u1' } }), true);
      assert.strictEqual(isAuthenticated({ accessToken: null, user: { _id: 'u1' } }), false);
      assert.strictEqual(isAuthenticated(initialAuthState), false);
    });

    it('verifies user roles with admin superuser privilege', () => {
      const admin = { role: 'admin' };
      const merchant = { role: 'merchant' };
      const customer = { role: 'customer' };

      assert.strictEqual(hasRole(admin, 'merchant'), true);
      assert.strictEqual(hasRole(admin, 'customer'), true);
      assert.strictEqual(hasRole(merchant, 'merchant'), true);
      assert.strictEqual(hasRole(merchant, 'admin'), false);
      assert.strictEqual(hasRole(customer, 'merchant'), false);
    });
  });
});
