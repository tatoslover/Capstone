import { useState, useEffect } from "react";
import {
  allMechanics,
  mechanicsDetails,
  evergreenKeywords,
  getMechanicDetails,
  getMechanicWikiUrl,
} from "../../data/mechanics";

export default function MechanicsList({ onMechanicSelect, selectedMechanic }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [clickCount, setClickCount] = useState({});

  const handleCategoryClick = (categoryKey) => {
    // Single click to toggle
    if (selectedCategory === categoryKey) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryKey);
    }
  };

  const handleMechanicClick = (mechanicName) => {
    if (onMechanicSelect) {
      const newSelection =
        selectedMechanic?.name === mechanicName
          ? null
          : {
              name: mechanicName,
              id: mechanicName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            };
      onMechanicSelect(newSelection);
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

  const categories = {
    all: {
      title: "All Mechanics",
      description: `Browse all ${allMechanics.length} mechanics`,
      icon: "📋",
      mechanics: allMechanics,
    },
    evergreen: {
      title: "Evergreen",
      description: `Core mechanics that appear in most sets`,
      icon: "🌲",
      mechanics: evergreenKeywords,
    },
  };

  return (
    <div className="mechanics-search">
      {/* Header */}
      <div className="card-header" style={{ marginBottom: "1.5rem" }}>
        <h2 className="card-title">Mechanics Guide</h2>
        <p className="card-subtitle">
          Search and explore {allMechanics.length} Magic: The Gathering
          mechanics by category
        </p>
      </div>

      {/* Category Selection Grid */}
      <div
        className="section-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.5rem",
          maxWidth: "800px",
          margin: "0 auto 2rem auto",
        }}
      >
        {Object.entries(categories).map(([categoryKey, category]) => (
          <button
            key={categoryKey}
            onClick={() => handleCategoryClick(categoryKey)}
            className={`section-button ${selectedCategory === categoryKey ? "active" : ""}`}
          >
            <span style={{ fontSize: "1.5rem" }}>{category.icon}</span>
            <span>{category.title}</span>
            <span style={{ fontSize: "0.8rem", color: "#adb5bd" }}>
              {category.mechanics.length} mechanics
            </span>
          </button>
        ))}
      </div>

      {/* Selected Category Content */}
      {selectedCategory && categories[selectedCategory] && (
        <div className="section-content">
          <h3
            style={{
              marginBottom: "1rem",
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            {categories[selectedCategory].icon}{" "}
            {categories[selectedCategory].title}
          </h3>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#adb5bd",
              fontSize: "1.1rem",
            }}
          >
            {categories[selectedCategory].description}
          </p>

          {/* Search within category */}
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <input
              type="text"
              placeholder={`Search within ${categories[selectedCategory].title.toLowerCase()}...`}
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

          {/* Mechanics Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {(() => {
              let mechanicsToShow = categories[selectedCategory].mechanics;

              if (searchQuery.trim()) {
                mechanicsToShow = mechanicsToShow.filter((mechanic) =>
                  mechanic.toLowerCase().includes(searchQuery.toLowerCase()),
                );
              }

              if (mechanicsToShow.length === 0) {
                return (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      padding: "2rem",
                      color: "#999",
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                      🔍
                    </div>
                    <p>No mechanics found</p>
                    <p style={{ fontSize: "0.9rem" }}>
                      Try a different search term
                    </p>
                  </div>
                );
              }

              return mechanicsToShow.map((mechanic) => {
                const mechanicData = getMechanicDetails(mechanic);

                return (
                  <div
                    key={mechanic}
                    onClick={() => handleMechanicClick(mechanic)}
                    style={{
                      padding: "1rem",
                      background:
                        selectedMechanic?.name === mechanic
                          ? "#007bff"
                          : "#2a2a2a",
                      border: `1px solid ${selectedMechanic?.name === mechanic ? "#0056b3" : "#444"}`,
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      color:
                        selectedMechanic?.name === mechanic
                          ? "white"
                          : "#e0e0e0",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedMechanic?.name !== mechanic) {
                        e.currentTarget.style.backgroundColor = "#3a3a3a";
                        e.currentTarget.style.borderColor = "#555";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedMechanic?.name !== mechanic) {
                        e.currentTarget.style.backgroundColor = "#2a2a2a";
                        e.currentTarget.style.borderColor = "#444";
                      }
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 0.5rem 0",
                        fontSize: "1.1rem",
                        color:
                          selectedMechanic?.name === mechanic
                            ? "white"
                            : "#ffffff",
                      }}
                    >
                      {mechanic}
                    </h4>

                    {mechanicData && (
                      <>
                        <p
                          style={{
                            margin: "0 0 0.5rem 0",
                            fontSize: "0.9rem",
                            lineHeight: "1.4",
                            color:
                              selectedMechanic?.name === mechanic
                                ? "#e6f3ff"
                                : "#adb5bd",
                          }}
                        >
                          {removeCitations(mechanicData.description)?.substring(
                            0,
                            120,
                          )}
                          {(mechanicData.description || "").length > 120 &&
                            "..."}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {mechanicData.isEvergreen && (
                            <span
                              style={{
                                padding: "0.2rem 0.4rem",
                                background: "#28a745",
                                borderRadius: "0.2rem",
                                fontSize: "0.7rem",
                                fontWeight: "bold",
                                color: "#ffffff",
                              }}
                            >
                              Evergreen
                            </span>
                          )}

                          {mechanicData.category && (
                            <span
                              style={{
                                padding: "0.2rem 0.4rem",
                                background: "#6f42c1",
                                borderRadius: "0.2rem",
                                fontSize: "0.7rem",
                                fontWeight: "bold",
                                color: "#ffffff",
                              }}
                            >
                              {mechanicData.category}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Selected Mechanic Details */}
      {selectedMechanic && (
        <div style={{ marginTop: "2rem" }}>
          <div className="section-content">
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
                    <div style={{ marginBottom: "1rem" }}>
                      {mechanicData.isEvergreen && (
                        <span
                          style={{
                            padding: "0.25rem 0.5rem",
                            background: "#28a745",
                            borderRadius: "0.25rem",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            color: "#ffffff",
                          }}
                        >
                          Evergreen
                        </span>
                      )}
                      {mechanicData.category && (
                        <span
                          style={{
                            marginLeft: mechanicData.isEvergreen
                              ? "0.5rem"
                              : "0",
                            padding: "0.25rem 0.5rem",
                            background: "#6f42c1",
                            borderRadius: "0.25rem",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            color: "#ffffff",
                          }}
                        >
                          {mechanicData.category}
                        </span>
                      )}
                    </div>
                  </div>
                );
              } else {
                return (
                  <p style={{ margin: 0, lineHeight: "1.5", color: "#6c757d" }}>
                    Description for {selectedMechanic.name} is not available
                    yet.
                  </p>
                );
              }
            })()}
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .section-grid {
            grid-template-columns: repeat(
              auto-fit,
              minmax(140px, 1fr)
            ) !important;
          }
        }
      `}</style>
    </div>
  );
}
