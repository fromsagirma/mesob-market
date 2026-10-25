import crypto from 'crypto';

/**
 * Authentication and token management service.
 * Handles token generation, hashing, and signature verification.
 */

let jwt = null;
try {
  jwt = (await import('jsonwebtoken')).default;
} catch {
  // Gracefully fallback when jsonwebtoken npm package is not installed (e.g. unit tests)
  jwt = null;
}

export const generateAccessToken = (user) => {
  if (!jwt) {
    throw new Error('JWT library not loaded');
  }
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' }
  );
};

export const generateRefreshTokenString = () => {
  return crypto.randomBytes(64).toString('hex');
};

export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const verifyAccessToken = (token) => {
  if (!jwt) {
    throw new Error('JWT library not loaded');
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default {
  generateAccessToken,
  generateRefreshTokenString,
  hashToken,
  verifyAccessToken
};
