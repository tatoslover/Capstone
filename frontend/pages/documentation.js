import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import {
  apiService,
  addConnectionListener,
  removeConnectionListener,
} from "../services/apiService";
import PerformanceDashboard from "../components/PerformanceDashboard";
import PerformanceOverview from "../components/PerformanceOverview";
import PerformanceHealthIndicator from "../components/PerformanceHealthIndicator";
import ClientOnly from "../components/ClientOnly";
import {
  getPerformanceMetrics,
  logPerformanceSummary,
  exportPerformanceData,
} from "../utils/performance";

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Documentation() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [dbConnectionStatus, setDbConnectionStatus] = useState("unknown");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [swaggerLoaded, setSwaggerLoaded] = useState(false);
  const [swaggerError, setSwaggerError] = useState(false);
  const [showPerformancePanel, setShowPerformancePanel] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  const handleSectionClick = (section) => {
    setSelectedSection(selectedSection === section ? null : section);
  };

  // Test database connection
  const testDatabaseConnection = async () => {
    setIsTestingConnection(true);
    setDbConnectionStatus("unknown");
    try {
      const response = await apiService.health();
      if (response && response.status === "OK") {
        setDbConnectionStatus("connected");
        setSwaggerError(false);
      } else {
        setDbConnectionStatus("disconnected");
      }
    } catch (error) {
      console.log("Database connection test failed:", error.message);
      setDbConnectionStatus("disconnected");
      setSwaggerError(true);
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Monitor API connection status
  useEffect(() => {
    const checkConnection = (isOnline) => {
      setDbConnectionStatus(isOnline ? "connected" : "disconnected");
    };

    // Initial check
    testDatabaseConnection();

    // Listen for connection changes
    addConnectionListener(checkConnection);

    return () => {
      removeConnectionListener(checkConnection);
    };
  }, []);

  // Fetch backend metrics for performance monitoring
  const fetchBackendMetrics = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/monitoring/performance`,
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        if (process.env.NODE_ENV === "development") {
          console.debug(
            "Backend performance endpoint not available (this is optional)",
          );
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.debug(
          "Backend performance monitoring unavailable:",
          error.message,
        );
      }
    }
    return null;
  };

  // Export performance report
  const exportPerformanceReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      frontend: getPerformanceMetrics(),
      backend: performanceMetrics?.backend,
      url: window.location.href,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `performance-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Real-time performance updates
  useEffect(() => {
    const updateMetrics = async () => {
      const frontendMetrics = getPerformanceMetrics();
      const backendMetrics = await fetchBackendMetrics();
      setPerformanceMetrics({ ...frontendMetrics, backend: backendMetrics });
    };

    // Initial load
    updateMetrics();

    // Set up interval only if performance panel is shown
    if (showPerformancePanel) {
      const interval = setInterval(updateMetrics, 5000);
      return () => clearInterval(interval);
    }
  }, [showPerformancePanel]);

  const sectionInfo = {
    introduction: {
      title: "Introduction",
      content: (
        <div>
          <h4 className="doc-heading">Purpose</h4>
          <ul className="doc-list">
            <li>
              Magic: The Gathering has a notoriously steep learning curve, with new players often overwhelmed by complex rules, terminology, and strategic concepts
            </li>
            <li>Existing learning resources are fragmented across wikis, rulebooks, and community sites, making systematic learning difficult</li>
            <li>
              Current state: New players frequently abandon the game due to feeling lost or intimidated by the complexity
            </li>
            <li>Desired state: A centralised, beginner-friendly platform that guides new players through MTG fundamentals systematically</li>
            <li>
              Similar projects exist (MTG Wiki, EDHRec) but focus on advanced players; this project specifically targets beginners with structured learning paths
            </li>
          </ul>

          <h4 className="doc-heading">Industry/Domain</h4>
          <ul className="doc-list">
            <li>Trading card game industry, specifically Magic: The Gathering (30+ year established game)</li>
            <li>
              Industry challenges include player retention, accessibility for new players, and digital transformation
            </li>
            <li>Value chain: Game publisher (Wizards of the Coast) → Local game stores → Players → Secondary market</li>
            <li>Key concepts: Mana system, card types, phases/steps, stack, priority, deck construction rules</li>
            <li>Principles are applicable to other complex games requiring structured learning approaches</li>
          </ul>

          <h4 className="doc-heading">Stakeholders</h4>
          <ul className="doc-list">
            <li>
              Primary: New MTG players seeking to learn game fundamentals systematically
            </li>
            <li>Secondary: Local game store owners wanting to support new player onboarding</li>
            <li>Tertiary: Experienced players mentoring newcomers who need structured teaching resources</li>
            <li>Expectations: Clear, accurate information; progressive difficulty; mobile-friendly interface; up-to-date content</li>
          </ul>
        </div>
      ),
    },
    product: {
      title: "Product Description",
      content: (
        <div>
          <h4 className="doc-heading">System Architecture</h4>
          <p className="doc-paragraph">
            <strong>Frontend:</strong> Next.js React application with responsive design, dark theme, and component-based architecture
          </p>
          <p className="doc-paragraph">
            <strong>Backend:</strong> Express.js REST API with PostgreSQL database, rate limiting, and comprehensive security headers
          </p>
          <p className="doc-paragraph">
            <strong>External APIs:</strong> Scryfall API for MTG card data and images
          </p>
          <p className="doc-paragraph">
            <strong>Deployment:</strong> Frontend on Vercel, Backend on Railway with automated CI/CD
          </p>

          <h4 className="doc-heading">Core User Stories</h4>
          <div className="doc-paragraph">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Story</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Learn MTG Basics</td>
                  <td>As a new player, I want to learn MTG fundamentals through structured guides</td>
                  <td>✅ Complete</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Search MTG Cards</td>
                  <td>As a user, I want to search for cards and view detailed information</td>
                  <td>✅ Complete</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Save Favourites</td>
                  <td>As a user, I want to save my favourite cards for quick access</td>
                  <td>✅ Complete</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Browse Mechanics</td>
                  <td>As a player, I want to explore MTG mechanics with detailed explanations</td>
                  <td>✅ Complete</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="doc-heading">User Flow</h4>
          <div className="doc-paragraph">
            <div className="user-flow-container">
              <div className="user-flow-row">
                <div className="user-flow-box">
                  User selects/creates profile
                </div>
                <span className="user-flow-arrow">→</span>
                <div className="user-flow-box">
                  Navigates learning sections
                </div>
                <span className="user-flow-arrow">→</span>
                <div className="user-flow-box">
                  Searches for specific cards
                </div>
              </div>
              <div className="user-flow-row">
                <div className="user-flow-box">
                  Saves interesting cards to favourites
                </div>
                <span className="user-flow-arrow">→</span>
                <div className="user-flow-box">
                  References quick guide panel as needed
                </div>
              </div>
            </div>
          </div>

          <h4 className="doc-heading">Key Features</h4>
          <ul className="doc-list">
            <li>Interactive learning modules covering all MTG fundamentals</li>
            <li>Dark theme optimised for extended reading sessions</li>
            <li>Mobile-responsive design for on-the-go learning</li>
            <li>Real-time card search with high-quality images</li>
            <li>Personal favourites system with user management</li>
            <li>Quick reference panel with essential game information</li>
          </ul>

          <h4 className="doc-heading">Out of Scope</h4>
          <ul className="doc-list">
            <li>Advanced strategy guides</li>
            <li>Deck building tools</li>
            <li>Multiplayer features</li>
            <li>Tournament tracking</li>
            <li>Real-time gameplay simulation</li>
            <li>Setup password authentication for users</li>
            <li>Market app as a product</li>
          </ul>
        </div>
      ),
    },
    requirements: {
      title: "Non-functional Requirements",
      content: (
        <div>
          <h4 className="doc-heading">Security</h4>
          <ul className="doc-list">
            <li>Comprehensive security headers including CSP, HSTS, and X-Frame-Options</li>
            <li>Rate limiting to prevent API abuse (1000 requests per 15 minutes)</li>
            <li>Input validation and payload size limits</li>
            <li>CORS configuration for secure cross-origin requests</li>
            <li>Secure error handling without information leakage</li>
          </ul>

          <h4 className="doc-heading">Performance</h4>
          <ul className="doc-list">
            <li>Response times under 500ms for API endpoints</li>
            <li>Caching middleware for static content (5-minute cache)</li>
            <li>Compression middleware for reduced payload sizes</li>
            <li>Performance monitoring with response time tracking</li>
            <li>Database connection pooling for efficient resource usage</li>
          </ul>

          <h4 className="doc-heading">Usability</h4>
          <ul className="doc-list">
            <li>Mobile-first responsive design for all screen sizes</li>
            <li>Dark theme optimised for extended reading sessions</li>
            <li>Intuitive navigation with clear visual hierarchy</li>
            <li>Loading states and error handling for better user experience</li>
          </ul>

          <h4 className="doc-heading">Reliability & Standards</h4>
          <ul className="doc-list">
            <li>RESTful API design following OpenAPI 3.0 specification</li>
            <li>Comprehensive error handling and graceful degradation</li>
            <li>Health check endpoints for monitoring system status</li>
            <li>Modern web standards compliance (ES6+, React best practices)</li>
          </ul>
        </div>
      ),
    },
    planning: {
      title: "Project Planning",
      content: (
        <div>
          <h4 className="doc-heading">Development Methodology</h4>
          <p className="doc-paragraph">
            Agile development approach with iterative feature delivery, continuous testing, and regular deployment cycles.
          </p>

          <h4 className="doc-heading">Key Milestones Achieved</h4>
          <ul className="doc-list">
            <li>✅ Project setup and initial architecture (Frontend + Backend + Database)</li>
            <li>✅ Core learning modules implementation (Colours, Card Types, Turn Phases)</li>
            <li>✅ Scryfall API integration and card search functionality</li>
            <li>✅ User management and favourites system</li>
            <li>✅ Comprehensive testing suite and security implementation</li>
            <li>✅ Production deployment on Vercel and Railway</li>
            <li>✅ Documentation and API specification completion</li>
          </ul>

          <h4 className="doc-heading">Future Enhancements</h4>
          <ul className="doc-list">
            <li>Advanced deck building tools and validation</li>
            <li>Interactive gameplay simulation</li>
            <li>Community features and user-generated content</li>
          </ul>
        </div>
      ),
    },
    testing: {
      title: "Testing Strategy",
      content: (
        <div>
          <h4 className="doc-heading">Quality Assurance Approach</h4>
          <ul className="doc-list">
            <li>Comprehensive test coverage across frontend and backend components</li>
            <li>Automated testing with Jest framework for both React components and API endpoints</li>
            <li>Manual testing for user experience and accessibility validation</li>
            <li>Security testing including rate limiting and input validation</li>
          </ul>

          <h4 className="doc-heading">Testing Types Implemented</h4>
          <ul className="doc-list">
            <li><strong>Unit Testing:</strong> Component rendering, user interactions, utility functions</li>
            <li><strong>Integration Testing:</strong> API endpoints, database operations, external service connections</li>
            <li><strong>Performance Testing:</strong> Response times, memory usage, concurrent user simulation</li>
            <li><strong>User Interface Testing:</strong> Component behaviour, state management, responsive design</li>
            <li><strong>API Testing:</strong> CRUD operations, error handling, authentication flows</li>
          </ul>

          <h4 className="doc-heading">Edge Cases Handled</h4>
          <ul className="doc-list">
            <li>Network connectivity issues with graceful degradation</li>
            <li>Invalid user input validation and sanitisation</li>
            <li>Rate limiting scenarios and appropriate error responses</li>
            <li>Database connection failures with proper error messaging</li>
            <li>Mobile responsiveness across various screen sizes</li>
          </ul>
        </div>
      ),
    },
    implementation: {
      title: "Implementation",
      content: (
        <div>
          <h4 className="doc-heading">Technology Stack</h4>
          <ul className="doc-list">
            <li><strong>Frontend:</strong> Next.js 13+, React 18, CSS-in-JS with custom global styles</li>
            <li><strong>Backend:</strong> Node.js with Express.js, Helmet security middleware, compression</li>
            <li><strong>Database:</strong> PostgreSQL with connection pooling and automated migrations</li>
            <li><strong>External APIs:</strong> Scryfall API for MTG card data and high-resolution images</li>
            <li><strong>Testing:</strong> Jest framework with comprehensive unit and integration tests</li>
          </ul>

          <h4 className="doc-heading">Deployment Architecture</h4>
          <ul className="doc-list">
            <li><strong>Frontend:</strong> Vercel with automatic CI/CD from GitHub integration</li>
            <li><strong>Backend:</strong> Railway with PostgreSQL database and environment management</li>
            <li><strong>Security:</strong> HTTPS enforcement, rate limiting, and comprehensive security headers</li>
            <li><strong>Performance:</strong> Response time monitoring, caching middleware, and compression</li>
          </ul>

          <h4 className="doc-heading">Project Outcomes</h4>
          <p className="doc-paragraph">
            The software successfully meets its objective of providing a comprehensive, beginner-friendly MTG learning platform. Key achievements include complete coverage of fundamental concepts, intuitive user interface, robust card search functionality, and scalable architecture ready for future enhancements.
          </p>
        </div>
      ),
    },
    api: {
      title: "API Documentation",
      content: (
        <div>
          <h4 className="doc-heading">Railway Database Connection</h4>
          <div className="api-connection-status">
            <div className={`connection-indicator ${dbConnectionStatus}`}>
              <span className="connection-dot"></span>
              <span className="connection-text">
                Database:{" "}
                {dbConnectionStatus === "connected"
                  ? "Connected"
                  : dbConnectionStatus === "disconnected"
                    ? "Disconnected"
                    : "Testing..."}
              </span>
            </div>
            <button
              className="btn profile-btn-blue btn-size-small"
              onClick={testDatabaseConnection}
              disabled={isTestingConnection}
            >
              {isTestingConnection ? "Testing..." : "Test Connection"}
            </button>
          </div>

          <h4 className="doc-heading">Interactive API Explorer</h4>
          <p className="doc-paragraph">
            The API documentation provides interactive testing for all backend
            endpoints including users, favourites, messages, and MTG card search
            functionality.
          </p>

          <div className="api-swagger-container">
            {dbConnectionStatus === "connected" ? (
              <div>
                <iframe
                  src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api-docs`}
                  className="swagger-iframe"
                  title="API Documentation"
                  onLoad={() => setSwaggerLoaded(true)}
                  onError={() => setSwaggerError(true)}
                />
                {swaggerError && (
                  <div className="swagger-fallback mt-3">
                    <div className="swagger-fallback-content">
                      <h5>⚠️ Iframe Loading Issues</h5>
                      <p>
                        If the documentation doesn't load above, open it in a new window:
                      </p>
                      <div className="text-center">
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api-docs`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn profile-btn-blue btn-size-small"
                        >
                          🚀 Open in New Window
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="swagger-fallback">
                <div className="swagger-fallback-content">
                  <h5>📋 API Documentation Unavailable</h5>
                  <p>
                    The interactive Swagger documentation requires the backend
                    server to be running.
                  </p>
                  <div className="swagger-fallback-instructions">
                    <p>
                      <strong>
                        To view the interactive API documentation:
                      </strong>
                    </p>
                    <ol>
                      <li>
                        Start the backend server:{" "}
                        <code>cd backend && npm start</code>
                      </li>
                      <li>
                        Ensure it's running on{" "}
                        <code>http://localhost:3001</code>
                      </li>
                      <li>
                        Click "Test Connection" above to verify connectivity
                      </li>
                      <li>Refresh this page once connected</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>

          <h4 className="doc-heading">Available Endpoints</h4>
          <div className="api-endpoints-grid">
            <div className="api-endpoint-card">
              <h5>Health & Status</h5>
              <ul className="doc-list">
                <li>
                  <code>GET /health</code> - Server health check
                </li>
                <li>
                  <code>GET /</code> - Welcome message
                </li>
              </ul>
            </div>

            <div className="api-endpoint-card">
              <h5>User Management</h5>
              <ul className="doc-list">
                <li>
                  <code>GET /api/users</code> - List all users
                </li>
                <li>
                  <code>POST /api/users</code> - Create new user
                </li>
                <li>
                  <code>PUT /api/users/:id</code> - Update user
                </li>
                <li>
                  <code>DELETE /api/users/:id</code> - Delete user
                </li>
              </ul>
            </div>

            <div className="api-endpoint-card">
              <h5>Favourites System</h5>
              <ul className="doc-list">
                <li>
                  <code>GET /api/favourites?user_id=:userid</code> - User's favourites
                </li>
                <li>
                  <code>POST /api/favourites</code> - Add favourite
                </li>
                <li>
                  <code>PUT /api/favourites/:id</code> - Update favourite
                </li>
                <li>
                  <code>DELETE /api/favourites/:id</code> - Remove favourite
                </li>
              </ul>
            </div>

            <div className="api-endpoint-card">
              <h5>Messages System</h5>
              <ul className="doc-list">
                <li>
                  <code>GET /api/messages</code> - List all messages
                </li>
                <li>
                  <code>POST /api/messages</code> - Create message
                </li>
                <li>
                  <code>PUT /api/messages/:id</code> - Update message
                </li>
                <li>
                  <code>DELETE /api/messages/:id</code> - Delete message
                </li>
              </ul>
            </div>

            <div className="api-endpoint-card">
              <h5>Performance Monitoring</h5>
              <ul className="doc-list">
                <li>
                  <code>GET /api/monitoring/performance</code> - System metrics
                </li>
                <li>
                  <code>GET /api/monitoring/health</code> - Health status
                </li>
                <li>
                  <code>POST /api/monitoring/client-metrics</code> - Client data
                </li>
              </ul>
            </div>
          </div>

          <h4 className="doc-heading">Database Schema</h4>
          <p className="doc-paragraph">
            The application uses PostgreSQL hosted on Railway with the following
            main tables:
          </p>
          <ul className="doc-list">
            <li>
              <strong>users</strong> - User account information
            </li>
            <li>
              <strong>favourites</strong> - User's favourite MTG cards with
              personal notes
            </li>
            <li>
              <strong>messages</strong> - System messages and notifications
            </li>
          </ul>
        </div>
      ),
    },
    references: {
      title: "References",
      content: (
        <div>
          <h4 className="doc-heading">Code Repository</h4>
          <p className="doc-paragraph">
            Source code available on GitHub: <a href="https://github.com/tatoslover/Capstone" target="_blank" rel="noopener noreferrer">github.com/tatoslover/Capstone</a>
          </p>

          <h4 className="doc-heading">External Resources</h4>
          <ul className="doc-list">
            <li><strong>Scryfall API:</strong> Comprehensive MTG card database and high-resolution images</li>
            <li><strong>MTG Wiki:</strong> Authoritative source for game mechanics and rules explanations</li>
            <li><strong>Wizards of the Coast:</strong> Official MTG comprehensive rules and tournament regulations</li>
          </ul>

          <h4 className="doc-heading">Technology Documentation</h4>
          <ul className="doc-list">
            <li><strong>Next.js:</strong> React framework for production applications</li>
            <li><strong>Express.js:</strong> Fast, unopinionated web framework for Node.js</li>
            <li><strong>PostgreSQL:</strong> Advanced open-source relational database</li>
            <li><strong>Jest:</strong> JavaScript testing framework with focus on simplicity</li>
            <li><strong>Vercel:</strong> Frontend deployment and hosting platform</li>
            <li><strong>Railway:</strong> Backend deployment and database hosting platform</li>
          </ul>
        </div>
      ),
    },
    performance: {
      title: "Performance Monitoring",
      content: (
        <div>
          <h4 className="doc-heading">Real-time Performance Dashboard</h4>
          <p className="doc-paragraph">
            Monitor application performance including Web Vitals, API response
            times, memory usage, and system health in real-time.
          </p>

          {/* Performance Health Indicator */}
          <ClientOnly
            fallback={
              <div
                style={{
                  height: "100px",
                  background: "var(--theme-cardBg)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--theme-textLight)",
                }}
              >
                Loading performance data...
              </div>
            }
          >
            {performanceMetrics && (
              <PerformanceHealthIndicator
                metrics={performanceMetrics}
                backendStatus={performanceMetrics.backend?.status || "unknown"}
              />
            )}
          </ClientOnly>

          {/* Performance Overview Cards */}
          <ClientOnly
            fallback={
              <div
                style={{
                  height: "200px",
                  background: "var(--theme-cardBg)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--theme-textLight)",
                }}
              >
                Loading performance overview...
              </div>
            }
          >
            <PerformanceOverview metrics={performanceMetrics} />
          </ClientOnly>

          <div className="performance-controls">
            <button
              className="btn btn-primary"
              onClick={() => setShowPerformancePanel(!showPerformancePanel)}
            >
              {showPerformancePanel ? "Hide" : "Show"} Detailed Dashboard
            </button>
            <button
              className="btn btn-primary"
              onClick={async () => {
                try {
                  const frontendMetrics = getPerformanceMetrics();
                  const backendMetrics = await fetchBackendMetrics();
                  setPerformanceMetrics({
                    ...frontendMetrics,
                    backend: backendMetrics,
                  });
                } catch (error) {
                  console.warn("Failed to refresh metrics:", error);
                  // Still update with frontend metrics even if backend fails
                  const frontendMetrics = getPerformanceMetrics();
                  setPerformanceMetrics({ ...frontendMetrics, backend: null });
                }
              }}
            >
              Refresh Metrics
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                try {
                  exportPerformanceReport();
                } catch (error) {
                  console.warn("Failed to export report:", error);
                  // Fallback: create a simple report with available data
                  const report = {
                    timestamp: new Date().toISOString(),
                    frontend: performanceMetrics || getPerformanceMetrics(),
                    backend: performanceMetrics?.backend || null,
                    url: window.location.href,
                    note: "Exported with limited data due to system constraints",
                  };

                  const blob = new Blob([JSON.stringify(report, null, 2)], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `performance-report-${Date.now()}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              }}
            >
              Export Report
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                try {
                  logPerformanceSummary();
                } catch (error) {
                  console.warn("Performance summary failed:", error);
                  console.log("📊 Basic Performance Info:", {
                    currentPage: window.location.pathname,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    availableMetrics: performanceMetrics
                      ? "Available"
                      : "Loading...",
                  });
                }
              }}
            >
              Log to Console
            </button>
          </div>

          <ClientOnly>
            {showPerformancePanel && (
              <div className="performance-embedded">
                <PerformanceDashboard isVisible={true} embedded={true} />
              </div>
            )}
          </ClientOnly>

          <h4 className="doc-heading" style={{ marginTop: "30px" }}>
            Performance Features
          </h4>
          <ul className="doc-list">
            <li>
              <strong>Web Vitals Monitoring:</strong> Tracks LCP, FID, and CLS
              metrics following Google's Core Web Vitals standards
            </li>
            <li>
              <strong>API Performance:</strong> Monitors response times, success
              rates, and identifies slow endpoints
            </li>
            <li>
              <strong>User Interaction Tracking:</strong> Measures interaction
              response times and identifies performance bottlenecks
            </li>
            <li>
              <strong>Memory Monitoring:</strong> Tracks JavaScript heap usage
              and identifies potential memory leaks
            </li>
            <li>
              <strong>Error Tracking:</strong> Captures and reports JavaScript
              errors and unhandled promise rejections
            </li>
            <li>
              <strong>Real-time Updates:</strong> Automatically refreshes
              metrics every 5 seconds when dashboard is visible
            </li>
            <li>
              <strong>Export Functionality:</strong> Download detailed
              performance reports in JSON format
            </li>
          </ul>

          <h4 className="doc-heading" style={{ marginTop: "20px" }}>
            Developer Tools
          </h4>
          <p className="doc-paragraph">
            Performance monitoring includes developer tools accessible via
            keyboard shortcuts and console commands:
          </p>
          <ul className="doc-list">
            <li>
              <strong>Keyboard Shortcut:</strong> Press <kbd>Ctrl+Shift+P</kbd>{" "}
              to toggle floating performance dashboard
            </li>
            <li>
              <strong>Console Access:</strong> Use{" "}
              <code>window.performanceUtils</code> object for programmatic
              access
            </li>
            <li>
              <strong>Automatic Reporting:</strong> Metrics are automatically
              sent to backend monitoring endpoints
            </li>
            <li>
              <strong>Development Warnings:</strong> Console warnings for slow
              operations and high memory usage
            </li>
          </ul>
        </div>
      ),
    },
  };

  return (
    <Layout title="Documentation - Planeswalker's Primer">
      <div className="container page-content">
        {/* Hero Section */}
        <div className="text-center mb-3">
          <div className="header-box doc-hero-container">
            <h1>Capstone Project Documentation</h1>
            <p className="doc-hero-subtitle">
              Comprehensive documentation for the Planeswalker's Primer project
              development and implementation.
            </p>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="card doc-overview-container">
          <h2 className="doc-section-title">Project Overview</h2>
          <div className="doc-overview-text">
            <p className="doc-overview-paragraph">
              Planeswalker's Primer is a comprehensive Magic: The Gathering learning platform designed to help new players understand the game's fundamentals through interactive guides and structured learning paths.
            </p>
            <p className="doc-overview-paragraph">
              The application features a dark-themed interface with comprehensive coverage of MTG basics including the six colour system, card anatomy, turn phases, combat mechanics, deck building principles, and over 270 gameplay mechanics with detailed explanations.
            </p>
            <p className="doc-overview-paragraph">
              Built as a full-stack web application with Next.js frontend and Express.js backend, the project includes user management, a favourites system for MTG cards via Scryfall API integration, and comprehensive API documentation.
            </p>
            <p>
              The project demonstrates modern web development practices including responsive design, API integration, database management, security implementation, and comprehensive testing strategies.
            </p>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="card doc-sections-container">
          <h2 className="doc-section-title">Project Documentation</h2>

          <div className="doc-section-buttons">
            <button
              onClick={() => handleSectionClick("introduction")}
              className={`doc-section-btn ${selectedSection === "introduction" ? "active" : ""}`}
            >
              📋 Introduction
            </button>
            <button
              onClick={() => handleSectionClick("product")}
              className={`doc-section-btn ${selectedSection === "product" ? "active" : ""}`}
            >
              🏗️ Product Description
            </button>
            <button
              onClick={() => handleSectionClick("requirements")}
              className={`doc-section-btn ${selectedSection === "requirements" ? "active" : ""}`}
            >
              ⚙️ Requirements
            </button>
            <button
              onClick={() => handleSectionClick("planning")}
              className={`doc-section-btn ${selectedSection === "planning" ? "active" : ""}`}
            >
              📅 Project Planning
            </button>
            <button
              onClick={() => handleSectionClick("testing")}
              className={`doc-section-btn ${selectedSection === "testing" ? "active" : ""}`}
            >
              🧪 Testing Strategy
            </button>
            <button
              onClick={() => handleSectionClick("implementation")}
              className={`doc-section-btn ${selectedSection === "implementation" ? "active" : ""}`}
            >
              🚀 Implementation
            </button>
            <button
              onClick={() => handleSectionClick("api")}
              className={`doc-section-btn ${selectedSection === "api" ? "active" : ""}`}
            >
              🔌 API Documentation
            </button>
            <button
              onClick={() => handleSectionClick("performance")}
              className={`doc-section-btn ${selectedSection === "performance" ? "active" : ""}`}
            >
              🚀 Performance Monitoring
            </button>
            <button
              onClick={() => handleSectionClick("references")}
              className={`doc-section-btn ${selectedSection === "references" ? "active" : ""}`}
            >
              📚 References
            </button>
          </div>

          {selectedSection && (
            <div className="doc-content-panel">
              <h3 className="doc-content-title">
                {sectionInfo[selectedSection].title}
              </h3>
              <div className="doc-content-body">
                {sectionInfo[selectedSection].content}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
