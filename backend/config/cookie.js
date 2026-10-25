/**
 * Centralized cookie security configuration.
 * Enforces httpOnly, sameSite, secure, and path attributes
 * across authentication session management.
 */

export const getCookieOptions = (customOptions = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    ...customOptions
  };
};

export const getClearCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/'
  };
};

export default {
  getCookieOptions,
  getClearCookieOptions
};
