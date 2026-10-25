import jwt from 'jsonwebtoken';
import crypto from 'crypto';

/**
 * Authentication and token management service.
 * Handles token generation, hashing, and signature verification.
 */

export const generateAccessToken = (user) => {
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
  return jwt.verify(token, process.env.JWT_SECRET);
};

export default {
  generateAccessToken,
  generateRefreshTokenString,
  hashToken,
  verifyAccessToken
};
