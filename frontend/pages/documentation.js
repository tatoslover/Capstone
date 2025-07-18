import { useState } from "react";
import Layout from "../components/Layout/Layout";

export default function Documentation() {
  const [selectedSection, setSelectedSection] = useState(null);

  const handleSectionClick = (section) => {
    setSelectedSection(selectedSection === section ? null : section);
  };

  const sectionInfo = {
    introduction: {
      title: "Introduction",
      content: (
        <div>
          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>Purpose</h4>
          <ul style={{ marginBottom: "1.5rem" }}>
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

          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            Industry/Domain
          </h4>
          <ul style={{ marginBottom: "1.5rem" }}>
            <li>TBC - What is the industry/domain?</li>
            <li>
              TBC - What is the current state of this industry? (e.g. challenges
              from startups)
            </li>
            <li>TBC - What is the overall industry value-chain?</li>
            <li>TBC - What are the key concepts in the industry?</li>
            <li>TBC - Is the project relevant to other industries?</li>
          </ul>

          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            Stakeholders
          </h4>
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
          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            Architecture Diagram
          </h4>
          <p style={{ marginBottom: "1.5rem" }}>
            TBC - Include a diagram of the building blocks of the design
            including users and how they interact with the product.
          </p>

          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            User Stories
          </h4>
          <div style={{ marginBottom: "1.5rem" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                color: "#dee2e6",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #6c757d" }}>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>#</th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>
                    User Story Title
                  </th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>
                    Description
                  </th>
                  <th style={{ padding: "0.5rem", textAlign: "left" }}>
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: "0.5rem" }}>1</td>
                  <td style={{ padding: "0.5rem" }}>TBC</td>
                  <td style={{ padding: "0.5rem" }}>TBC</td>
                  <td style={{ padding: "0.5rem" }}>TBC</td>
                </tr>
                <tr>
                  <td style={{ padding: "0.5rem" }}>2</td>
                  <td style={{ padding: "0.5rem" }}>TBC</td>
                  <td style={{ padding: "0.5rem" }}>TBC</td>
                  <td style={{ padding: "0.5rem" }}>TBC</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>User Flow</h4>
          <p style={{ marginBottom: "1.5rem" }}>
            TBC - Present as a flow diagram the steps a user may make in
            interacting with the software.
          </p>

          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            Wireframe Design
          </h4>
          <p style={{ marginBottom: "1.5rem" }}>
            TBC - Show elements of the user interface, either manually or via a
            tool such as Figma.
          </p>

          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            Open Questions/Out of Scope
          </h4>
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
          <p style={{ marginBottom: "1.5rem" }}>
            TBC - Include a Gantt chart or screenshot of a Trello board showing
            key milestones (with dates) to complete the project.
          </p>

          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            Key Milestones
          </h4>
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

          <h4
            style={{
              color: "#ffffff",
              marginBottom: "1rem",
              marginTop: "1.5rem",
            }}
          >
            Testing Approaches
          </h4>
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
          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            Deployment Considerations
          </h4>
          <p style={{ marginBottom: "1.5rem" }}>
            TBC - What were the considerations for deploying the software?
          </p>

          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            Technology Stack
          </h4>
          <ul style={{ marginBottom: "1.5rem" }}>
            <li>TBC - Frontend technologies (Next.js, React, etc.)</li>
            <li>TBC - Backend technologies (Node.js, Express, etc.)</li>
            <li>TBC - Database and storage solutions</li>
            <li>TBC - External APIs and services</li>
            <li>TBC - Deployment and hosting platform</li>
          </ul>

          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            End-to-end Solution
          </h4>
          <p>TBC - How well did the software meet its objectives?</p>
        </div>
      ),
    },
    references: {
      title: "References",
      content: (
        <div>
          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            Code Repository
          </h4>
          <p style={{ marginBottom: "1.5rem" }}>
            TBC - Where is the code used in the project? (link to GitHub)
          </p>

          <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>
            Resources Used
          </h4>
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
      <div className="container" style={{ padding: "2rem 1rem" }}>
        {/* Hero Section */}
        <div className="text-center mb-3">
          <div
            className="header-box"
            style={{ maxWidth: "800px", margin: "0 auto" }}
          >
            <h1>Capstone Project Documentation</h1>
            <p style={{ fontSize: "1.25rem" }}>
              Comprehensive documentation for the Planeswalker's Primer project
              development and implementation.
            </p>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            Project Overview
          </h2>
          <div
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              color: "#dee2e6",
              lineHeight: "1.6",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>
              TBC - Planeswalker's Primer is a beginner-friendly web application
              designed to help new Magic: The Gathering players understand the
              game's mechanics, rules, and concepts.
            </p>
            <p style={{ marginBottom: "1rem" }}>
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
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            Project Documentation
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.5rem",
              maxWidth: "1000px",
              margin: "0 auto 2rem auto",
            }}
          >
            <button
              onClick={() => handleSectionClick("introduction")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedSection === "introduction" ? "#495057" : "#343a40",
                border: `2px solid ${selectedSection === "introduction" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedSection !== "introduction") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedSection !== "introduction") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              📋 Introduction
            </button>
            <button
              onClick={() => handleSectionClick("product")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedSection === "product" ? "#495057" : "#343a40",
                border: `2px solid ${selectedSection === "product" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedSection !== "product") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedSection !== "product") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              🏗️ Product Description
            </button>
            <button
              onClick={() => handleSectionClick("requirements")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedSection === "requirements" ? "#495057" : "#343a40",
                border: `2px solid ${selectedSection === "requirements" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedSection !== "requirements") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedSection !== "requirements") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              ⚙️ Requirements
            </button>
            <button
              onClick={() => handleSectionClick("planning")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedSection === "planning" ? "#495057" : "#343a40",
                border: `2px solid ${selectedSection === "planning" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedSection !== "planning") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedSection !== "planning") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              📅 Project Planning
            </button>
            <button
              onClick={() => handleSectionClick("testing")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedSection === "testing" ? "#495057" : "#343a40",
                border: `2px solid ${selectedSection === "testing" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedSection !== "testing") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedSection !== "testing") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              🧪 Testing Strategy
            </button>
            <button
              onClick={() => handleSectionClick("implementation")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedSection === "implementation" ? "#495057" : "#343a40",
                border: `2px solid ${selectedSection === "implementation" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedSection !== "implementation") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedSection !== "implementation") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              🚀 Implementation
            </button>
            <button
              onClick={() => handleSectionClick("references")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedSection === "references" ? "#495057" : "#343a40",
                border: `2px solid ${selectedSection === "references" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedSection !== "references") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedSection !== "references") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              📚 References
            </button>
          </div>

          {selectedSection && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1.5rem",
                background: "#495057",
                borderRadius: "0.5rem",
                border: "1px solid #6c757d",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#ffffff" }}>
                {sectionInfo[selectedSection].title}
              </h3>
              <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                {sectionInfo[selectedSection].content}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
