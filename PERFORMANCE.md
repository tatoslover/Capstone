# Performance Optimisation & Monitoring

This document outlines the comprehensive performance optimisation and monitoring features implemented in the Planeswalker's Primer application.

## Overview

The application includes both backend and frontend performance monitoring to ensure optimal user experience and system reliability. The monitoring system tracks:

- Response times and throughput
- Database query performance
- Memory usage and resource consumption
- Error rates and system health
- Cache performance
- Client-side Web Vitals

## Backend Performance Features

### 1. Performance Middleware

Located in `backend/middleware/performance.js`, this module provides:

#### Security & Optimisation
- **Helmet**: Security headers for XSS protection, CSRF prevention
- **Compression**: Gzip compression for response payloads
- **CORS**: Configured cross-origin resource sharing

#### Rate Limiting
- **General API**: 100 requests per 15 minutes per IP
- **Scryfall API**: 10 requests per second (respects external API limits)
- **Custom error messages** with retry information

#### Response Time Tracking
- Automatic response time measurement for all requests
- Slow query detection (>1000ms threshold)
- Average response time calculation
- X-Response-Time header injection

#### Caching System
- **In-memory caching** with NodeCache (5-minute TTL)
- **Cache headers**: X-Cache (HIT/MISS), X-Cache-TTL
- **Automatic cache invalidation**
- GET request caching only

#### Error Tracking
- Comprehensive error logging with context
- Error rate calculation
- Request ID tracking for debugging
- Stack trace capture in development

### 2. Enhanced Database Operations

Located in `backend/db-enhanced.js`, provides:

#### Connection Pool Optimisation
- **Maximum connections**: 20 concurrent
- **Idle timeout**: 30 seconds
- **Connection timeout**: 2 seconds
- **Connection reuse**: Up to 7,500 uses per connection

#### Query Performance Monitoring
- Individual query timing
- Slow query detection (>500ms threshold)
- Query name tagging for identification
- Automatic performance logging

#### Database Indexes
```sql
-- Optimised indexes for common queries
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_favourites_user_created ON favourites(user_id, created_at DESC);
CREATE INDEX idx_favourites_ability_type ON favourites(ability_type);
CREATE INDEX idx_favourites_scryfall_id ON favourites(scryfall_id);
```

#### Enhanced CRUD Operations
- **Prepared statement patterns** for SQL injection prevention
- **Pagination support** with configurable limits
- **Duplicate prevention** with ON CONFLICT handling
- **Optimised sorting** using database indexes

### 3. Monitoring Endpoints

Located in `backend/routes/monitoring.js`:

#### `/api/monitoring/health`
Comprehensive health check with:
- Database connectivity status
- Response time measurement
- Memory usage statistics
- Server uptime information

#### `/api/monitoring/metrics`
Detailed performance metrics:
- Request statistics (total, average response time, error rate)
- Memory usage (RSS, heap, external)
- Cache performance statistics
- Recent slow queries list

#### `/api/monitoring/performance`
Dashboard-friendly summary:
- System status (optimal/degraded)
- Key performance indicators
- Alert-worthy metrics
- Cache hit rate calculation

#### `/api/monitoring/alerts`
Active system alerts based on thresholds:
- **High error rate**: >5%
- **Slow response time**: >1000ms average
- **High memory usage**: >500MB heap
- **Frequent slow queries**: >5 in 5 minutes

#### `/api/monitoring/cache`
Cache-specific metrics:
- Hit/miss ratios
- Memory consumption
- Key count and statistics
- Performance analysis

### 4. Enhanced Server Configuration

The `server-enhanced.js` includes:

#### Middleware Order (Performance Critical)
1. Security headers (Helmet)
2. Compression
3. Response time tracking
4. Performance logging
5. Rate limiting
6. CORS and JSON parsing
7. Request ID assignment
8. Caching layer

#### Request Processing
- **Request ID generation** for tracking
- **Response headers** with performance data
- **Error context** with request correlation
- **Graceful shutdown** handling

## Frontend Performance Features

### 1. Performance Monitoring Utility

Located in `frontend/utils/performance.js`:

#### Web Vitals Tracking
- **Largest Contentful Paint (LCP)**: <2.5s good, >4s poor
- **First Input Delay (FID)**: <100ms good, >300ms poor
- **Cumulative Layout Shift (CLS)**: <0.1 good, >0.25 poor
- **First Contentful Paint (FCP)**: <1.8s good, >3s poor

#### User Interaction Monitoring
- Click response time tracking
- Form submission performance
- Input focus lag detection
- Slow interaction alerting (>100ms)

