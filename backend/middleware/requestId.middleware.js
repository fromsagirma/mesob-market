import crypto from 'crypto';

/**
 * Request ID and audit tracing middleware.
 * Attaches a unique X-Request-Id header to every request/response lifecycle
 * for distributed tracing, auditability, and debugging.
 */
export const requestIdMiddleware = (req, res, next) => {
  const incomingId = req.headers['x-request-id'];
  const requestId = typeof incomingId === 'string' && incomingId.trim() ? incomingId.trim() : crypto.randomUUID();

  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  const startHrTime = process.hrtime();

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6).toFixed(2);
    // In production or structured logging, emit request ID and duration
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[ReqID: ${requestId}] ${req.method} ${req.originalUrl || req.url} - ${res.statusCode} (${elapsedTimeInMs}ms)`);
    }
  });

  next();
};

export default requestIdMiddleware;
