import { useState, useEffect } from "react";
import { allMechanics, mechanicsDetails } from "../../data/mechanics";

export default function MechanicsList({ onMechanicSelect, selectedMechanic }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMechanics, setFilteredMechanics] = useState(
    allMechanics.sort(),
  );

  // Filter mechanics based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allMechanics
        .filter((mechanic) =>
          mechanic.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .sort();
      setFilteredMechanics(filtered);
    } else {
      setFilteredMechanics(allMechanics.sort());
    }
  }, [searchQuery]);

  const handleMechanicClick = (mechanicName) => {
    if (onMechanicSelect) {
      onMechanicSelect({
        name: mechanicName,
        id: mechanicName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      });
    }
  };

  // Remove citation markers like [1], [2][3], etc. from descriptions
  const removeCitations = (text) => {
    if (!text) return text;
    return text.replace(/\[\d+\](\[\d+\])*/g, "");
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="mechanics-search">
      {/* Header */}
      <div className="card-header" style={{ marginBottom: "1.5rem" }}>
        <h2 className="card-title">Mechanics Guide</h2>
        <p className="card-subtitle">
          Search and explore {allMechanics.length} Magic: The Gathering
          mechanics
        </p>
      </div>

      {/* Main Layout: Search Left, Dropdown Right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Left Side: Search */}
        <div>
          <h3 style={{ marginBottom: "1rem", color: "#495057" }}>
            🔍 Search Mechanics
          </h3>

          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <input
              type="text"
              placeholder="Type to search mechanics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem",
                background: "#1a1a1a",
                color: "white",
                border: "2px solid #444",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#007bff")}
              onBlur={(e) => (e.target.style.borderColor = "#444")}
            />

            {searchQuery && (
              <button
                onClick={clearSearch}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Selected Mechanic Details */}
          {selectedMechanic && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1.5rem",
                background: "#1a1a1a",
                border: "1px solid #444",
                borderRadius: "0.5rem",
                color: "#e0e0e0",
              }}
            >
              <h4
                style={{
                  margin: "0 0 1rem 0",
                  color: "var(--theme-accent)",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                }}
              >
                {selectedMechanic.name}
              </h4>
              {(() => {
                const mechanicKey = selectedMechanic.name.toLowerCase();
                const mechanicData = mechanicsDetails[mechanicKey];

                if (mechanicData) {
                  return (
                    <div>
                      <p style={{ margin: "0 0 1rem 0", lineHeight: "1.5" }}>
                        {removeCitations(mechanicData.description)}
                      </p>
                      {mechanicData.category && (
                        <div style={{ marginBottom: "1rem" }}>
                          <span
                            style={{
                              padding: "0.25rem 0.5rem",
                              background: mechanicData.isEvergreen
                                ? "#28a745"
                                : "#6f42c1",
                              borderRadius: "0.25rem",
                              fontSize: "0.8rem",
                              fontWeight: "bold",
                              color: "#ffffff",
                            }}
                          >
                            {mechanicData.isEvergreen
                              ? "Evergreen"
                              : mechanicData.category}
                          </span>
                          {mechanicData.isBeginnerFriendly && (
                            <span
                              style={{
                                marginLeft: "0.5rem",
                                padding: "0.25rem 0.5rem",
                                background: "#17a2b8",
                                borderRadius: "0.25rem",
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                                color: "#ffffff",
                              }}
                            >
                              Beginner Friendly
                            </span>
                          )}
                        </div>
                      )}
                      {mechanicData.rules &&
                        mechanicData.rules.trim() !== "" && (
                          <div style={{ marginBottom: "1rem" }}>
                            <h5
                              style={{
                                color: "#ffc107",
                                margin: "0 0 0.5rem 0",
                              }}
                            >
                              Rules:
                            </h5>
                            <p
                              style={{
                                margin: "0",
                                fontSize: "0.9rem",
                                color: "#adb5bd",
                              }}
                            >
                              {removeCitations(mechanicData.rules)}
                            </p>
                          </div>
                        )}
                      {mechanicData.wikiUrl && (
                        <a
                          href={mechanicData.wikiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#007bff",
                            textDecoration: "none",
                            fontSize: "0.9rem",
                          }}
                        >
                          📖 Learn more on MTG Wiki →
                        </a>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <p
                      style={{ margin: 0, lineHeight: "1.5", color: "#6c757d" }}
                    >
                      Description for {selectedMechanic.name} is not available
                      yet.
                    </p>
                  );
                }
              })()}
            </div>
          )}
        </div>

        {/* Right Side: Scrollable Dropdown */}
        <div>
          <h3 style={{ marginBottom: "1rem", color: "#495057" }}>
            📋 All Mechanics
          </h3>

          <div
            style={{
              height: "400px",
              background: "#1a1a1a",
              border: "2px solid #444",
              borderRadius: "0.5rem",
              overflowY: "auto",
              padding: "0.5rem",
            }}
          >
            {filteredMechanics.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "#999",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔍</div>
                <p>No mechanics found</p>
                <p style={{ fontSize: "0.9rem" }}>
                  Try a different search term
                </p>
              </div>
            ) : (
              filteredMechanics.map((mechanic) => (
                <div
                  key={mechanic}
                  onClick={() => handleMechanicClick(mechanic)}
                  style={{
                    padding: "0.75rem 1rem",
                    margin: "0.25rem 0",
                    cursor: "pointer",
                    borderRadius: "0.25rem",
                    background:
                      selectedMechanic?.name === mechanic
                        ? "#007bff"
                        : "transparent",
                    color:
                      selectedMechanic?.name === mechanic ? "white" : "#e0e0e0",
                    transition: "all 0.2s ease",
                    border: "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMechanic?.name !== mechanic) {
                      e.target.style.backgroundColor = "#333";
                      e.target.style.borderColor = "#555";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMechanic?.name !== mechanic) {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.borderColor = "transparent";
                    }
                  }}
                >
                  {mechanic}
                </div>
              ))
            )}
          </div>

          {/* Scroll hint */}
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.8rem",
              color: "#6c757d",
              textAlign: "center",
            }}
          >
            💡 Scroll to see all mechanics
          </div>
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .mechanics-search > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