#### API Call Performance
- **Fetch API wrapping** for automatic timing
- Success/failure rate tracking
- Slow API call detection (>1000ms)
- Error correlation with response times

#### Memory Monitoring
- JavaScript heap usage tracking
- Memory leak detection
- Usage percentage calculation
- High memory warnings (>80%)

#### Connection Quality
- Network connection type detection
- Downlink speed measurement
- Round-trip time (RTT) tracking
- Data saver mode detection

### 2. Performance Dashboard

Located in `frontend/components/PerformanceDashboard.js`:

#### Real-time Metrics Display
- **Session information**: Duration, current page
- **Web Vitals**: LCP, FID, CLS with colour-coded ratings
- **API performance**: Total calls, success rate, average time
- **User interactions**: Total count, response times
- **Memory usage**: Heap usage with percentage
- **Connection info**: Network type, speed, latency

#### Interactive Features
- **Auto-refresh**: Configurable intervals (1s-30s)
- **Manual refresh**: Instant metrics update
- **Export functionality**: JSON data download
- **Console logging**: Detailed performance summary
- **Alert indicators**: Visual warnings for issues

#### Development Tools
- **Keyboard shortcut**: Ctrl+Shift+P to toggle
- **Toggle button**: Fixed position for easy access
- **Memory leak detection**: Periodic checks
- **Performance warnings**: Console alerts for issues

### 3. Performance Wrapper

Located in `frontend/components/PerformanceWrapper.js`:

#### Automatic Initialisation
- Performance monitoring setup on mount
- Resource hint injection (preconnect)
- Meta tag configuration
- Environment-aware features

#### Resource Optimisation
- **Preconnect links** to backend API and Scryfall
- **Font loading optimisation** with system font fallbacks
- **GPU acceleration** hints for animations
- **Reduced motion** support for accessibility

#### Development Features
- **Page load monitoring** with 3-second threshold
- **Memory leak detection** every 30 seconds
- **Performance warnings** in console
- **Dashboard toggle** button in development

## Performance Optimisation Strategies

### Database Optimisation

1. **Connection Pooling**
   - Reuse connections to reduce overhead
   - Automatic connection lifecycle management
   - Pool size tuning based on load

2. **Query Optimisation**
   - Strategic index placement
   - Prepared statement patterns
   - Query result pagination
   - Automatic query analysis

3. **Caching Strategy**
   - In-memory cache for frequent queries
   - TTL-based invalidation
   - Cache hit rate monitoring
   - Smart cache key generation

### Network Optimisation

1. **Response Compression**
   - Automatic gzip compression
   - Configurable compression levels
   - Content-type based compression

2. **HTTP Optimisation**
   - Keep-alive connections
   - Response caching headers
   - ETags for conditional requests
   - Proper status codes

3. **Rate Limiting**
   - IP-based request limiting
   - API-specific rate limits
   - Graceful rate limit responses
   - Client-side retry logic

### Frontend Optimisation

1. **Resource Loading**
   - Preconnect to external APIs
   - DNS prefetch for known domains
   - Resource hints for critical assets
   - Lazy loading strategies

2. **Rendering Performance**
   - GPU acceleration for animations
   - Reduced motion support
   - Efficient re-rendering patterns
   - Virtual scrolling for large lists

3. **Memory Management**
   - Automatic memory monitoring
   - Leak detection and warnings
   - Efficient data structures
   - Component cleanup strategies

## Monitoring Dashboards

### Development Dashboard

Access via:
- **Keyboard shortcut**: Ctrl+Shift+P
- **Toggle button**: Top-right corner (development only)
- **URL parameter**: `?debug=performance`

Features:
- Real-time metrics display
- Interactive controls
- Export functionality
- Console integration

### Production Monitoring

Access via API endpoints:
- `/api/monitoring/health` - Health status
- `/api/monitoring/metrics` - Detailed metrics
- `/api/monitoring/alerts` - Active alerts
- `/api/monitoring/performance` - Summary view

Integration with external monitoring tools:
- Prometheus metrics export
- Grafana dashboard templates
- Alert manager configuration
- Log aggregation setup

## Performance Thresholds & Alerts

### Response Time Targets
- **API responses**: <500ms average
- **Database queries**: <200ms average
- **Page load**: <3 seconds
- **User interactions**: <100ms

### Memory Usage Limits
- **Backend heap**: <500MB
- **Frontend heap**: <80% of limit
- **Database connections**: <15 concurrent
- **Cache size**: <100MB

