import { useState, useEffect } from "react";
import {
  allMechanics,
  mechanicsDetails,
  evergreenKeywords,
  beginnerFriendly,
} from "../../data/mechanics";

export default function FilteredMechanicsList({
  onMechanicSelect,
  selectedMechanic,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMechanics, setFilteredMechanics] = useState(
    allMechanics.sort(),
  );
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Filter mechanics based on search and category
  useEffect(() => {
    let filtered = allMechanics;

    // Apply category filter first
    if (selectedCategory === "evergreen") {
      filtered = evergreenKeywords;
    } else if (selectedCategory === "beginner") {
      filtered = beginnerFriendly;
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((mechanic) =>
        mechanic.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredMechanics(filtered.sort());
  }, [searchQuery, selectedCategory]);

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

  const categories = [
    { id: "all", label: "All Mechanics", count: allMechanics.length },
    { id: "evergreen", label: "Evergreen", count: evergreenKeywords.length },
    {
      id: "beginner",
      label: "Beginner Friendly",
      count: beginnerFriendly.length,
    },
  ];

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      {/* Centered Header */}
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        Mechanics Guide
      </h2>
      <p
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "#adb5bd",
          maxWidth: "600px",
          margin: "0 auto 2rem auto",
          lineHeight: "1.5",
        }}
      >
        Search and explore {allMechanics.length} Magic: The Gathering mechanics
        and abilities
      </p>

      {/* Category Filter Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            style={{
              padding: "0.5rem 1rem",
              background:
                selectedCategory === category.id ? "#ffc107" : "#343a40",
              color: selectedCategory === category.id ? "#000" : "#fff",
              border: "2px solid #495057",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
          >
            {category.label} ({category.count})
          </button>
        ))}
      </div>

      {/* Search/Filter Bar */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto 2rem auto",
          position: "relative",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Filter mechanics by name..."
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
          onFocus={(e) => (e.target.style.borderColor = "#ffc107")}
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

      {/* Results Summary */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "1.5rem",
          color: "#adb5bd",
          fontSize: "0.9rem",
        }}
      >
        {searchQuery || selectedCategory !== "all" ? (
          <>
            Showing {filteredMechanics.length} of {allMechanics.length}{" "}
            mechanics
            {searchQuery && <span> matching "{searchQuery}"</span>}
            {selectedCategory !== "all" && (
              <span>
                {" "}
                in {categories.find((c) => c.id === selectedCategory)?.label}
              </span>
            )}
          </>
        ) : (
          `Browse all ${allMechanics.length} mechanics below`
        )}
      </div>

      {/* Scrollable Mechanics Container */}
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "2px solid #444",
          borderRadius: "0.5rem",
          padding: "1rem",
          background: "#1a1a1a",
          marginBottom: "2rem",
        }}
      >
        {filteredMechanics.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "#6c757d",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <h3 style={{ marginBottom: "0.5rem", color: "#adb5bd" }}>
              No mechanics found
            </h3>
            <p style={{ margin: "0" }}>
              Try adjusting your search term or selecting a different category
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {filteredMechanics.map((mechanic) => {
              const isSelected = selectedMechanic?.name === mechanic;
              const mechanicKey = mechanic.toLowerCase();
              const mechanicData = mechanicsDetails[mechanicKey];

              return (
                <div
                  key={mechanic}
                  onClick={() => handleMechanicClick(mechanic)}
                  style={{
                    padding: "0.75rem",
                    background: isSelected ? "#495057" : "#343a40",
                    border: "2px solid #495057",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.target.style.backgroundColor = "#495057";
                      e.target.style.borderColor = "#6c757d";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.target.style.backgroundColor = "#343a40";
                      e.target.style.borderColor = "#495057";
                    }
                  }}
                >
                  <div
                    style={{
                      fontWeight: "500",
                      color: "#fff",
                      fontSize: "0.9rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {mechanic}
                  </div>

                  {/* Category badges */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.25rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {mechanicData?.isEvergreen && (
                      <span
                        style={{
                          padding: "0.125rem 0.375rem",
                          background: "#28a745",
                          borderRadius: "0.25rem",
                          fontSize: "0.65rem",
                          fontWeight: "bold",
                          color: "#ffffff",
                        }}
                      >
                        Evergreen
                      </span>
                    )}
                    {mechanicData?.isBeginnerFriendly && (
                      <span
                        style={{
                          padding: "0.125rem 0.375rem",
                          background: "#17a2b8",
                          borderRadius: "0.25rem",
                          fontSize: "0.65rem",
                          fontWeight: "bold",
                          color: "#ffffff",
                        }}
                      >
                        Beginner
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Mechanic Details */}
      {selectedMechanic && (
        <div className="section-content">
          <h3
            style={{
              margin: "0 0 1.5rem 0",
              color: "#ffffff",
              fontSize: "1.5rem",
              fontWeight: "600",
              textAlign: "center",
              borderBottom: "2px solid #ffc107",
              paddingBottom: "0.5rem",
            }}
          >
            {selectedMechanic.name}
          </h3>

          {(() => {
            const mechanicKey = selectedMechanic.name.toLowerCase();
            const mechanicData = mechanicsDetails[mechanicKey];

            if (mechanicData) {
              return (
                <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                  {/* Description */}
                  <p style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem" }}>
                    {removeCitations(mechanicData.description)}
                  </p>

                  {/* Category badges */}
                  {(mechanicData.category ||
                    mechanicData.isEvergreen ||
                    mechanicData.isBeginnerFriendly) && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      {mechanicData.isEvergreen && (
                        <span
                          style={{
                            padding: "0.375rem 0.75rem",
                            background: "#28a745",
                            borderRadius: "0.375rem",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            color: "#ffffff",
                            marginRight: "0.5rem",
                          }}
                        >
                          ⭐ Evergreen Keyword
                        </span>
                      )}
                      {mechanicData.isBeginnerFriendly && (
                        <span
                          style={{
                            padding: "0.375rem 0.75rem",
                            background: "#17a2b8",
                            borderRadius: "0.375rem",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            color: "#ffffff",
                            marginRight: "0.5rem",
                          }}
                        >
                          🎯 Beginner Friendly
                        </span>
                      )}
                      {mechanicData.category && !mechanicData.isEvergreen && (
                        <span
                          style={{
                            padding: "0.375rem 0.75rem",
                            background: "#6f42c1",
                            borderRadius: "0.375rem",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            color: "#ffffff",
                          }}
                        >
                          📂 {mechanicData.category}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Rules */}
                  {mechanicData.rules && mechanicData.rules.trim() !== "" && (
                    <div style={{ marginBottom: "1.5rem" }}>
                      <h4
                        style={{
                          color: "#ffc107",
                          margin: "0 0 0.75rem 0",
                          fontSize: "1.1rem",
                        }}
                      >
                        📜 Official Rules:
                      </h4>
                      <div
                        style={{
                          background: "#1a1a1a",
                          padding: "1rem",
                          borderRadius: "0.5rem",
                          border: "1px solid #444",
                          fontSize: "0.95rem",
                          fontFamily: "monospace",
                        }}
                      >
                        {removeCitations(mechanicData.rules)}
                      </div>
                    </div>
                  )}

                  {/* Wiki link */}
                  {mechanicData.wikiUrl && (
                    <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                      <a
                        href={mechanicData.wikiUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.75rem 1.5rem",
                          background: "#007bff",
                          color: "white",
                          textDecoration: "none",
                          borderRadius: "0.5rem",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          transition: "background-color 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = "#0056b3")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = "#007bff")
                        }
                      >
                        📖 Learn more on MTG Wiki →
                      </a>
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#6c757d",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                    📚
                  </div>
                  <p style={{ margin: 0, lineHeight: "1.5" }}>
                    Detailed information for{" "}
                    <strong>{selectedMechanic.name}</strong> is not available
                    yet.
                  </p>
                </div>
              );
            }
          })()}
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: repeat(
              auto-fit,
              minmax(160px, 1fr)
            ) !important;
          }

          div[style*="maxHeight"] {
            max-height: 300px !important;
          }
        }

        @media (max-width: 480px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr 1fr !important;
          }

          div[style*="maxHeight"] {
            max-height: 250px !important;
          }
        }
      `}</style>
    </div>
  );
}
