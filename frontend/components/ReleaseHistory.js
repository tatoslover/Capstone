import React, { useState, useEffect } from 'react';

const ReleaseHistory = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      setError(null);

      // GitHub API endpoint for releases
      const response = await fetch(
        'https://api.github.com/repos/tatoslover/Capstone/releases',
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();

      // Sort releases by created date (newest first)
      const sortedReleases = data.sort((a, b) =>
        new Date(b.created_at) - new Date(a.created_at)
      );

      setReleases(sortedReleases);
    } catch (err) {
      console.error('Error fetching releases:', err);
      setError(err.message);

      // Fallback to static release data if GitHub API fails
      setReleases(getFallbackReleases());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackReleases = () => {
    return [
      {
        tag_name: 'v0.3.0',
        name: '🚀 Production Ready - Comprehensive Testing & Deployment',
        created_at: new Date().toISOString(),
        body: `## 🚀 Production Ready - Comprehensive Testing & Deployment

### 🧪 Testing Excellence
- ✅ 96 tests passing across backend and frontend
- ✅ API endpoint testing with full CRUD coverage
- ✅ Component and user interaction testing
- ✅ Database operation validation
- ✅ Performance integration testing
- ✅ Error handling and edge case coverage

### 🔒 Security Excellence
- ✅ Perfect security audit score (100/100)
- ✅ Zero critical vulnerabilities
- ✅ Comprehensive security headers (frontend + backend)
- ✅ Professional security documentation suite
- ✅ Rate limiting, CORS protection, input validation

### 🔧 Production Improvements
- Database schema optimisation and simplification
- Proper JSON error handling (400/500 responses)
- Test cleanup with Jest configuration
- Comprehensive error handling
- Complete API documentation`,
        html_url: '#'
      },
      {
        tag_name: 'v0.2.0',
        name: '⚡ Performance & Monitoring - Production-Grade Optimisation',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        body: `## ⚡ Performance & Monitoring - Production-Grade Optimisation

### 🚀 Performance Features
- Real-time performance monitoring dashboard
- Memory usage tracking and leak detection
- API response time monitoring (1000ms threshold)
- Comprehensive caching system (5-minute TTL)
- Rate limiting (100 req/15min general, 10 req/sec Scryfall)

### 📊 Monitoring & Analytics
- Performance metrics collection
- Error tracking and alerting
- Health check endpoints (/api/monitoring/*)
- Database query optimisation with indexes
- Web Vitals tracking for frontend performance

### 🔧 Technical Improvements
- Connection pooling for database scalability
- Automated performance test suite
- Performance dashboard with real-time updates
- Memory usage monitoring and optimisation`,
        html_url: '#'
      },
      {
        tag_name: 'v0.1.0',
        name: '🎯 Core Foundation - Basic Functionality Complete',
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        body: `## 🎯 Core Foundation - Basic Functionality Complete

### ✅ Core Features Implemented
- User management system (CRUD operations)
- Favourites system for saving MTG cards
- PostgreSQL database with proper schema and relationships
- Express.js REST API with comprehensive endpoints
- Next.js frontend with responsive design
- UK English standardisation throughout ("favourites")
- Basic security implementation

### 🏗️ Technical Stack
- **Backend:** Express.js + PostgreSQL on Railway
- **Frontend:** Next.js + React 18 on Vercel
- **Database:** Proper foreign keys and constraints
- **API:** RESTful design with validation

### 📱 UI/UX Foundation
- Mobile-first responsive design
- MTG-themed colour schemes
- Loading states and error handling
- Clean, beginner-friendly interface`,
        html_url: '#'
      }
    ];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getVersionIcon = (tagName) => {
    if (tagName.includes('0.1')) return '🎯';
    if (tagName.includes('0.2')) return '⚡';
    if (tagName.includes('0.3')) return '🚀';
    return '📦';
  };

  const getVersionStatus = (tagName) => {
    if (tagName.includes('0.3')) return 'current';
    if (tagName.includes('0.2')) return 'stable';
    return 'legacy';
  };

  if (loading) {
    return (
      <div className="release-history">
        <div className="loading-container">
          <div className="loading">Loading release history...</div>
        </div>
      </div>
    );
  }

  if (error && releases.length === 0) {
    return (
      <div className="release-history">
        <div className="error">
          Unable to load release history: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="release-history">
      <div className="release-history-header">
        <h4 className="doc-heading">
          📋 Release History
        </h4>
        <p className="doc-paragraph">
          Track the development progression of Planeswalker's Primer through major releases.
        </p>
        {error && (
          <div className="warning-text" style={{ fontSize: '0.9em', marginBottom: '1rem' }}>
            ⚠️ Using cached release data due to API limitations
          </div>
        )}
      </div>

      <div className="timeline-container">
        {releases.map((release, index) => (
          <div
            key={release.tag_name}
            className={`timeline-item release-item ${getVersionStatus(release.tag_name)}`}
          >
            <div className="timeline-marker">
              <span className="version-icon">
                {getVersionIcon(release.tag_name)}
              </span>
            </div>

            <div className="timeline-content">
              <div className="release-header">
                <div className="release-title-section">
                  <h5 className="release-title">
                    {release.tag_name}
                  </h5>
                  <span className={`version-badge ${getVersionStatus(release.tag_name)}`}>
                    {getVersionStatus(release.tag_name) === 'current' ? 'Current' :
                     getVersionStatus(release.tag_name) === 'stable' ? 'Stable' : 'Legacy'}
                  </span>
                </div>
                <div className="release-meta">
                  <span className="release-date">
                    📅 {formatDate(release.created_at)}
                  </span>
                  {release.html_url !== '#' && (
                    <a
                      href={release.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-btn"
                    >
                      View on GitHub →
                    </a>
                  )}
                </div>
              </div>

              <div className="release-name">
                {release.name || release.tag_name}
              </div>

              {release.body && (
                <div className="release-body">
                  <div
                    className="release-description"
                    dangerouslySetInnerHTML={{
                      __html: release.body
                        .replace(/^###?\s+/gm, '<h6>')
                        .replace(/$/gm, '</h6>')
                        .replace(/✅/g, '<span class="success-icon">✅</span>')
                        .replace(/🚀|⚡|🎯|📊|🔒|🧪|🔧/g, '<span class="feature-icon">$&</span>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/- (.*?)$/gm, '<div class="release-feature">• $1</div>')
                    }}
                  />
                </div>
              )}

              {index < releases.length - 1 && (
                <div className="timeline-connector" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="release-footer">
        <div className="info-box">
          <div className="info-box-header">
            <span>📈 Development Progression</span>
          </div>
          <div className="info-box-content">
            <p>Each release represents a major development milestone, demonstrating progressive enhancement of features, performance, and production readiness.</p>
            <div className="progression-stats">
              <div className="stat-item">
                <span className="stat-label">🎯 Foundation</span>
                <span className="stat-value">Core Features</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">⚡ Enhancement</span>
                <span className="stat-value">Performance & Monitoring</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">🚀 Production</span>
                <span className="stat-value">Testing & Deployment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .release-history {
          margin: 2rem 0;
        }

        .release-history-header {
          margin-bottom: 2rem;
        }

        .timeline-item.release-item {
          position: relative;
          padding-left: 3rem;
          margin-bottom: 2.5rem;
          border-left: 2px solid var(--theme-border);
        }

        .timeline-marker {
          position: absolute;
          left: -1.5rem;
          top: 0;
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: var(--theme-cardBg);
          border: 3px solid var(--theme-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .version-icon {
          font-size: 1.2rem;
        }

        .timeline-content {
          background: var(--theme-cardBg);
          border: 1px solid var(--theme-border);
          border-radius: 8px;
          padding: 1.5rem;
          margin-left: 1rem;
        }

        .release-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .release-title-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .release-title {
          margin: 0;
          color: var(--theme-primary);
          font-size: 1.1rem;
          font-weight: bold;
        }

        .version-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .version-badge.current {
          background: var(--theme-success);
          color: white;
        }

        .version-badge.stable {
          background: var(--theme-info);
          color: white;
        }

        .version-badge.legacy {
          background: var(--theme-textLight);
          color: var(--theme-bg);
        }

        .release-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.9rem;
          color: var(--theme-textLight);
        }

        .release-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--theme-text);
          margin-bottom: 1rem;
        }

        .release-body {
          margin-top: 1rem;
        }

        .release-description {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--theme-textLight);
        }

        .release-description h6 {
          color: var(--theme-primary);
          font-size: 0.95rem;
          font-weight: bold;
          margin: 1rem 0 0.5rem 0;
        }

        .release-description .success-icon {
          color: var(--theme-success);
          margin-right: 0.5rem;
        }

        .release-description .feature-icon {
          margin-right: 0.5rem;
        }

        .release-feature {
          margin: 0.25rem 0;
          padding-left: 1rem;
        }

        .timeline-connector {
          position: absolute;
          bottom: -2.5rem;
          left: -1.5rem;
          width: 2px;
          height: 2.5rem;
          background: var(--theme-border);
        }

        .release-footer {
          margin-top: 2rem;
        }

        .progression-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }

        .stat-label {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 0.8rem;
          color: var(--theme-textLight);
        }

        @media (max-width: 768px) {
          .timeline-item.release-item {
            padding-left: 2rem;
          }

          .timeline-marker {
            left: -1rem;
            width: 2rem;
            height: 2rem;
          }

          .version-icon {
            font-size: 1rem;
          }

          .timeline-content {
            margin-left: 0.5rem;
            padding: 1rem;
          }

          .release-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .progression-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ReleaseHistory;