### Error Rate Thresholds
- **API errors**: <5% of requests
- **Database errors**: <1% of queries
- **Frontend errors**: <2% of sessions
- **Timeout errors**: <1% of requests

### Alert Conditions
- **Critical**: >10% error rate, >2s average response
- **Warning**: >5% error rate, >1s average response
- **Info**: Memory usage >70%, slow queries detected

## Usage Examples

### Backend Monitoring

```javascript
// Get current performance metrics
const { getPerformanceMetrics } = require('./middleware/performance');
const metrics = getPerformanceMetrics();

console.log('Average response time:', metrics.server.requests.averageResponseTime);
console.log('Error rate:', metrics.server.requests.errorRate);
console.log('Cache hit rate:', metrics.server.cache.stats.hits);
```

### Frontend Monitoring

```javascript
// Get client-side metrics
import { getPerformanceMetrics, logPerformanceSummary } from '../utils/performance';

const metrics = getPerformanceMetrics();
console.log('LCP:', metrics.webVitals.lcp?.value);
console.log('API calls:', metrics.apiCalls.total);

// Log detailed summary
logPerformanceSummary();
```

### Health Check Integration

```bash
# Command line health check
curl -s http://localhost:3001/api/monitoring/health | jq .

# Check specific metrics
curl -s http://localhost:3001/api/monitoring/performance | jq '.averageResponseTime'

# Monitor alerts
curl -s http://localhost:3001/api/monitoring/alerts | jq '.alerts[].message'
```

## Testing Performance Features

### Backend Tests

```bash
# Run performance-specific tests
npm run test:performance

# Test with coverage
npm run test:coverage

# Monitor during tests
npm run monitor
```

### Frontend Tests

```bash
# Test performance utilities
npm run test:components

# Test with performance monitoring
npm run test -- --detectOpenHandles --detectLeaks
```

### Load Testing

```bash
# Use Apache Bench for basic load testing
ab -n 1000 -c 10 http://localhost:3001/api/messages

# Use Artillery for complex scenarios
artillery run performance-test.yml
```

## Configuration

### Environment Variables

```bash
# Performance monitoring
ENABLE_PERFORMANCE_MONITORING=true
PERFORMANCE_LOG_LEVEL=info
CACHE_TTL=300
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# Database performance
DB_POOL_MAX=20
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=2000

# Frontend monitoring
NEXT_PUBLIC_ENABLE_PERFORMANCE_DASHBOARD=false
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Package.json Scripts

```json
{
  "scripts": {
    "start": "node server-enhanced.js",
    "dev:performance": "NODE_ENV=development nodemon server-enhanced.js",
    "monitor": "node -e \"const { getPerformanceMetrics } = require('./middleware/performance'); console.log(JSON.stringify(getPerformanceMetrics(), null, 2));\"",
    "health": "curl -s http://localhost:3001/api/monitoring/health | jq ."
  }
}
```

## Best Practices

### Backend Development
1. Always use the enhanced database operations
2. Implement proper error handling with context
3. Use appropriate HTTP status codes
4. Monitor query performance regularly
5. Implement circuit breakers for external APIs

### Frontend Development
1. Wrap components with PerformanceWrapper
2. Monitor Web Vitals in production
3. Implement proper loading states
4. Use efficient rendering patterns
5. Monitor memory usage in long-running sessions

### Monitoring Strategy
1. Set up automated alerting
2. Regular performance reviews
3. Capacity planning based on metrics
4. Correlate performance with user experience
5. Continuous optimisation based on data

## Troubleshooting

### Common Issues

1. **High Memory Usage**
   - Check for memory leaks in event listeners
   - Review cache size and TTL settings
   - Monitor connection pool usage

2. **Slow Response Times**
   - Analyze slow query logs
   - Check database indexes
   - Review caching strategy

3. **High Error Rates**
   - Check error logs for patterns
   - Review rate limiting settings
   - Validate input handling

### Debug Commands

```bash
# View current performance state
npm run monitor

# Check health status
npm run health

# Reset metrics (development only)
curl -X POST http://localhost:3001/api/monitoring/reset

# Export performance data
# Use the dashboard export button or:
curl -s http://localhost:3001/api/monitoring/metrics > metrics.json
```

## Future Enhancements

1. **Distributed Tracing**: OpenTelemetry integration
2. **Custom Metrics**: Business-specific KPIs
3. **Predictive Scaling**: ML-based capacity planning
4. **Real User Monitoring**: Enhanced client tracking
5. **Performance Budgets**: Automated performance regression detection

---

*This performance monitoring system provides comprehensive visibility into application performance and enables proactive optimisation for the best user experience.*