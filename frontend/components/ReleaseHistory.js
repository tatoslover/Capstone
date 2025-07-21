import React, { useState, useEffect } from "react";

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
        "https://api.github.com/repos/tatoslover/Capstone/releases",
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();

      // Sort releases by created date (newest first)
      const sortedReleases = data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );

      setReleases(sortedReleases);
    } catch (err) {
      console.error("Error fetching releases:", err);
      setError(err.message);

      // Fallback to static release data if GitHub API fails
      setReleases(getFallbackReleases());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackReleases = () => {
    // Return releases in descending order (newest first)
    return [
      {
        tag_name: "v1.0.0",
        name: "🎉 Final Release - Complete Production Application",
        created_at: "2024-01-22T00:00:00Z",
        body: `## 🎉 Version 1.0.0 - Final Release

### 🌟 Major Features
- ✅ Comprehensive MTG learning system with interactive guides
- ✅ Real-time card search with Scryfall API integration
- ✅ User management and favourites system
- ✅ Performance monitoring dashboard
- ✅ Mobile-responsive dark theme design
- ✅ 273 mechanics database with categorisation
- ✅ 23 game formats documentation

### 🛡️ Production Ready
- ✅ 96 passing tests across frontend and backend
- ✅ Perfect security score (100/100)
- ✅ Zero vulnerabilities
- ✅ Comprehensive error handling
- ✅ API caching for performance
- ✅ Professional documentation

### 🚀 Deployment
- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on Railway
- ✅ PostgreSQL database with optimised schema
- ✅ Complete CI/CD pipeline removed in favour of manual deployment`,
        html_url: "#",
      },
      {
        tag_name: "v0.3.0",
        name: "🚀 Production Ready - Comprehensive Testing & Deployment",
        created_at: "2024-01-15T00:00:00Z",
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
        html_url: "#",
      },
      {
        tag_name: "v0.2.0",
        name: "⚡ Performance & Monitoring - Production-Grade Optimisation",
        created_at: "2024-01-08T00:00:00Z",
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
        html_url: "#",
      },
      {
        tag_name: "v0.1.0",
        name: "🎯 Core Foundation - Basic Functionality Complete",
        created_at: "2024-01-01T00:00:00Z",
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
        html_url: "#",
      },
    ];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const parseReleaseDescription = (body) => {
    if (!body) return "";

    return (
      body
        // Convert headers
        .replace(
          /^#{1,6}\s+(.+)$/gm,
          '<h6 class="release-section-title">$1</h6>',
        )
        // Convert bullet points, handling the existing bullet format
        .replace(
          /^\s*[-*•]\s+(.+)$/gm,
          '<div class="release-feature">• $1</div>',
        )
        // Handle checkmarks
        .replace(/✅/g, '<span class="success-icon">✅</span>')
        // Handle emojis as section icons
        .replace(
          /🚀|⚡|🎯|📊|🔒|🧪|🔧|📈/g,
          '<span class="feature-icon">$&</span>',
        )
        // Convert bold text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Clean up extra line breaks and convert to proper spacing
        .replace(/\n{3,}/g, "<br><br>")
        .replace(/\n{2}/g, "<br>")
        // Remove code blocks that don't render well
        .replace(/```[\s\S]*?```/g, "")
        // Clean up any remaining markdown artifacts
        .replace(/^\s*\n/gm, "")
    );
  };

  const getVersionIcon = (tagName) => {
    if (tagName.includes("1.0")) return "🎉";
    if (tagName.includes("0.1")) return "🎯";
    if (tagName.includes("0.2")) return "⚡";
    if (tagName.includes("0.3")) return "🚀";
    return "📦";
  };

  const getVersionStatus = (tagName) => {
    if (tagName === "v1.0.0") return "current";
    if (tagName === "v0.3.0") return "stable";
    if (tagName === "v0.2.0") return "legacy";
    if (tagName === "v0.1.0") return "legacy";
    return "legacy";
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
        <div className="error">Unable to load release history: {error}</div>
      </div>
    );
  }

  return (
    <div className="release-history">
      <div className="release-history-header">
        <h4 className="doc-heading">📋 Release History</h4>
        <p className="doc-paragraph">
          Track the development progression of Planeswalker's Primer through
          major releases.
        </p>
        {error && (
          <div
            className="warning-text"
            style={{ fontSize: "0.9em", marginBottom: "1rem" }}
          >
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
                  <h5 className="release-title">{release.tag_name}</h5>
                  <span
                    className={`version-badge ${getVersionStatus(release.tag_name)}`}
                  >
                    {getVersionStatus(release.tag_name) === "current"
                      ? "Current"
                      : getVersionStatus(release.tag_name) === "stable"
                        ? "Stable"
                        : "Legacy"}
                  </span>
                </div>
                <div className="release-meta">
                  <span className="release-date">
                    📅 {formatDate(release.created_at)}
                  </span>
                  {release.html_url !== "#" && (
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
                      __html: parseReleaseDescription(release.body),
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
            <p>
              Each release represents a major development milestone,
              demonstrating progressive enhancement of features, performance,
              and production readiness.
            </p>
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
              <div className="stat-item">
                <span className="stat-label">🎉 Complete</span>
                <span className="stat-value">Final Release</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseHistory;
