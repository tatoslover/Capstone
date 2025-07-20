import React from 'react';

const PerformanceOverview = ({ metrics }) => {
  // SSR safety check
  if (typeof window === 'undefined') {
    return (
      <div className="performance-overview">
        <div className="metric-card">
          <h5>Performance Data Loading...</h5>
          <span className="metric-value">--</span>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="performance-overview">
        <div className="metric-card">
          <h5>Loading Performance Data...</h5>
          <span className="metric-value">--</span>
        </div>
      </div>
    );
  }

  const formatBytes = (bytes) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getResponseTimeStatus = (time) => {
    if (time > 1000) return 'warning';
    if (time > 500) return 'caution';
    return 'good';
  };

  const getMemoryStatus = (percentage) => {
    if (percentage > 80) return 'error';
    if (percentage > 60) return 'warning';
    return 'good';
  };

  const getErrorRateStatus = (failed, total) => {
    if (total === 0) return 'good';
    const rate = (failed / total) * 100;
    if (rate > 5) return 'error';
    if (rate > 1) return 'warning';
    return 'good';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'var(--theme-success)';
      case 'caution': return 'var(--theme-info)';
      case 'warning': return 'var(--theme-warning)';
      case 'error': return 'var(--theme-error)';
      default: return 'var(--theme-text)';
    }
  };

  return (
    <div className="performance-overview">
      {/* Session Duration */}
      <div className="metric-card">
        <h5>Session Duration</h5>
        <span
          className="metric-value"
          style={{ color: 'var(--theme-text)' }}
        >
          {formatDuration(metrics.session?.duration || 0)}
        </span>
      </div>

      {/* API Performance */}
      <div className="metric-card">
        <h5>Average API Response</h5>
        <span
          className="metric-value"
          style={{
            color: getStatusColor(getResponseTimeStatus(metrics.apiCalls?.averageResponseTime || 0))
          }}
        >
          {metrics.apiCalls?.averageResponseTime || 0}ms
        </span>
      </div>

      {/* Error Rate */}
      <div className="metric-card">
        <h5>API Error Rate</h5>
        <span
          className="metric-value"
          style={{
            color: getStatusColor(getErrorRateStatus(
              metrics.apiCalls?.failed || 0,
              metrics.apiCalls?.total || 0
            ))
          }}
        >
          {metrics.apiCalls?.failed || 0}/{metrics.apiCalls?.total || 0}
        </span>
      </div>

      {/* Memory Usage */}
      {metrics.memory && (
        <div className="metric-card">
          <h5>Memory Usage</h5>
          <span
            className="metric-value"
            style={{
              color: getStatusColor(getMemoryStatus(metrics.memory.usedPercentage))
            }}
          >
            {metrics.memory.usedPercentage}%
          </span>
          <div style={{
            fontSize: '0.7em',
            color: 'var(--theme-textLight)',
            marginTop: '5px'
          }}>
            {formatBytes(metrics.memory.usedJSHeapSize)}
          </div>
        </div>
      )}

      {/* User Interactions */}
      <div className="metric-card">
        <h5>Interactions</h5>
        <span
          className="metric-value"
          style={{ color: 'var(--theme-text)' }}
        >
          {metrics.userInteractions?.total || 0}
        </span>
        <div style={{
          fontSize: '0.7em',
          color: 'var(--theme-textLight)',
          marginTop: '5px'
        }}>
          {metrics.userInteractions?.averageResponseTime || 0}ms avg
        </div>
      </div>

      {/* Web Vitals - LCP */}
      {metrics.webVitals?.lcp && (
        <div className="metric-card">
          <h5>Largest Contentful Paint</h5>
          <span
            className="metric-value"
            style={{
              color: metrics.webVitals.lcp.rating === 'good' ? 'var(--theme-success)' :
                     metrics.webVitals.lcp.rating === 'needs_improvement' ? 'var(--theme-warning)' :
                     'var(--theme-error)'
            }}
          >
            {Math.round(metrics.webVitals.lcp.value)}ms
          </span>
          <div style={{
            fontSize: '0.7em',
            color: 'var(--theme-textLight)',
            marginTop: '5px',
            textTransform: 'capitalize'
          }}>
            {metrics.webVitals.lcp.rating?.replace('_', ' ') || 'unknown'}
          </div>
        </div>
      )}

      {/* Connection Quality */}
      {metrics.connection && (
        <div className="metric-card">
          <h5>Connection</h5>
          <span
            className="metric-value"
            style={{ color: 'var(--theme-text)' }}
          >
            {metrics.connection.effectiveType}
          </span>
          <div style={{
            fontSize: '0.7em',
            color: 'var(--theme-textLight)',
            marginTop: '5px'
          }}>
            {metrics.connection.downlink} Mbps
          </div>
        </div>
      )}

      {/* Backend Status */}
      {metrics.backend && (
        <div className="metric-card">
          <h5>Backend Status</h5>
          <span
            className="metric-value"
            style={{
              color: metrics.backend.status === 'optimal' ? 'var(--theme-success)' :
                     metrics.backend.status === 'degraded' ? 'var(--theme-warning)' :
                     'var(--theme-error)'
            }}
          >
            {metrics.backend.status}
          </span>
          <div style={{
            fontSize: '0.7em',
            color: 'var(--theme-textLight)',
            marginTop: '5px'
          }}>
            {Math.round(metrics.backend.averageResponseTime || 0)}ms avg
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceOverview;
