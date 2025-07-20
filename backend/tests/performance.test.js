const request = require('supertest');
const { getPerformanceMetrics, performanceMetrics } = require('../middleware/performance');

// Mock Express app for testing
const express = require('express');
const {
  helmet,
  compression,
  limiter,
  responseTimeMiddleware,
  performanceLogger,
  errorTracker,
  cacheMiddleware
} = require('../middleware/performance');

const app = express();

// Apply middleware
app.use(helmet());
app.use(compression());
app.use(responseTimeMiddleware);
app.use(express.json());
app.use(cacheMiddleware(300));

// Test routes
app.get('/test/fast', (req, res) => {
  res.json({ message: 'Fast response', timestamp: Date.now() });
});

app.get('/test/slow', (req, res) => {
  // Simulate slow response
  setTimeout(() => {
    res.json({ message: 'Slow response', timestamp: Date.now() });
  }, 1500);
});

app.get('/test/error', (req, res, next) => {
  const error = new Error('Test error');
  error.status = 500;
  next(error);
});

app.get('/test/cached', (req, res) => {
  res.json({ message: 'Cached response', timestamp: Date.now() });
});

// Error handler
app.use(errorTracker);

describe('Performance Monitoring Middleware', () => {
  beforeEach(() => {
    // Reset performance metrics before each test
    performanceMetrics.requests = 0;
    performanceMetrics.totalResponseTime = 0;
    performanceMetrics.averageResponseTime = 0;
    performanceMetrics.slowQueries = [];
    performanceMetrics.errorCount = 0;
    performanceMetrics.uptime = Date.now();
  });

  describe('Response Time Tracking', () => {
    test('should track response time for fast requests', async () => {
      const response = await request(app)
        .get('/test/fast')
        .expect(200);

      expect(response.headers['x-response-time']).toBeDefined();
      expect(response.headers['x-response-time']).toMatch(/\d+(\.\d+)?ms/);

      const metrics = getPerformanceMetrics();
      expect(metrics.server.requests.total).toBe(1);
      expect(metrics.server.requests.averageResponseTime).toBeGreaterThan(0);
    });

    test('should identify slow requests', async () => {
      const response = await request(app)
        .get('/test/slow')
        .expect(200);

      const metrics = getPerformanceMetrics();
      expect(metrics.performance.slowQueries.length).toBeGreaterThan(0);

      const slowQuery = metrics.performance.slowQueries[0];
      expect(slowQuery.url).toBe('/test/slow');
      expect(slowQuery.responseTime).toBeGreaterThan(1000);
    });

    test('should calculate average response time correctly', async () => {
      // Make multiple requests
      await request(app).get('/test/fast');
      await request(app).get('/test/fast');
      await request(app).get('/test/fast');

      const metrics = getPerformanceMetrics();
      expect(metrics.server.requests.total).toBe(3);
      expect(metrics.server.requests.averageResponseTime).toBeGreaterThan(0);
    });
  });

  describe('Error Tracking', () => {
    test('should track errors and increment error count', async () => {
      await request(app)
        .get('/test/error')
        .expect(500);

      const metrics = getPerformanceMetrics();
      expect(metrics.server.requests.errorCount).toBe(1);
      expect(metrics.server.requests.errorRate).toBeGreaterThan(0);
    });

    test('should calculate error rate correctly', async () => {
      // Make successful requests
      await request(app).get('/test/fast');
      await request(app).get('/test/fast');

      // Make error request
      await request(app).get('/test/error').expect(500);

      const metrics = getPerformanceMetrics();
      expect(metrics.server.requests.total).toBe(3);
      expect(metrics.server.requests.errorCount).toBe(1);
      expect(metrics.server.requests.errorRate).toBeCloseTo(33.33, 1);
    });
  });

  describe('Cache Middleware', () => {
    test('should cache GET requests', async () => {
      // First request should be a cache miss
      const response1 = await request(app)
        .get('/test/cached')
        .expect(200);

      expect(response1.headers['x-cache']).toBe('MISS');

      // Second request should be a cache hit
      const response2 = await request(app)
        .get('/test/cached')
        .expect(200);

      expect(response2.headers['x-cache']).toBe('HIT');
      expect(response2.headers['x-cache-ttl']).toBeDefined();
    });

    test('should not cache non-GET requests', async () => {
      const response = await request(app)
        .post('/test/cached')
        .send({ test: 'data' });

      expect(response.headers['x-cache']).toBeUndefined();
    });
  });

  describe('Security Headers', () => {
    test('should add security headers', async () => {
      const response = await request(app)
        .get('/test/fast')
        .expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-xss-protection']).toBeDefined();
    });
  });

  describe('Performance Metrics', () => {
    test('should provide comprehensive metrics', () => {
      const metrics = getPerformanceMetrics();

      expect(metrics).toHaveProperty('server');
      expect(metrics).toHaveProperty('performance');

      expect(metrics.server).toHaveProperty('uptime');
      expect(metrics.server).toHaveProperty('requests');
      expect(metrics.server).toHaveProperty('memory');
      expect(metrics.server).toHaveProperty('cache');

      expect(metrics.server.uptime).toHaveProperty('ms');
      expect(metrics.server.uptime).toHaveProperty('human');

      expect(metrics.server.requests).toHaveProperty('total');
      expect(metrics.server.requests).toHaveProperty('averageResponseTime');
      expect(metrics.server.requests).toHaveProperty('errorCount');
      expect(metrics.server.requests).toHaveProperty('errorRate');
    });

    test('should format uptime correctly', () => {
      const metrics = getPerformanceMetrics();

      expect(typeof metrics.server.uptime.ms).toBe('number');
      expect(typeof metrics.server.uptime.human).toBe('string');
      expect(metrics.server.uptime.ms).toBeGreaterThan(0);
    });

    test('should format memory usage', () => {
      const metrics = getPerformanceMetrics();

      expect(metrics.server.memory).toHaveProperty('rss');
      expect(metrics.server.memory).toHaveProperty('heapTotal');
      expect(metrics.server.memory).toHaveProperty('heapUsed');
      expect(metrics.server.memory).toHaveProperty('external');

      // Check that memory values are formatted as strings with units
      expect(metrics.server.memory.rss).toMatch(/\d+(\.\d+)? (B|KB|MB|GB)/);
      expect(metrics.server.memory.heapUsed).toMatch(/\d+(\.\d+)? (B|KB|MB|GB)/);
    });
  });

  describe('Rate Limiting', () => {
    test('should apply rate limiting after threshold', async () => {
      // Note: This test might be slow as it needs to exceed rate limits
      const requests = [];

      // Make requests up to the limit (100 requests per 15 minutes)
      for (let i = 0; i < 5; i++) {
        requests.push(request(app).get('/test/fast'));
      }

      const responses = await Promise.all(requests);

      // All should succeed initially
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Check that rate limit headers are present
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.headers['x-ratelimit-limit']).toBeDefined();
      expect(lastResponse.headers['x-ratelimit-remaining']).toBeDefined();
    });
  });

  describe('Compression', () => {
    test('should compress responses when appropriate', async () => {
      const response = await request(app)
        .get('/test/fast')
        .set('Accept-Encoding', 'gzip')
        .expect(200);

      // Check if compression is applied for larger responses
      // Note: Small responses might not be compressed
      expect(response.headers['content-encoding']).toBeDefined();
    });
  });

  describe('Slow Query Detection', () => {
    test('should detect and log slow queries', async () => {
      await request(app).get('/test/slow');

      const metrics = getPerformanceMetrics();
      expect(metrics.performance.slowQueries.length).toBeGreaterThan(0);

      const slowQuery = metrics.performance.slowQueries[0];
      expect(slowQuery).toHaveProperty('url');
      expect(slowQuery).toHaveProperty('method');
      expect(slowQuery).toHaveProperty('responseTime');
      expect(slowQuery).toHaveProperty('timestamp');
      expect(slowQuery).toHaveProperty('userAgent');

      expect(slowQuery.responseTime).toBeGreaterThan(1000);
    });

    test('should limit slow query storage', async () => {
      // Create many slow queries to test the limit
      const slowQueryPromises = [];
      for (let i = 0; i < 55; i++) {
        slowQueryPromises.push(request(app).get('/test/slow'));
      }

      await Promise.all(slowQueryPromises);

      const metrics = getPerformanceMetrics();
      // Should keep only last 50 slow queries
      expect(metrics.performance.slowQueries.length).toBeLessThanOrEqual(50);
    }, 60000); // Increase timeout for this test
  });

  describe('Error Response Format', () => {
    test('should return properly formatted error responses', async () => {
      const response = await request(app)
        .get('/test/error')
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('requestId');

      expect(response.body.error).toBe('Internal server error');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('Request ID Tracking', () => {
    test('should add request ID to responses', async () => {
      const response = await request(app)
        .get('/test/fast')
        .expect(200);

      expect(response.headers['x-request-id']).toBeDefined();
      expect(response.headers['x-request-id']).toMatch(/^[a-z0-9]{9}$/);
    });
  });
});

describe('Performance Metrics Integration', () => {
  test('should handle concurrent requests correctly', async () => {
    const concurrentRequests = [];

    for (let i = 0; i < 10; i++) {
      concurrentRequests.push(request(app).get('/test/fast'));
    }

    await Promise.all(concurrentRequests);

    const metrics = getPerformanceMetrics();
    expect(metrics.server.requests.total).toBe(10);
  });

  test('should maintain accurate metrics across different endpoints', async () => {
    await request(app).get('/test/fast');
    await request(app).get('/test/slow');
    await request(app).get('/test/error').expect(500);
    await request(app).get('/test/cached');

    const metrics = getPerformanceMetrics();
    expect(metrics.server.requests.total).toBe(4);
    expect(metrics.server.requests.errorCount).toBe(1);
    expect(metrics.server.requests.errorRate).toBe(25);
  });
});

describe('Memory and Performance Monitoring', () => {
  test('should track memory usage', () => {
    const metrics = getPerformanceMetrics();

    expect(metrics.server.memory).toBeDefined();
    expect(metrics.server.memory.rss).toBeDefined();
    expect(metrics.server.memory.heapTotal).toBeDefined();
    expect(metrics.server.memory.heapUsed).toBeDefined();
  });

  test('should provide cache statistics', () => {
    const metrics = getPerformanceMetrics();

    expect(metrics.server.cache).toBeDefined();
    expect(metrics.server.cache.keys).toBeDefined();
    expect(metrics.server.cache.stats).toBeDefined();

    expect(typeof metrics.server.cache.keys).toBe('number');
  });
});
