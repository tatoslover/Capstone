import React, { useState, useEffect } from 'react';
import { getPerformanceMetrics, logPerformanceSummary, exportPerformanceData } from '../utils/performance';

const PerformanceDashboard = ({ isVisible = false }) => {
  const [metrics, setMetrics] = useState(null);
  const [backendMetrics, setBackendMetrics] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch frontend metrics
  const refreshMetrics = () => {
    const frontendMetrics = getPerformanceMetrics();
    setMetrics(frontendMetrics);
  };

  // Fetch backend metrics
  const fetchBackendMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/performance');
      if (response.ok) {
        const data = await response.json();
        setBackendMetrics(data);
      }
    } catch (error) {
      console.warn('Failed to fetch backend metrics:', error);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (!isVisible) return;

    refreshMetrics();
    fetchBackendMetrics();

    if (autoRefresh) {
      const interval = setInterval(() => {
        refreshMetrics();
        fetchBackendMetrics();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [isVisible, autoRefresh, refreshInterval]);

  if (!isVisible || !metrics) {
    return null;
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

  const getVitalRating = (vital) => {
    if (!vital) return 'unknown';
    return vital.rating || 'unknown';
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'good': return '#22c55e';
      case 'needs_improvement': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '80vh',
      backgroundColor: '#1f2937',
      color: '#f9fafb',
      border: '1px solid #374151',
      borderRadius: '8px',
      padding: '20px',
      fontSize: '14px',
      fontFamily: 'monospace',
      overflowY: 'auto',
      zIndex: 9999,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#3b82f6' }}>⚡ Performance Dashboard</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={refreshMetrics}
            style={{
              padding: '4px 8px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            🔄
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              padding: '4px 8px',
              backgroundColor: autoRefresh ? '#22c55e' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {autoRefresh ? '⏸️' : '▶️'}
          </button>
          <button
            onClick={exportPerformanceData}
            style={{
              padding: '4px 8px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            📁
          </button>
        </div>
      </div>

      {/* Session Info */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>📊 Session</h4>
        <div style={{ marginLeft: '10px' }}>
          <div>Duration: {formatDuration(metrics.session.duration)}</div>
          <div>Page: {window.location.pathname}</div>
        </div>
      </div>

      {/* Web Vitals */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>🎯 Web Vitals</h4>
        <div style={{ marginLeft: '10px' }}>
          {metrics.webVitals.lcp && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>LCP:</span>
              <span style={{ color: getRatingColor(getVitalRating(metrics.webVitals.lcp)) }}>
                {Math.round(metrics.webVitals.lcp.value)}ms
              </span>
            </div>
          )}
          {metrics.webVitals.fid && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>FID:</span>
              <span style={{ color: getRatingColor(getVitalRating(metrics.webVitals.fid)) }}>
                {Math.round(metrics.webVitals.fid.value)}ms
              </span>
            </div>
          )}
          {metrics.webVitals.cls && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>CLS:</span>
              <span style={{ color: getRatingColor(getVitalRating(metrics.webVitals.cls)) }}>
                {metrics.webVitals.cls.value.toFixed(3)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* API Calls */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>🌐 API Calls</h4>
        <div style={{ marginLeft: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total:</span>
            <span>{metrics.apiCalls.total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Success:</span>
            <span style={{ color: '#22c55e' }}>{metrics.apiCalls.successful}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Failed:</span>
            <span style={{ color: '#ef4444' }}>{metrics.apiCalls.failed}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Avg Time:</span>
            <span>{metrics.apiCalls.averageResponseTime}ms</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Slow Calls:</span>
            <span style={{ color: metrics.apiCalls.slowCalls.length > 0 ? '#f59e0b' : '#6b7280' }}>
              {metrics.apiCalls.slowCalls.length}
            </span>
          </div>
        </div>
      </div>

      {/* User Interactions */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>👆 Interactions</h4>
        <div style={{ marginLeft: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total:</span>
            <span>{metrics.userInteractions.total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Avg Time:</span>
            <span>{metrics.userInteractions.averageResponseTime}ms</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Slow:</span>
            <span style={{ color: metrics.userInteractions.slowInteractions.length > 0 ? '#f59e0b' : '#6b7280' }}>
              {metrics.userInteractions.slowInteractions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Memory Usage */}
      {metrics.memory && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>🧠 Memory</h4>
          <div style={{ marginLeft: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Used:</span>
              <span>{formatBytes(metrics.memory.usedJSHeapSize)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total:</span>
              <span>{formatBytes(metrics.memory.totalJSHeapSize)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Usage:</span>
              <span style={{
                color: metrics.memory.usedPercentage > 80 ? '#ef4444' :
                       metrics.memory.usedPercentage > 60 ? '#f59e0b' : '#22c55e'
              }}>
                {metrics.memory.usedPercentage}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Connection Info */}
      {metrics.connection && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>📶 Connection</h4>
          <div style={{ marginLeft: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Type:</span>
              <span>{metrics.connection.effectiveType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Downlink:</span>
              <span>{metrics.connection.downlink} Mbps</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>RTT:</span>
              <span>{metrics.connection.rtt}ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Backend Metrics */}
      {backendMetrics && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#10b981' }}>🖥️ Backend</h4>
          <div style={{ marginLeft: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Status:</span>
              <span style={{
                color: backendMetrics.status === 'optimal' ? '#22c55e' :
                       backendMetrics.status === 'degraded' ? '#f59e0b' : '#ef4444'
              }}>
                {backendMetrics.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Uptime:</span>
              <span>{backendMetrics.uptime}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Avg Response:</span>
              <span>{Math.round(backendMetrics.averageResponseTime)}ms</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Error Rate:</span>
              <span style={{ color: backendMetrics.errorRate > 5 ? '#ef4444' : '#22c55e' }}>
                {backendMetrics.errorRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Errors */}
      {metrics.errors.total > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#ef4444' }}>🚨 Errors</h4>
          <div style={{ marginLeft: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total:</span>
              <span style={{ color: '#ef4444' }}>{metrics.errors.total}</span>
            </div>
            {metrics.errors.recent.slice(0, 3).map((error, index) => (
              <div key={index} style={{
                fontSize: '12px',
                color: '#fca5a5',
                marginTop: '5px',
                wordBreak: 'break-word'
              }}>
                {error.message?.substring(0, 50)}...
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #374151' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
            Refresh Interval:
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '4px',
              backgroundColor: '#374151',
              color: '#f9fafb',
              border: '1px solid #4b5563',
              borderRadius: '4px'
            }}
          >
            <option value={1000}>1 second</option>
            <option value={5000}>5 seconds</option>
            <option value={10000}>10 seconds</option>
            <option value={30000}>30 seconds</option>
          </select>
        </div>

        <button
          onClick={logPerformanceSummary}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          📋 Log Summary to Console
        </button>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
