const express = require('express');
const { getPerformanceMetrics } = require('../middleware/performance');
const { healthCheck } = require('../db-enhanced');

const router = express.Router();

/**
 * @swagger
 * /api/monitoring/health:
 *   get:
 *     summary: Comprehensive health check endpoint
 *     tags: [Monitoring]
 *     description: Returns detailed server and database health status with performance metrics
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 server:
 *                   type: object
 *                   properties:
 *                     uptime:
 *                       type: string
 *                       example: "2h 15m 30s"
 *                     memory:
 *                       type: object
 *                     nodeVersion:
 *                       type: string
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     responseTime:
 *                       type: string
 *       503:
 *         description: System is unhealthy
 */
router.get('/health', async (req, res) => {
  try {
    const dbHealth = await healthCheck();
    const performanceData = getPerformanceMetrics();

    const health = {
      status: dbHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      server: {
        uptime: performanceData.server.uptime,
        memory: performanceData.server.memory,
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        environment: process.env.NODE_ENV || 'development'
      },
      database: dbHealth,
      requests: performanceData.server.requests
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);

  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error.message
    });
  }
});

/**
 * @swagger
 * /api/monitoring/metrics:
 *   get:
 *     summary: Detailed performance metrics
 *     tags: [Monitoring]
 *     description: Returns comprehensive performance metrics including response times, memory usage, and database statistics
 *     responses:
 *       200:
 *         description: Performance metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 server:
 *                   type: object
 *                   properties:
 *                     uptime:
 *                       type: object
 *                     requests:
 *                       type: object
 *                     memory:
 *                       type: object
 *                     cache:
 *                       type: object
 *                 performance:
 *                   type: object
 *                   properties:
 *                     slowQueries:
 *                       type: array
 *                     responseTimeDistribution:
 *                       type: object
 */
