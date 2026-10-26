/**
 * Mesob Market - Authentication Session & Storage Persistence Utilities
 */

export const AUTH_STORAGE_KEY = 'auth-storage';

export const initialAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null
};

/**
 * Extracts only serializable auth fields for persistence.
 */
export function extractPersistedAuthState(state = {}) {
  return {
    user: state?.user || null,
    accessToken: state?.accessToken || null,
    refreshToken: state?.refreshToken || null
  };
}

/**
 * Loads and deserializes auth state from a storage provider.
 */
export function loadStoredAuth(storage = globalThis.localStorage) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.state || parsed;
  } catch {
    return null;
  }
}

/**
 * Serializes and stores auth state into storage.
 */
export function saveStoredAuth(state, storage = globalThis.localStorage) {
  if (!storage) return;
  const persisted = extractPersistedAuthState(state);
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ state: persisted, version: 0 }));
}

/**
 * Clears stored auth session.
 */
export function clearStoredAuth(storage = globalThis.localStorage) {
  if (!storage) return;
  storage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Checks if auth state indicates an active session.
 */
export function isAuthenticated(state) {
  return Boolean(state?.accessToken && state?.user);
}

/**
 * Checks if user possesses a required authorization role.
 */
export function hasRole(user, role) {
  if (!user || !role) return false;
  if (user.role === 'admin') return true;
  return user.role === role;
}

export default {
  AUTH_STORAGE_KEY,
  initialAuthState,
  extractPersistedAuthState,
  loadStoredAuth,
  saveStoredAuth,
  clearStoredAuth,
  isAuthenticated,
  hasRole
};
