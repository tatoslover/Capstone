/**
 * Frontend Performance Monitoring Utilities
 * Tracks client-side performance metrics for the Planeswalker's Primer application
 */

// Performance metrics storage
let performanceMetrics = {
  pageLoads: [],
  apiCalls: [],
  userInteractions: [],
  errors: [],
  vitals: {},
  sessionStart: Date.now()
};

// Web Vitals thresholds (Google recommendations)
const VITALS_THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 }  // Time to First Byte
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  console.log('🚀 Initialising frontend performance monitoring...');

  // Track page load performance
  trackPageLoad();

  // Monitor Web Vitals
  trackWebVitals();

  // Monitor user interactions
  trackUserInteractions();

  // Monitor API calls
  setupAPIMonitoring();

  // Track errors
  trackErrors();

  // Set up periodic reporting
  setupPeriodicReporting();

  console.log('✅ Frontend performance monitoring initialised');
};

/**
 * Track page load performance
 */
const trackPageLoad = () => {
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    const pageLoadMetric = {
      timestamp: Date.now(),
      url: window.location.pathname,
      metrics: {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        transferSize: navigation.transferSize,
        encodedBodySize: navigation.encodedBodySize,
        decodedBodySize: navigation.decodedBodySize
      }
    };

    performanceMetrics.pageLoads.push(pageLoadMetric);

    // Log slow page loads
    if (pageLoadMetric.metrics.loadComplete > 3000) {
      console.warn('🐌 Slow page load detected:', pageLoadMetric.metrics.loadComplete + 'ms');
    }
  });
};

/**
 * Track Web Vitals using Performance Observer
 */
const trackWebVitals = () => {
  if (!window.PerformanceObserver) return;

  // Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      performanceMetrics.vitals.lcp = {
        value: entry.startTime,
        rating: getRating(entry.startTime, VITALS_THRESHOLDS.LCP),
        timestamp: Date.now()
      };
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      performanceMetrics.vitals.fid = {
        value: entry.processingStart - entry.startTime,
        rating: getRating(entry.processingStart - entry.startTime, VITALS_THRESHOLDS.FID),
        timestamp: Date.now()
      };
    }
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        performanceMetrics.vitals.cls = {
          value: clsValue,
          rating: getRating(clsValue, VITALS_THRESHOLDS.CLS),
          timestamp: Date.now()
        };
      }
    }
  }).observe({ entryTypes: ['layout-shift'] });
};

/**
 * Track user interactions performance
 */
const trackUserInteractions = () => {
  const trackInteraction = (type, target) => {
    const startTime = performance.now();

    // Track interaction after next frame
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      const interaction = {
        type,
        target: target.tagName + (target.className ? `.${target.className}` : ''),
        duration,
        timestamp: Date.now()
      };

      performanceMetrics.userInteractions.push(interaction);

      // Keep only last 50 interactions
      if (performanceMetrics.userInteractions.length > 50) {
        performanceMetrics.userInteractions.shift();
      }

      // Log slow interactions
      if (duration > 100) {
        console.warn('🐌 Slow interaction detected:', interaction);
      }
    });
  };

  // Track clicks
  document.addEventListener('click', (e) => {
    trackInteraction('click', e.target);
  });

  // Track form submissions
  document.addEventListener('submit', (e) => {
    trackInteraction('submit', e.target);
  });

  // Track input focus (for form performance)
  document.addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      trackInteraction('input_focus', e.target);
    }
  });
};

/**
 * Monitor API call performance
 */
const setupAPIMonitoring = () => {
  // Override fetch to monitor API calls
  const originalFetch = window.fetch;

  window.fetch = async function(...args) {
    const startTime = performance.now();
    const url = args[0];

    try {
      const response = await originalFetch.apply(this, args);
      const endTime = performance.now();
      const duration = endTime - startTime;

      const apiCall = {
        url,
        method: args[1]?.method || 'GET',
        status: response.status,
        duration,
        success: response.ok,
        timestamp: Date.now()
      };

      performanceMetrics.apiCalls.push(apiCall);

      // Keep only last 100 API calls
      if (performanceMetrics.apiCalls.length > 100) {
        performanceMetrics.apiCalls.shift();
      }

      // Log slow API calls
      if (duration > 1000) {
        console.warn('🐌 Slow API call detected:', apiCall);
      }

      return response;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      const apiCall = {
        url,
        method: args[1]?.method || 'GET',
        status: 0,
        duration,
        success: false,
        error: error.message,
        timestamp: Date.now()
      };

      performanceMetrics.apiCalls.push(apiCall);

      throw error;
    }
  };
};

/**
 * Track JavaScript errors and performance issues
 */
const trackErrors = () => {
  // Track unhandled errors
  window.addEventListener('error', (event) => {
    const error = {
      type: 'javascript_error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: Date.now()
    };

    performanceMetrics.errors.push(error);
    console.error('🚨 JavaScript error tracked:', error);
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = {
      type: 'unhandled_promise_rejection',
      message: event.reason?.message || 'Unhandled promise rejection',
      stack: event.reason?.stack,
      timestamp: Date.now()
    };

    performanceMetrics.errors.push(error);
    console.error('🚨 Unhandled promise rejection tracked:', error);
  });
};

/**
 * Set up periodic performance reporting
 */
