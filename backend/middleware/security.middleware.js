/**
 * Security middleware enforcing parameter pollution prevention
 * and safe HTTP header baselines.
 */

// Allow specific query parameters to be arrays (e.g. multi-select filters)
const ALLOWED_ARRAY_QUERY_PARAMS = new Set(['category', 'tags', 'status', 'sortBy']);

export const hppProtection = (req, res, next) => {
  if (req.query && typeof req.query === 'object') {
    for (const [key, value] of Object.entries(req.query)) {
      if (Array.isArray(value) && !ALLOWED_ARRAY_QUERY_PARAMS.has(key)) {
        // Retain only the last parameter value if an attacker attempts parameter pollution
        req.query[key] = value[value.length - 1];
      }
    }
  }
  next();
};

export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

export default {
  hppProtection,
  securityHeaders
};
