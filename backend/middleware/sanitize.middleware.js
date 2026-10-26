/**
 * Defensive sanitizer middleware to prevent NoSQL injection attacks.
 * Recursively strips keys starting with '$' or containing '.' from request body, query, and params.
 */
export const sanitizeValue = (target) => {
  if (!target || typeof target !== 'object') {
    return target;
  }

  if (Array.isArray(target)) {
    return target.map((item) => sanitizeValue(item));
  }

  const clean = {};
  for (const [key, value] of Object.entries(target)) {
    // Strip keys with MongoDB operators (e.g. $gt, $ne, $where) or path traversal dots
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    clean[key] = sanitizeValue(value);
  }

  return clean;
};

export const sanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }

  next();
};

export default sanitizeMiddleware;
