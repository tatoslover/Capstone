import { useState } from "react";
import gameModes from "../../data/gameModes.json";

export default function GameModesList() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [clickCount, setClickCount] = useState({});

  // Remove citation markers like [1], [2][3], etc. from descriptions
  const removeCitations = (text) => {
    if (!text) return text;
    return text.replace(/\[\d+\](\[\d+\])*/g, "");
  };

  // Get unique emoji for each category
  const getCategoryIcon = (categoryKey) => {
    const iconMap = {
      rotating: "🔄",
      eternal: "♾️",
      limited: "📦",
      casual: "🎲",
      custom: "🔧",
    };
    return iconMap[categoryKey] || "🎮";
  };

  const handleCategoryClick = (categoryKey) => {
    // Single click to toggle
    if (selectedCategory === categoryKey) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryKey);
    }
  };

  return (
    <div>
      {/* Category Selection Grid */}
      <div
        className="section-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.5rem",
          maxWidth: "800px",
          margin: "0 auto 2rem auto",
        }}
      >
        {Object.entries(gameModes.categories).map(([categoryKey, category]) => (
          <button
            key={categoryKey}
            onClick={() => handleCategoryClick(categoryKey)}
            className={`section-button ${selectedCategory === categoryKey ? "active" : ""}`}
          >
            <span style={{ fontSize: "1.5rem" }}>
              {getCategoryIcon(categoryKey)}
            </span>
            <span>
              {category.title.replace(
                /^🔁\s|^♾️\s|^✂️\s|^🎮\s|^🔧\s|^🎯\s|^🧪\s|^🛠️\s/,
                "",
              )}
            </span>

          </button>
        ))}
      </div>

      {/* Selected Category Content */}
      {selectedCategory && gameModes.categories[selectedCategory] && (
        <div className="section-content">
          <h3
            style={{
              marginBottom: "1rem",
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            {gameModes.categories[selectedCategory].title.replace(
              /^🔁\s|^♾️\s|^✂️\s|^🎮\s|^🔧\s|^🎯\s|^🧪\s|^🛠️\s/,
              "",
            )}
          </h3>

          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#adb5bd",
              fontSize: "1.1rem",
            }}
          >
            {gameModes.categories[selectedCategory].description}
          </p>

          <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
            <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
              {gameModes.categories[selectedCategory].formats.map(
                (format, index) => (
                  <li key={index} style={{ marginBottom: "1rem" }}>
                    <strong style={{ color: "#ffffff" }}>{format.name}</strong>
                    {" - "}
                    <span style={{ color: "#dee2e6" }}>
                      {removeCitations(format.description)}
                    </span>
                    {format.wikiUrl && (
                      <div style={{ marginTop: "0.25rem" }}>
                        <a
                          href={format.wikiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#0070f3",
                            textDecoration: "none",
                            fontSize: "0.9rem",
                          }}
                        >
                          Learn more →
                        </a>
                      </div>
                    )}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .section-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
          }
        }
        @media (max-width: 480px) {
          .section-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .section-button {
            font-size: 0.8rem !important;
            padding: 0.75rem 0.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
