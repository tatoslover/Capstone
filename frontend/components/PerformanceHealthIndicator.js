import React from 'react';

const PerformanceHealthIndicator = ({ metrics, backendStatus = 'unknown' }) => {
  // SSR safety check
  if (typeof window === 'undefined') {
    return (
      <div className="performance-health-indicator">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '15px'
        }}>
          <span style={{ fontSize: '1.5em' }}>⚪</span>
          <div>
            <div style={{
              fontWeight: 'bold',
              color: 'var(--theme-textLight)',
              fontSize: '1.1em'
            }}>
              Performance Loading...
            </div>
            <div style={{
              fontSize: '0.9em',
              color: 'var(--theme-textLight)'
            }}>
              Initialising monitoring
            </div>
          </div>
        </div>
      </div>
    );
  }

  const calculateOverallHealth = () => {
    if (!metrics) return 'unknown';

    let score = 100;
    const issues = [];

    // Check API performance
    if (metrics.apiCalls?.averageResponseTime > 1000) {
      score -= 20;
      issues.push('Slow API responses');
    } else if (metrics.apiCalls?.averageResponseTime > 500) {
      score -= 10;
      issues.push('Moderate API latency');
    }

    // Check error rate
    if (metrics.apiCalls?.total > 0) {
      const errorRate = (metrics.apiCalls.failed / metrics.apiCalls.total) * 100;
      if (errorRate > 5) {
        score -= 25;
        issues.push('High error rate');
      } else if (errorRate > 1) {
        score -= 10;
        issues.push('Elevated error rate');
      }
    }

    // Check memory usage
    if (metrics.memory?.usedPercentage > 80) {
      score -= 20;
      issues.push('High memory usage');
    } else if (metrics.memory?.usedPercentage > 60) {
      score -= 10;
      issues.push('Moderate memory usage');
    }

    // Check Web Vitals
    if (metrics.webVitals?.lcp?.rating === 'poor') {
      score -= 15;
      issues.push('Poor LCP performance');
    } else if (metrics.webVitals?.lcp?.rating === 'needs_improvement') {
      score -= 8;
      issues.push('LCP needs improvement');
    }

    if (metrics.webVitals?.fid?.rating === 'poor') {
      score -= 15;
      issues.push('Poor FID performance');
    } else if (metrics.webVitals?.fid?.rating === 'needs_improvement') {
      score -= 8;
      issues.push('FID needs improvement');
    }

    if (metrics.webVitals?.cls?.rating === 'poor') {
      score -= 10;
      issues.push('Poor CLS performance');
    } else if (metrics.webVitals?.cls?.rating === 'needs_improvement') {
      score -= 5;
      issues.push('CLS needs improvement');
    }

    // Check total errors
    if (metrics.errors?.total > 5) {
      score -= 20;
      issues.push('Multiple JavaScript errors');
    } else if (metrics.errors?.total > 0) {
      score -= 5;
      issues.push('Some JavaScript errors');
    }

    // Backend status impact
    if (backendStatus === 'degraded') {
      score -= 15;
      issues.push('Backend performance degraded');
    } else if (backendStatus === 'unhealthy') {
      score -= 30;
      issues.push('Backend unhealthy');
    }

    // Determine health status
    if (score >= 90) return { status: 'excellent', score, issues };
    if (score >= 75) return { status: 'good', score, issues };
    if (score >= 50) return { status: 'fair', score, issues };
    if (score >= 25) return { status: 'poor', score, issues };
    return { status: 'critical', score, issues };
  };

  const health = calculateOverallHealth();

  const getHealthColor = (status) => {
    switch (status) {
      case 'excellent': return 'var(--theme-success)';
      case 'good': return 'var(--theme-success)';
      case 'fair': return 'var(--theme-warning)';
      case 'poor': return 'var(--theme-error)';
      case 'critical': return 'var(--theme-error)';
      default: return 'var(--theme-textLight)';
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'excellent': return '🟢';
      case 'good': return '🟢';
      case 'fair': return '🟡';
      case 'poor': return '🟠';
      case 'critical': return '🔴';
      default: return '⚪';
    }
  };

  const getHealthText = (status) => {
    switch (status) {
      case 'excellent': return 'Excellent Performance';
      case 'good': return 'Good Performance';
      case 'fair': return 'Fair Performance';
      case 'poor': return 'Poor Performance';
      case 'critical': return 'Critical Issues';
      default: return 'Performance Unknown';
    }
  };

  const getRecommendations = (issues) => {
    const recommendations = [];

    if (issues.includes('Slow API responses')) {
      recommendations.push('Consider optimising backend queries and caching strategies');
    }
    if (issues.includes('High error rate')) {
      recommendations.push('Review error logs and implement better error handling');
    }
    if (issues.includes('High memory usage')) {
      recommendations.push('Check for memory leaks and optimise component lifecycle');
    }
    if (issues.includes('Poor LCP performance')) {
      recommendations.push('Optimise image loading and critical rendering path');
    }
    if (issues.includes('Poor FID performance')) {
      recommendations.push('Reduce JavaScript execution time and implement code splitting');
    }
    if (issues.includes('Poor CLS performance')) {
      recommendations.push('Reserve space for dynamic content and avoid layout shifts');
    }
    if (issues.includes('Multiple JavaScript errors')) {
      recommendations.push('Fix JavaScript errors and implement error boundaries');
    }
    if (issues.includes('Backend performance degraded')) {
      recommendations.push('Check backend server resources and database performance');
    }

    return recommendations;
  };

  return (
    <div className="performance-health-indicator">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '15px'
      }}>
        <span style={{ fontSize: '1.5em' }}>
          {getHealthIcon(health.status)}
        </span>
        <div>
          <div style={{
            fontWeight: 'bold',
            color: getHealthColor(health.status),
            fontSize: '1.1em'
          }}>
            {getHealthText(health.status)}
          </div>
          <div style={{
            fontSize: '0.9em',
            color: 'var(--theme-textLight)'
          }}>
            Performance Score: {health.score}/100
          </div>
        </div>
      </div>

      {health.issues.length > 0 && (
        <div style={{
          background: 'var(--theme-cardBg)',
          border: '1px solid var(--theme-border)',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '15px'
        }}>
          <div style={{
            fontWeight: 'bold',
            color: 'var(--theme-warning)',
            marginBottom: '8px',
            fontSize: '0.9em'
          }}>
            ⚠️ Performance Issues Detected:
          </div>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            fontSize: '0.85em',
            color: 'var(--theme-textLight)'
          }}>
            {health.issues.map((issue, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {health.issues.length > 0 && (
        <div style={{
          background: 'var(--theme-cardBg)',
          border: '1px solid var(--theme-info)',
          borderRadius: '6px',
          padding: '12px'
        }}>
          <div style={{
            fontWeight: 'bold',
            color: 'var(--theme-info)',
            marginBottom: '8px',
            fontSize: '0.9em'
          }}>
            💡 Recommendations:
          </div>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            fontSize: '0.85em',
            color: 'var(--theme-textLight)'
          }}>
            {getRecommendations(health.issues).map((recommendation, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}

      {health.status === 'excellent' && (
        <div style={{
          background: 'var(--theme-cardBg)',
          border: '1px solid var(--theme-success)',
          borderRadius: '6px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <div style={{
            color: 'var(--theme-success)',
            fontWeight: 'bold',
            fontSize: '0.9em'
          }}>
            🎉 Your application is performing excellently! Keep up the good work.
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceHealthIndicator;
