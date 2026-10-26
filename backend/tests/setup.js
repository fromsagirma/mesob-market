/**
 * Global test environment configuration.
 * Sets deterministic environment variables for backend testing.
 */

process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // Ephemeral port for integration tests
process.env.JWT_SECRET = 'test-secret-key-mesob-market-2026';
process.env.ACCESS_TOKEN_EXPIRES = '15m';
process.env.CHAPA_SECRET_KEY = 'test-chapa-secret-key-12345';
process.env.SERVER_URL = 'http://localhost:3000';
process.env.FRONTEND_URL = 'http://localhost:5173';

export const isTestEnv = () => process.env.NODE_ENV === 'test';

export default {
  isTestEnv
};
