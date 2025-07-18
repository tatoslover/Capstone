import { useState, useEffect } from "react";
import { allMechanics } from "../../data/mechanics";

export default function MechanicsList({ onMechanicSelect, selectedMechanic }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMechanics, setFilteredMechanics] = useState(allMechanics);

  // Filter mechanics based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allMechanics.filter((mechanic) =>
        mechanic.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredMechanics(filtered);
    } else {
      setFilteredMechanics(allMechanics);
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

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="mechanics-search">
      {/* Header */}
      <div className="card-header" style={{ marginBottom: "1.5rem" }}>
        <h2 className="card-title">MTG Mechanics Guide</h2>
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
          "@media (max-width: 768px)": {
            gridTemplateColumns: "1fr",
          },
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
              <p style={{ margin: 0, lineHeight: "1.5" }}>
                <strong style={{ color: "#ffc107" }}>TBC</strong> - Description
                and rules for {selectedMechanic.name} will be added here.
              </p>
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
