import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { apiService, addConnectionListener, removeConnectionListener } from "../services/apiService";

export default function Documentation() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [dbConnectionStatus, setDbConnectionStatus] = useState("unknown");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [swaggerLoaded, setSwaggerLoaded] = useState(false);
  const [swaggerError, setSwaggerError] = useState(false);

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

  const sectionInfo = {
    introduction: {
      title: "Introduction",
      content: (
        <div>
          <h4 className="doc-heading">Purpose</h4>
          <ul className="doc-list">
            <li>
              TBC - What is the problem or opportunity that the project is
              investigating?
            </li>
            <li>TBC - Why is this problem valuable to address?</li>
            <li>
              TBC - What is the current state (e.g. unsatisfied users, lost
              revenue)?
            </li>
            <li>TBC - What is the desired state?</li>
            <li>
              TBC - Has this problem been addressed by other projects? What were
              the outcomes?
            </li>
          </ul>

          <h4 className="doc-heading">Industry/Domain</h4>
          <ul className="doc-list">
            <li>TBC - What is the industry/domain?</li>
            <li>
              TBC - What is the current state of this industry? (e.g. challenges
              from startups)
            </li>
            <li>TBC - What is the overall industry value-chain?</li>
            <li>TBC - What are the key concepts in the industry?</li>
            <li>TBC - Is the project relevant to other industries?</li>
          </ul>

          <h4 className="doc-heading">Stakeholders</h4>
          <ul>
            <li>
              TBC - Who are the stakeholders? (be as specific as possible as to
              who would have access to the software)
            </li>
            <li>TBC - Why do they care about this software?</li>
            <li>TBC - What are the stakeholders' expectations?</li>
          </ul>
        </div>
      ),
    },
    product: {
      title: "Product Description",
      content: (
        <div>
          <h4 className="doc-heading">Architecture Diagram</h4>
          <p className="doc-paragraph">
            TBC - Include a diagram of the building blocks of the design
            including users and how they interact with the product.
          </p>

          <h4 className="doc-heading">User Stories</h4>
          <div className="doc-paragraph">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Story Title</th>
                  <th>Description</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>TBC</td>
                  <td>TBC</td>
                  <td>TBC</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>TBC</td>
                  <td>TBC</td>
                  <td>TBC</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="doc-heading">User Flow</h4>
          <p className="doc-paragraph">
            TBC - Present as a flow diagram the steps a user may make in
            interacting with the software.
          </p>

          <h4 className="doc-heading">Wireframe Design</h4>
          <p className="doc-paragraph">
            TBC - Show elements of the user interface, either manually or via a
            tool such as Figma.
          </p>

          <h4 className="doc-heading">Open Questions/Out of Scope</h4>
          <p>TBC - What features are considered out of scope?</p>
        </div>
      ),
    },
    requirements: {
      title: "Non-functional Requirements",
      content: (
        <div>
          <ul>
            <li>
              TBC - What are the key security requirements? (e.g. login, storage
              of personal details, inactivity timeout, data encryption)
            </li>
            <li>TBC - How many transactions should be enabled at peak time?</li>
            <li>TBC - How easy to use does the software need to be?</li>
            <li>
              TBC - How quickly should the application respond to user requests?
            </li>
            <li>
              TBC - How reliable must the application be? (e.g. mean time
              between failures)
            </li>
            <li>
              TBC - Does the software conform to any technical standards to ease
              maintainability?
            </li>
          </ul>
        </div>
      ),
    },
    planning: {
      title: "Project Planning",
      content: (
        <div>
          <p className="doc-paragraph">
            TBC - Include a Gantt chart or screenshot of a Trello board showing
            key milestones (with dates) to complete the project.
          </p>

          <h4 className="doc-heading">Key Milestones</h4>
          <ul>
            <li>TBC - Project initiation and requirements gathering</li>
            <li>TBC - Design and architecture phase</li>
            <li>TBC - Core development sprints</li>
            <li>TBC - Testing and quality assurance</li>
            <li>TBC - Deployment and documentation</li>
            <li>TBC - Final presentation and delivery</li>
          </ul>
        </div>
      ),
    },
    testing: {
      title: "Testing Strategy",
      content: (
        <div>
          <ul>
            <li>
              TBC - What were steps undertaken to achieve product quality?
            </li>
            <li>TBC - How was each feature of the application tested?</li>
            <li>TBC - How did you handle edge cases?</li>
          </ul>

          <h4 className="doc-heading-spaced">Testing Approaches</h4>
          <ul>
            <li>TBC - Unit testing strategy</li>
            <li>TBC - Integration testing</li>
            <li>TBC - User acceptance testing</li>
            <li>TBC - Performance testing</li>
            <li>TBC - Security testing</li>
          </ul>
        </div>
      ),
    },
    implementation: {
      title: "Implementation",
      content: (
        <div>
          <h4 className="doc-heading">Deployment Considerations</h4>
          <p className="doc-paragraph">
            TBC - What were the considerations for deploying the software?
          </p>

          <h4 className="doc-heading">Technology Stack</h4>
          <ul className="doc-list">
            <li>TBC - Frontend technologies (Next.js, React, etc.)</li>
            <li>TBC - Backend technologies (Node.js, Express, etc.)</li>
            <li>TBC - Database and storage solutions</li>
            <li>TBC - External APIs and services</li>
            <li>TBC - Deployment and hosting platform</li>
          </ul>

          <h4 className="doc-heading">End-to-end Solution</h4>
          <p>TBC - How well did the software meet its objectives?</p>
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
                Database: {dbConnectionStatus === "connected" ? "Connected" :
                          dbConnectionStatus === "disconnected" ? "Disconnected" :
                          "Testing..."}
              </span>
            </div>
            <button
              className="btn btn-secondary btn-size-small"
              onClick={testDatabaseConnection}
              disabled={isTestingConnection}
            >
              {isTestingConnection ? "Testing..." : "Test Connection"}
            </button>
          </div>

          <h4 className="doc-heading">Interactive API Explorer</h4>
          <p className="doc-paragraph">
            The API documentation provides interactive testing for all backend endpoints including users, favourites, messages, and MTG card search functionality.
          </p>

          <div className="api-swagger-container">
            {dbConnectionStatus === "connected" && !swaggerError ? (
              <iframe
                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api-docs`}
                className="swagger-iframe"
                title="API Documentation"
                onLoad={() => setSwaggerLoaded(true)}
                onError={() => setSwaggerError(true)}
              />
            ) : (
              <div className="swagger-fallback">
                <div className="swagger-fallback-content">
                  <h5>📋 API Documentation Unavailable</h5>
                  <p>The interactive Swagger documentation requires the backend server to be running.</p>
                  {dbConnectionStatus === "disconnected" && (
                    <div className="swagger-fallback-instructions">
                      <p><strong>To view the interactive API documentation:</strong></p>
                      <ol>
                        <li>Start the backend server: <code>cd backend && npm start</code></li>
                        <li>Ensure it's running on <code>http://localhost:3001</code></li>
                        <li>Click "Test Connection" above to verify connectivity</li>
                        <li>Refresh this page once connected</li>
                      </ol>
                      <p>Alternatively, visit <a href="http://localhost:3001/api-docs" target="_blank" rel="noopener noreferrer">http://localhost:3001/api-docs</a> directly when the server is running.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <h4 className="doc-heading">Available Endpoints</h4>
          <div className="api-endpoints-grid">
            <div className="api-endpoint-card">
              <h5>Health & Status</h5>
              <ul className="doc-list">
                <li><code>GET /health</code> - Server health check</li>
                <li><code>GET /</code> - Welcome message</li>
              </ul>
            </div>

            <div className="api-endpoint-card">
              <h5>User Management</h5>
              <ul className="doc-list">
                <li><code>GET /api/users</code> - List all users</li>
                <li><code>POST /api/users</code> - Create new user</li>
                <li><code>PUT /api/users/:id</code> - Update user</li>
                <li><code>DELETE /api/users/:id</code> - Delete user</li>
              </ul>
            </div>

            <div className="api-endpoint-card">
              <h5>Favourites System</h5>
              <ul className="doc-list">
                <li><code>GET /api/favorites/:userId</code> - User's favourites</li>
                <li><code>POST /api/favorites</code> - Add favourite</li>
                <li><code>PUT /api/favorites/:id</code> - Update favourite</li>
                <li><code>DELETE /api/favorites/:id</code> - Remove favourite</li>
              </ul>
            </div>

            <div className="api-endpoint-card">
              <h5>MTG Cards (Scryfall)</h5>
              <ul className="doc-list">
                <li><code>GET /api/cards/search</code> - Search cards</li>
                <li><code>GET /api/cards/random</code> - Random cards</li>
                <li><code>GET /api/cards/:id</code> - Get card by ID</li>
              </ul>
            </div>
          </div>

          <h4 className="doc-heading">Database Schema</h4>
          <p className="doc-paragraph">
            The application uses PostgreSQL hosted on Railway with the following main tables:
          </p>
          <ul className="doc-list">
            <li><strong>users</strong> - User account information</li>
            <li><strong>favourites</strong> - User's favourite MTG cards with personal notes</li>
            <li><strong>messages</strong> - System messages and notifications</li>
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
            TBC - Where is the code used in the project? (link to GitHub)
          </p>

          <h4 className="doc-heading">Resources Used</h4>
          <ul>
            <li>TBC - Libraries and frameworks</li>
            <li>TBC - APIs and external services</li>
            <li>TBC - Databases and storage</li>
            <li>TBC - Development tools</li>
            <li>TBC - Design resources</li>
            <li>TBC - Documentation and references</li>
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
              TBC - Planeswalker's Primer is a beginner-friendly web application
              designed to help new Magic: The Gathering players understand the
              game's mechanics, rules, and concepts.
            </p>
            <p className="doc-overview-paragraph">
              TBC - The project addresses the steep learning curve that new MTG
              players face by providing an accessible, mobile-first interface
              with interactive learning sections.
            </p>
            <p>
              TBC - This capstone project demonstrates full-stack development
              skills, user experience design, and educational content creation.
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
