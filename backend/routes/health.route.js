/**
 * Mesob Market - Health and Readiness Check Route
 */

let router;
try {
  const express = (await import('express')).default;
  router = express.Router();
} catch {
  router = {
    get: () => {},
    post: () => {},
    use: () => {}
  };
}

/**
 * Maps Mongoose readyState numbers to readable status strings.
 */
export const getDatabaseStatus = (readyState) => {
  switch (readyState) {
    case 1:
      return { status: 'connected', readyState: 1, healthy: true };
    case 2:
      return { status: 'connecting', readyState: 2, healthy: false };
    case 3:
      return { status: 'disconnecting', readyState: 3, healthy: false };
    case 0:
    default:
      return { status: 'disconnected', readyState: 0, healthy: false };
  }
};

/**
 * Formats health check payload with system and database metrics.
 */
export const buildHealthPayload = ({ dbReadyState, uptime = process.uptime(), memory = process.memoryUsage() } = {}) => {
  const dbStatus = getDatabaseStatus(dbReadyState);
  const isHealthy = dbStatus.healthy;

  return {
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(uptime),
    database: {
      type: 'mongodb',
      ...dbStatus
    },
    memory: {
      rssMb: Math.round(memory.rss / (1024 * 1024)),
      heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
      heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024))
    },
    environment: process.env.NODE_ENV || 'development'
  };
};

/**
 * GET /api/health
 * Comprehensive service readiness and liveness check.
 */
router.get('/', async (req, res) => {
  try {
    let readyState = 0;
    try {
      const mongoose = (await import('mongoose')).default;
      readyState = mongoose.connection ? mongoose.connection.readyState : 0;
    } catch {
      readyState = 0;
    }

    const payload = buildHealthPayload({ dbReadyState: readyState });
    const statusCode = payload.status === 'healthy' ? 200 : 503;

    return res.status(statusCode).json(payload);
  } catch (error) {
    return res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

export default router;
