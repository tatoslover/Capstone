import React, { useState, useEffect } from "react";
import {
  getPerformanceMetrics,
  logPerformanceSummary,
  exportPerformanceData,
} from "../utils/performance";
import { getAllCacheStats, clearAllCaches } from "../utils/apiCache";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const PerformanceDashboard = ({ isVisible = false, embedded = false }) => {
  const [metrics, setMetrics] = useState(null);
  const [backendMetrics, setBackendMetrics] = useState(null);
  const [cacheStats, setCacheStats] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch frontend metrics
  const refreshMetrics = () => {
    const frontendMetrics = getPerformanceMetrics();
    setMetrics(frontendMetrics);

    // Get cache statistics
    const stats = getAllCacheStats();
    setCacheStats(stats);
  };

  // Fetch backend metrics
  const fetchBackendMetrics = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/monitoring/performance`,
      );
      if (response.ok) {
        const data = await response.json();
        setBackendMetrics(data);
      }
    } catch (error) {
      // Silently handle backend unavailability - this is optional functionality
      if (process.env.NODE_ENV === "development") {
        console.debug(
          "Backend metrics unavailable (this is optional):",
          error.message,
        );
      }
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
    if (!bytes) return "N/A";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
    if (!vital) return "unknown";
    return vital.rating || "unknown";
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case "good":
        return "#22c55e";
      case "needs_improvement":
        return "#f59e0b";
      case "poor":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      style={{
        position: embedded ? "relative" : "fixed",
        top: embedded ? "auto" : "20px",
        right: embedded ? "auto" : "20px",
        width: embedded ? "100%" : "400px",
        maxHeight: embedded ? "none" : "80vh",
        backgroundColor: embedded ? "var(--theme-cardBg)" : "#1f2937",
        color: embedded ? "var(--theme-text)" : "#f9fafb",
        border: embedded
          ? "1px solid var(--theme-border)"
          : "1px solid #374151",
        borderRadius: "8px",
        padding: "20px",
        fontSize: "14px",
        fontFamily: "monospace",
        overflowY: embedded ? "visible" : "auto",
        zIndex: embedded ? "auto" : 9999,
        boxShadow: embedded ? "none" : "0 10px 25px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: embedded ? "var(--theme-primary)" : "#3b82f6",
          }}
        >
          ⚡ Performance Dashboard
        </h3>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={refreshMetrics}
            style={{
              padding: "4px 8px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#0056b3";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#007bff";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            🔄
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              padding: "4px 8px",
              backgroundColor: autoRefresh ? "#22c55e" : "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {autoRefresh ? "⏸️" : "▶️"}
          </button>
          <button
            onClick={exportPerformanceData}
            style={{
              padding: "4px 8px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#0056b3";
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#007bff";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            📁
          </button>
        </div>
      </div>

      {/* Session Info */}
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            margin: "0 0 10px 0",
            color: embedded ? "var(--theme-success)" : "#10b981",
          }}
        >
          📊 Session
        </h4>
        <div style={{ marginLeft: "10px" }}>
          <div>Duration: {formatDuration(metrics.session.duration)}</div>
          <div>Page: {window.location.pathname}</div>
        </div>
      </div>

      {/* Web Vitals */}
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            margin: "0 0 10px 0",
            color: embedded ? "var(--theme-success)" : "#10b981",
          }}
        >
          🎯 Web Vitals
        </h4>
        <div style={{ marginLeft: "10px" }}>
          {metrics.webVitals.lcp && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>LCP:</span>
              <span
                style={{
                  color: getRatingColor(getVitalRating(metrics.webVitals.lcp)),
                }}
              >
                {Math.round(metrics.webVitals.lcp.value)}ms
              </span>
            </div>
          )}
          {metrics.webVitals.fid && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>FID:</span>
              <span
                style={{
                  color: getRatingColor(getVitalRating(metrics.webVitals.fid)),
                }}
              >
                {Math.round(metrics.webVitals.fid.value)}ms
              </span>
            </div>
          )}
          {metrics.webVitals.cls && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>CLS:</span>
              <span
                style={{
                  color: getRatingColor(getVitalRating(metrics.webVitals.cls)),
                }}
              >
                {metrics.webVitals.cls.value.toFixed(3)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* API Calls */}
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            margin: "0 0 10px 0",
            color: embedded ? "var(--theme-success)" : "#10b981",
          }}
        >
          🌐 API Calls
        </h4>
        <div style={{ marginLeft: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total:</span>
            <span>{metrics.apiCalls.total}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Success:</span>
            <span style={{ color: "#22c55e" }}>
              {metrics.apiCalls.successful}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Failed:</span>
            <span style={{ color: "#ef4444" }}>{metrics.apiCalls.failed}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Avg Time:</span>
            <span>{metrics.apiCalls.averageResponseTime}ms</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Slow Calls:</span>
            <span
              style={{
                color:
                  metrics.apiCalls.slowCalls.length > 0 ? "#f59e0b" : "#6b7280",
              }}
            >
              {metrics.apiCalls.slowCalls.length}
            </span>
          </div>
        </div>
      </div>

      {/* Cache Statistics */}
      {cacheStats && (
        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              margin: "0 0 10px 0",
              color: embedded ? "var(--theme-success)" : "#10b981",
            }}
          >
            💾 API Cache
          </h4>
          <div style={{ marginLeft: "10px" }}>
            <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
              Card Search:
            </div>
            <div style={{ marginLeft: "10px", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Hit Rate:</span>
                <span
                  style={{
                    color:
                      parseFloat(cacheStats.cardSearch.hitRate) > 50
                        ? "#22c55e"
                        : "#f59e0b",
                  }}
                >
                  {cacheStats.cardSearch.hitRate}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Size:</span>
                <span>
                  {cacheStats.cardSearch.size}/{cacheStats.cardSearch.maxSize}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
              Card Details:
            </div>
            <div style={{ marginLeft: "10px", marginBottom: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Hit Rate:</span>
                <span
                  style={{
                    color:
                      parseFloat(cacheStats.cardDetails.hitRate) > 50
                        ? "#22c55e"
                        : "#f59e0b",
                  }}
                >
                  {cacheStats.cardDetails.hitRate}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Size:</span>
                <span>
                  {cacheStats.cardDetails.size}/{cacheStats.cardDetails.maxSize}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                clearAllCaches();
                refreshMetrics();
              }}
              style={{
                marginTop: "8px",
                padding: "4px 8px",
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                width: "100%",
              }}
            >
              Clear All Caches
            </button>
          </div>
        </div>
      )}

      {/* User Interactions */}
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            margin: "0 0 10px 0",
            color: embedded ? "var(--theme-success)" : "#10b981",
          }}
        >
          👆 Interactions
        </h4>
        <div style={{ marginLeft: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Total:</span>
            <span>{metrics.userInteractions.total}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Avg Time:</span>
            <span>{metrics.userInteractions.averageResponseTime}ms</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Slow:</span>
            <span
              style={{
                color:
                  metrics.userInteractions.slowInteractions.length > 0
                    ? "#f59e0b"
                    : "#6b7280",
              }}
            >
              {metrics.userInteractions.slowInteractions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Memory Usage */}
      {metrics.memory && (
        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              margin: "0 0 10px 0",
              color: embedded ? "var(--theme-success)" : "#10b981",
            }}
          >
            🧠 Memory
          </h4>
          <div style={{ marginLeft: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Used:</span>
              <span>{formatBytes(metrics.memory.usedJSHeapSize)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Total:</span>
              <span>{formatBytes(metrics.memory.totalJSHeapSize)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Usage:</span>
              <span
                style={{
                  color:
                    metrics.memory.usedPercentage > 80
                      ? "#ef4444"
                      : metrics.memory.usedPercentage > 60
                        ? "#f59e0b"
                        : "#22c55e",
                }}
              >
                {metrics.memory.usedPercentage}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Connection Info */}
      {metrics.connection && (
        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              margin: "0 0 10px 0",
              color: embedded ? "var(--theme-success)" : "#10b981",
            }}
          >
            📶 Connection
          </h4>
          <div style={{ marginLeft: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Type:</span>
              <span>{metrics.connection.effectiveType}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Downlink:</span>
              <span>{metrics.connection.downlink} Mbps</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>RTT:</span>
              <span>{metrics.connection.rtt}ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Backend Metrics */}
      {backendMetrics && (
        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              margin: "0 0 10px 0",
              color: embedded ? "var(--theme-success)" : "#10b981",
            }}
          >
            🖥️ Backend
          </h4>
          <div style={{ marginLeft: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Status:</span>
              <span
                style={{
                  color:
                    backendMetrics.status === "optimal"
                      ? "#22c55e"
                      : backendMetrics.status === "degraded"
                        ? "#f59e0b"
                        : "#ef4444",
                }}
              >
                {backendMetrics.status}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Uptime:</span>
              <span>{backendMetrics.uptime}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Avg Response:</span>
              <span>{Math.round(backendMetrics.averageResponseTime)}ms</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Error Rate:</span>
              <span
                style={{
                  color: backendMetrics.errorRate > 5 ? "#ef4444" : "#22c55e",
                }}
              >
                {backendMetrics.errorRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Errors */}
      {metrics.errors.total > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h4
            style={{
              margin: "0 0 10px 0",
              color: embedded ? "var(--theme-error)" : "#ef4444",
            }}
          >
            🚨 Errors
          </h4>
          <div style={{ marginLeft: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Total:</span>
              <span style={{ color: "#ef4444" }}>{metrics.errors.total}</span>
            </div>
            {metrics.errors.recent.slice(0, 3).map((error, index) => (
              <div
                key={index}
                style={{
                  fontSize: "12px",
                  color: "#fca5a5",
                  marginTop: "5px",
                  wordBreak: "break-word",
                }}
              >
                {error.message?.substring(0, 50)}...
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        style={{
          marginTop: "20px",
          paddingTop: "10px",
          borderTop: embedded
            ? "1px solid var(--theme-border)"
            : "1px solid #374151",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}
          >
            Refresh Interval:
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "4px",
              backgroundColor: embedded ? "var(--theme-cardBg)" : "#374151",
              color: embedded ? "var(--theme-text)" : "#f9fafb",
              border: embedded
                ? "1px solid var(--theme-border)"
                : "1px solid #4b5563",
              borderRadius: "4px",
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
            width: "100%",
            padding: "8px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#0056b3";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 4px 8px rgba(0, 123, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          📋 Log Summary to Console
        </button>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
