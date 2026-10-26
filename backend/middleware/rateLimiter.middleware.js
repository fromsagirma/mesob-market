/**
 * In-memory sliding-window rate limiter middleware.
 * Protects endpoints from credential brute-forcing, spamming, and DoS without external Redis dependency.
 */
export const createRateLimiter = ({
  windowMs = 60 * 1000, // 1 minute
  max = 10,              // limit each IP to 10 requests per windowMs
  message = "Too many requests from this IP, please try again later.",
  keyGenerator = (req) => req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip',
} = {}) => {
  const requests = new Map();

  // Periodically clean expired entries to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of requests.entries()) {
      if (now > record.resetTime) {
        requests.delete(key);
      }
    }
  }, Math.max(windowMs, 30000));

  // Ensure interval does not prevent Node process from gracefully exiting
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req, res, next) => {
    // Skip rate limiting in automated test environments
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const key = keyGenerator(req);
    const now = Date.now();
    const record = requests.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }

    record.count += 1;
    requests.set(key, record);

    const remaining = Math.max(0, max - record.count);
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        statusCode: 429,
        message,
        retryAfterSeconds,
      });
    }

    next();
  };
};

// Pre-configured rate limiters for specific threat surfaces
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,                  // max 15 login/register attempts per 15 min per IP
  message: "Too many authentication attempts. Please wait 15 minutes before trying again.",
});

export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                   // max 5 password reset requests per hour per IP
  message: "Too many password reset requests. Please wait an hour before requesting again.",
});

export const paymentRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,      // 1 minute
  max: 10,                  // max 10 payment initializations per minute per IP
  message: "Payment transaction rate limit reached. Please wait a moment before trying again.",
});

export default createRateLimiter;