const setupPeriodicReporting = () => {
  // Report metrics every 30 seconds
  setInterval(() => {
    reportPerformanceMetrics();
  }, 30000);

  // Report metrics before page unload
  window.addEventListener('beforeunload', () => {
    reportPerformanceMetrics();
  });
};

/**
 * Get performance rating based on thresholds
 */
const getRating = (value, thresholds) => {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs_improvement';
  return 'poor';
};

/**
 * Get current performance metrics
 */
export const getPerformanceMetrics = () => {
  const sessionDuration = Date.now() - performanceMetrics.sessionStart;

  return {
    session: {
      duration: sessionDuration,
      start: performanceMetrics.sessionStart
    },
    pageLoads: performanceMetrics.pageLoads,
    webVitals: performanceMetrics.vitals,
    apiCalls: {
      total: performanceMetrics.apiCalls.length,
      successful: performanceMetrics.apiCalls.filter(call => call.success).length,
      failed: performanceMetrics.apiCalls.filter(call => !call.success).length,
      averageResponseTime: calculateAverageResponseTime(),
      slowCalls: performanceMetrics.apiCalls.filter(call => call.duration > 1000),
      recent: performanceMetrics.apiCalls.slice(-10)
    },
    userInteractions: {
      total: performanceMetrics.userInteractions.length,
      averageResponseTime: calculateAverageInteractionTime(),
      slowInteractions: performanceMetrics.userInteractions.filter(interaction => interaction.duration > 100),
      recent: performanceMetrics.userInteractions.slice(-10)
    },
    errors: {
      total: performanceMetrics.errors.length,
      recent: performanceMetrics.errors.slice(-5)
    },
    memory: getMemoryUsage(),
    connection: getConnectionInfo()
  };
};

/**
 * Calculate average API response time
 */
const calculateAverageResponseTime = () => {
  if (performanceMetrics.apiCalls.length === 0) return 0;

  const totalTime = performanceMetrics.apiCalls.reduce((sum, call) => sum + call.duration, 0);
  return Math.round(totalTime / performanceMetrics.apiCalls.length);
};

/**
 * Calculate average user interaction response time
 */
const calculateAverageInteractionTime = () => {
  if (performanceMetrics.userInteractions.length === 0) return 0;

  const totalTime = performanceMetrics.userInteractions.reduce((sum, interaction) => sum + interaction.duration, 0);
  return Math.round(totalTime / performanceMetrics.userInteractions.length);
};

/**
 * Get memory usage information
 */
const getMemoryUsage = () => {
  if (!performance.memory) return null;

  return {
    usedJSHeapSize: performance.memory.usedJSHeapSize,
    totalJSHeapSize: performance.memory.totalJSHeapSize,
    jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
    usedPercentage: Math.round((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100)
  };
};

/**
 * Get connection information
 */
const getConnectionInfo = () => {
  if (!navigator.connection) return null;

  return {
    effectiveType: navigator.connection.effectiveType,
    downlink: navigator.connection.downlink,
    rtt: navigator.connection.rtt,
    saveData: navigator.connection.saveData
  };
};

/**
 * Report performance metrics to backend
 */
const reportPerformanceMetrics = async () => {
  try {
    const metrics = getPerformanceMetrics();

    // Only send if there's meaningful data
    if (metrics.apiCalls.total === 0 && metrics.userInteractions.total === 0) {
      return;
    }

    // Send metrics to backend monitoring endpoint
    await fetch('/api/monitoring/client-metrics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: window.location.pathname,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        metrics
      })
    });

  } catch (error) {
    console.warn('Failed to report performance metrics:', error);
  }
};

/**
 * Log performance summary to console
 */
export const logPerformanceSummary = () => {
  const metrics = getPerformanceMetrics();

  console.group('📊 Performance Summary');
  console.log('Session Duration:', Math.round(metrics.session.duration / 1000) + 's');

  if (metrics.webVitals.lcp) {
    console.log('LCP:', metrics.webVitals.lcp.value + 'ms', `(${metrics.webVitals.lcp.rating})`);
  }

  if (metrics.webVitals.fid) {
    console.log('FID:', metrics.webVitals.fid.value + 'ms', `(${metrics.webVitals.fid.rating})`);
  }

  if (metrics.webVitals.cls) {
    console.log('CLS:', metrics.webVitals.cls.value, `(${metrics.webVitals.cls.rating})`);
  }

  console.log('API Calls:', metrics.apiCalls.total, 'avg:', metrics.apiCalls.averageResponseTime + 'ms');
  console.log('User Interactions:', metrics.userInteractions.total, 'avg:', metrics.userInteractions.averageResponseTime + 'ms');
  console.log('Errors:', metrics.errors.total);

  if (metrics.memory) {
    console.log('Memory Usage:', metrics.memory.usedPercentage + '%');
  }

  console.groupEnd();
};

/**
 * Clear performance metrics (for testing)
 */
export const clearPerformanceMetrics = () => {
  performanceMetrics = {
    pageLoads: [],
    apiCalls: [],
    userInteractions: [],
    errors: [],
    vitals: {},
    sessionStart: Date.now()
  };
};

/**
 * Export performance data for analysis
 */
export const exportPerformanceData = () => {
  const data = {
    exportTime: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    metrics: getPerformanceMetrics()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `performance-metrics-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Development helpers
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.performanceUtils = {
    getMetrics: getPerformanceMetrics,
    logSummary: logPerformanceSummary,
    exportData: exportPerformanceData,
    clearMetrics: clearPerformanceMetrics
  };
}
