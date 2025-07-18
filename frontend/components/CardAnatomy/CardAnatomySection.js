import { useState } from "react";
import AnnotatedCard from "./AnnotatedCard";

const CardAnatomySection = ({ cardAnatomyData }) => {
  const [selectedPart, setSelectedPart] = useState(null);

  const handlePartSelect = (partId) => {
    setSelectedPart(partId);
  };

  const renderDetailedInfo = (partData) => {
    if (!partData) return null;

    return (
      <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
        {/* Location */}
        <div style={{ marginBottom: "1rem" }}>
          <strong style={{ color: "#ffc107" }}>📍 Location: </strong>
          {partData.location}
        </div>

        {/* Description */}
        <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
          {partData.description}
        </p>

        {/* Components (if available) */}
        {partData.components && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>🔧 Components:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              {partData.components.map((component, index) => (
                <li key={index} style={{ marginBottom: "0.25rem" }}>
                  {component}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Examples (if available) */}
        {partData.examples && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>💡 Examples:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              {partData.examples.map((example, index) => (
                <li
                  key={index}
                  style={{ marginBottom: "0.25rem", fontFamily: "monospace" }}
                >
                  {example}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Purpose (if available) */}
        {partData.purpose && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>🎯 Purpose: </strong>
            {partData.purpose}
          </div>
        )}

        {/* Importance (if available) */}
        {partData.importance && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>⭐ Importance:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              {partData.importance.map((point, index) => (
                <li key={index} style={{ marginBottom: "0.25rem" }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Explanation (if available) */}
        {partData.explanation && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>📚 How it works:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              {partData.explanation.map((point, index) => (
                <li key={index} style={{ marginBottom: "0.25rem" }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Strategic Notes (if available) */}
        {partData.strategicNotes && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>⚔️ Strategic Notes:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              {partData.strategicNotes.map((note, index) => (
                <li key={index} style={{ marginBottom: "0.25rem" }}>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Special Cases (if available) */}
        {partData.specialCases && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>⚠️ Special Cases:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              {partData.specialCases.map((specialCase, index) => (
                <li key={index} style={{ marginBottom: "0.25rem" }}>
                  {specialCase}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reading Tips */}
        {partData.readingTips && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>💡 Reading Tips:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              {partData.readingTips.map((tip, index) => (
                <li key={index} style={{ marginBottom: "0.25rem" }}>
                  <em style={{ color: "#adb5bd" }}>{tip}</em>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Usefulness (if available) */}
        {partData.usefulness && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>🔍 Usefulness:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              {partData.usefulness.map((use, index) => (
                <li key={index} style={{ marginBottom: "0.25rem" }}>
                  {use}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rarity Colors (if available) */}
        {partData.rarityColours && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>🎨 Rarity Colors:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              {partData.rarityColours.map((color, index) => (
                <li key={index} style={{ marginBottom: "0.25rem" }}>
                  {color}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Format (if available - for P/T) */}
        {partData.format && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>📝 Format: </strong>
            <code
              style={{
                background: "#1a1a1a",
                padding: "0.25rem 0.5rem",
                borderRadius: "3px",
                fontFamily: "monospace",
              }}
            >
              {partData.format}
            </code>
          </div>
        )}

        {/* Loyalty Abilities (if available) */}
        {partData.loyaltyAbilities && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>🔮 Loyalty Abilities:</strong>
            <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
              {partData.loyaltyAbilities.map((ability, index) => (
                <li key={index} style={{ marginBottom: "0.25rem" }}>
                  {ability}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Artist Credit note (if available) */}
        {partData.artistCredit && (
          <div style={{ marginBottom: "1rem" }}>
            <strong style={{ color: "#ffc107" }}>🎨 Artist Credit: </strong>
            <em style={{ color: "#adb5bd" }}>{partData.artistCredit}</em>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card" style={{ marginBottom: "2rem" }}>
      {/* Header */}
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        {cardAnatomyData.overview.title}
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
        {cardAnatomyData.overview.description}
      </p>

      {/* Quick Navigation Section Buttons */}
      <div
        className="section-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "0.5rem",
          maxWidth: "800px",
          margin: "0 auto 2rem auto",
        }}
      >
        {Object.entries(cardAnatomyData.cardParts).map(
          ([partKey, partData]) => {
            const getEmoji = (key) => {
              switch (key) {
                case "cardName":
                  return "📝";
                case "manaCost":
                  return "💎";
                case "artBox":
                  return "🎨";
                case "typeLine":
                  return "🏷️";
                case "setSymbol":
                  return "⚡";
                case "rulesText":
                  return "📋";
                case "powerToughness":
                  return "💪";
                case "loyaltyCounters":
                  return "🔮";
                default:
                  return "📄";
              }
            };

            return (
              <button
                key={partKey}
                onClick={() =>
                  handlePartSelect(selectedPart === partKey ? null : partKey)
                }
                className={`section-button ${selectedPart === partKey ? "active" : ""}`}
              >
                <span style={{ fontSize: "1.2rem" }}>{getEmoji(partKey)}</span>
                <span>{partData.name}</span>
              </button>
            );
          },
        )}
      </div>

      {/* Card Example */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <AnnotatedCard
          onPartSelect={handlePartSelect}
          selectedPart={selectedPart}
          cardData={cardAnatomyData}
        />
      </div>

      {/* Selected Part Details */}
      {selectedPart && (
        <div className="section-content">
          <h3
            style={{
              marginBottom: "1.5rem",
              color: "#ffffff",
              textAlign: "center",
              borderBottom: "2px solid #ffc107",
              paddingBottom: "0.5rem",
            }}
          >
            {cardAnatomyData.cardParts[selectedPart].name}
          </h3>
          {renderDetailedInfo(cardAnatomyData.cardParts[selectedPart])}
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .section-grid {
            grid-template-columns: repeat(
              auto-fit,
              minmax(100px, 1fr)
            ) !important;
            gap: 0.75rem !important;
          }
        }

        @media (max-width: 480px) {
          .section-grid {
            grid-template-columns: repeat(
              auto-fit,
              minmax(110px, 1fr)
            ) !important;
            gap: 0.5rem !important;
          }

          .section-button {
            font-size: 0.8rem !important;
            padding: 0.75rem 0.5rem !important;
          }

          .section-button span:first-child {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CardAnatomySection;