router.get('/metrics', (req, res) => {
  try {
    const metrics = getPerformanceMetrics();

    res.json({
      timestamp: new Date().toISOString(),
      ...metrics
    });

  } catch (error) {
    console.error('Error retrieving metrics:', error);
    res.status(500).json({
      error: 'Failed to retrieve metrics',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/monitoring/performance:
 *   get:
 *     summary: Performance summary for dashboards
 *     tags: [Monitoring]
 *     description: Returns simplified performance data suitable for monitoring dashboards
 *     responses:
 *       200:
 *         description: Performance summary retrieved successfully
 */
router.get('/performance', (req, res) => {
  try {
    const metrics = getPerformanceMetrics();

    const summary = {
      timestamp: new Date().toISOString(),
      status: metrics.server.requests.errorRate > 5 ? 'degraded' : 'optimal',
      averageResponseTime: metrics.server.requests.averageResponseTime,
      errorRate: metrics.server.requests.errorRate,
      totalRequests: metrics.server.requests.total,
      uptime: metrics.server.uptime.human,
      memoryUsage: metrics.server.memory.heapUsed,
      cacheHitRate: calculateCacheHitRate(metrics.server.cache.stats),
      slowQueriesCount: metrics.performance.slowQueries.length,
      recentSlowQueries: metrics.performance.slowQueries.slice(-5)
    };

    res.json(summary);

  } catch (error) {
    console.error('Error retrieving performance summary:', error);
    res.status(500).json({
      error: 'Failed to retrieve performance summary',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/monitoring/alerts:
 *   get:
 *     summary: Current system alerts and warnings
 *     tags: [Monitoring]
 *     description: Returns active alerts based on performance thresholds
 *     responses:
 *       200:
 *         description: Alerts retrieved successfully
 */
router.get('/alerts', (req, res) => {
  try {
    const metrics = getPerformanceMetrics();
    const alerts = [];

    // Check for high error rate
    if (metrics.server.requests.errorRate > 5) {
      alerts.push({
        severity: 'warning',
        type: 'high_error_rate',
        message: `Error rate is ${metrics.server.requests.errorRate}% (threshold: 5%)`,
        value: metrics.server.requests.errorRate,
        threshold: 5,
        timestamp: new Date().toISOString()
      });
    }

    // Check for slow average response time
    if (metrics.server.requests.averageResponseTime > 1000) {
      alerts.push({
        severity: 'warning',
        type: 'slow_response_time',
        message: `Average response time is ${metrics.server.requests.averageResponseTime}ms (threshold: 1000ms)`,
        value: metrics.server.requests.averageResponseTime,
        threshold: 1000,
        timestamp: new Date().toISOString()
      });
    }

    // Check for memory usage (extract numeric value from formatted string)
    const heapUsedMB = parseFloat(metrics.server.memory.heapUsed.split(' ')[0]);
    if (heapUsedMB > 500) { // 500MB threshold
      alerts.push({
        severity: 'warning',
        type: 'high_memory_usage',
        message: `Heap memory usage is ${metrics.server.memory.heapUsed} (threshold: 500MB)`,
        value: heapUsedMB,
        threshold: 500,
        timestamp: new Date().toISOString()
      });
    }

    // Check for recent slow queries
    const recentSlowQueries = metrics.performance.slowQueries.filter(
      query => new Date(query.timestamp) > new Date(Date.now() - 300000) // Last 5 minutes
    );

    if (recentSlowQueries.length > 5) {
      alerts.push({
        severity: 'warning',
        type: 'frequent_slow_queries',
        message: `${recentSlowQueries.length} slow queries in the last 5 minutes (threshold: 5)`,
        value: recentSlowQueries.length,
        threshold: 5,
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      timestamp: new Date().toISOString(),
      alertCount: alerts.length,
      status: alerts.length === 0 ? 'healthy' : 'alerts_active',
      alerts
    });

  } catch (error) {
    console.error('Error retrieving alerts:', error);
    res.status(500).json({
      error: 'Failed to retrieve alerts',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/monitoring/cache:
 *   get:
 *     summary: Cache performance statistics
 *     tags: [Monitoring]
 *     description: Returns cache hit rates, memory usage, and key statistics
 *     responses:
 *       200:
 *         description: Cache statistics retrieved successfully
 */
router.get('/cache', (req, res) => {
  try {
    const metrics = getPerformanceMetrics();
    const cacheStats = metrics.server.cache.stats;

    const cacheMetrics = {
      timestamp: new Date().toISOString(),
      totalKeys: metrics.server.cache.keys,
      statistics: cacheStats,
      hitRate: calculateCacheHitRate(cacheStats),
      performance: {
        hits: cacheStats.hits || 0,
        misses: cacheStats.misses || 0,
        keys: cacheStats.keys || 0,
        ksize: cacheStats.ksize || 0,
        vsize: cacheStats.vsize || 0
      }
    };

    res.json(cacheMetrics);

  } catch (error) {
    console.error('Error retrieving cache metrics:', error);
    res.status(500).json({
      error: 'Failed to retrieve cache metrics',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @swagger
 * /api/monitoring/reset:
 *   post:
 *     summary: Reset performance metrics (development only)
 *     tags: [Monitoring]
 *     description: Resets performance counters and metrics. Only available in development mode.
 *     responses:
 *       200:
 *         description: Metrics reset successfully
 *       403:
 *         description: Not allowed in production
 */
router.post('/reset', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'Metrics reset not allowed in production',
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Reset performance metrics (this would need to be implemented in the performance module)
    const { performanceMetrics } = require('../middleware/performance');

    performanceMetrics.requests = 0;
    performanceMetrics.totalResponseTime = 0;
    performanceMetrics.averageResponseTime = 0;
    performanceMetrics.slowQueries = [];
    performanceMetrics.errorCount = 0;
    performanceMetrics.uptime = Date.now();

    res.json({
      message: 'Performance metrics reset successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error resetting metrics:', error);
    res.status(500).json({
      error: 'Failed to reset metrics',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Helper function to calculate cache hit rate
function calculateCacheHitRate(cacheStats) {
  if (!cacheStats || !cacheStats.hits || !cacheStats.misses) {
    return 0;
  }

  const total = cacheStats.hits + cacheStats.misses;
  if (total === 0) return 0;

  return Math.round((cacheStats.hits / total) * 10000) / 100; // Return percentage with 2 decimal places
}

module.exports = router;
