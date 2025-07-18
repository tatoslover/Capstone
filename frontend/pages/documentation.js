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
