const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const responseTime = require('response-time');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

// Performance metrics storage
const performanceMetrics = {
  requests: 0,
  totalResponseTime: 0,
  averageResponseTime: 0,
  slowQueries: [],
  errorCount: 0,
  uptime: Date.now()
};

// Cache instance for API responses (TTL: 5 minutes)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Scryfall API rate limiting (more restrictive)
const scryfallLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 10, // Limit to 10 requests per second for Scryfall API
  message: {
    error: 'Rate limit exceeded for card search. Please wait a moment.',
    retryAfter: '1 second'
  }
});

// Response time tracking middleware
const responseTimeMiddleware = responseTime((req, res, time) => {
  // Update performance metrics
  performanceMetrics.requests++;
  performanceMetrics.totalResponseTime += time;
  performanceMetrics.averageResponseTime = performanceMetrics.totalResponseTime / performanceMetrics.requests;

  // Log slow requests (>1000ms)
  if (time > 1000) {
    const slowQuery = {
      url: req.url,
      method: req.method,
      responseTime: time,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent') || 'Unknown'
    };

    performanceMetrics.slowQueries.push(slowQuery);

    // Keep only last 50 slow queries
    if (performanceMetrics.slowQueries.length > 50) {
      performanceMetrics.slowQueries.shift();
    }

    console.warn(`🐌 Slow request detected: ${req.method} ${req.url} - ${time}ms`);
  }

  // Add response time header
  res.set('X-Response-Time', `${time}ms`);
});

// Custom logging format for performance monitoring
const performanceLogger = morgan((tokens, req, res) => {
  const responseTime = tokens['response-time'](req, res);
  const status = tokens.status(req, res);
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);

  // Determine log level based on response time and status
  let level = '📊';
  if (responseTime > 1000) level = '🐌';
  if (status >= 400) level = '⚠️';
  if (status >= 500) level = '🚨';

  return [
    level,
    method,
    url,
    status,
    responseTime + 'ms',
    tokens.res(req, res, 'content-length'), '-',
    tokens['user-agent'](req, res)
  ].join(' ');
});

// Error tracking middleware
const errorTracker = (err, req, res, next) => {
  performanceMetrics.errorCount++;

  // Log error details
  console.error('🚨 Error occurred:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent') || 'Unknown',
    ip: req.ip || req.connection.remoteAddress
  });

  // Send error response
  const status = err.status || 500;
  res.status(status).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  });
};

// Cache middleware for GET requests
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      res.set('X-Cache', 'HIT');
      res.set('X-Cache-TTL', cache.getTtl(key));
      return res.json(cachedResponse);
    }

    // Store original json method
    const originalJson = res.json;

    // Override json method to cache response
    res.json = function(data) {
      // Cache successful responses only
      if (res.statusCode === 200) {
        cache.set(key, data, duration);
        res.set('X-Cache', 'MISS');
      }

      // Call original json method
      originalJson.call(this, data);
    };

    next();
  };
};

// Database query performance tracker
const queryPerformanceTracker = {
  track: (queryName, startTime) => {
    const endTime = Date.now();
    const duration = endTime - startTime;

    if (duration > 500) { // Log queries taking more than 500ms
      console.warn(`🗄️ Slow database query: ${queryName} - ${duration}ms`);

      performanceMetrics.slowQueries.push({
        type: 'database',
        query: queryName,
        responseTime: duration,
        timestamp: new Date().toISOString()
      });
    }

    return duration;
  }
};

// Performance metrics endpoint data
const getPerformanceMetrics = () => {
  const uptime = Date.now() - performanceMetrics.uptime;
  const memoryUsage = process.memoryUsage();

  return {
    server: {
      uptime: {
        ms: uptime,
        human: formatDuration(uptime)
      },
      requests: {
        total: performanceMetrics.requests,
        averageResponseTime: Math.round(performanceMetrics.averageResponseTime * 100) / 100,
        errorCount: performanceMetrics.errorCount,
        errorRate: performanceMetrics.requests > 0
          ? Math.round((performanceMetrics.errorCount / performanceMetrics.requests) * 10000) / 100
          : 0
      },
      memory: {
        rss: formatBytes(memoryUsage.rss),
        heapTotal: formatBytes(memoryUsage.heapTotal),
        heapUsed: formatBytes(memoryUsage.heapUsed),
        external: formatBytes(memoryUsage.external)
      },
      cache: {
        keys: cache.keys().length,
        stats: cache.getStats()
      }
    },
    performance: {
      slowQueries: performanceMetrics.slowQueries.slice(-10), // Last 10 slow queries
      responseTimeDistribution: getResponseTimeDistribution()
    }
  };
};

// Helper function to format duration
const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

// Helper function to format bytes
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get response time distribution for analysis
const getResponseTimeDistribution = () => {
  // This would ideally be implemented with a proper histogram
  // For now, return basic stats
  return {
    fast: '< 100ms',
    medium: '100ms - 500ms',
    slow: '500ms - 1000ms',
    verySlow: '> 1000ms',
    note: 'Detailed histogram implementation pending'
  };
};

module.exports = {
  // Security and compression
  helmet,
  compression,

  // Rate limiting
  limiter,
  scryfallLimiter,

  // Performance tracking
  responseTimeMiddleware,
  performanceLogger,
  errorTracker,

  // Caching
  cacheMiddleware,
  cache,

  // Database monitoring
  queryPerformanceTracker,

  // Metrics
  getPerformanceMetrics,

  // Raw metrics for testing
  performanceMetrics
};
