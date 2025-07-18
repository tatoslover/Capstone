import { useState, useEffect } from "react";
import {
  evergreenKeywords,
  beginnerFriendly,
  getMechanicDetails,
} from "../../data/mechanics";

export default function MechanicDetails({ mechanic }) {
  if (!mechanic) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem 1rem",
          color: "#6c757d",
          background: "#f8f9fa",
          borderRadius: "0.5rem",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📖</div>
        <h3>Select a Mechanic</h3>
        <p>Search for and select any mechanic above to learn more about it.</p>
      </div>
    );
  }

  const mechanicDetails = getMechanicDetails(mechanic.name);
  const isEvergreen = evergreenKeywords.includes(mechanic.name);
  const isBeginnerFriendly = beginnerFriendly.includes(mechanic.name);

  // Get complexity colour
  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case "simple":
        return "#28a745";
      case "medium":
        return "#ffc107";
      case "complex":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  // Get category emoji
  const getCategoryEmoji = (category) => {
    const emojiMap = {
      evasion: "🦅",
      combat: "⚔️",
      protection: "🛡️",
      damage: "💥",
      lifegain: "❤️",
      timing: "⏰",
      card_advantage: "📚",
      card_selection: "🔍",
      triggered_ability: "⚡",
      restriction: "🚫",
      other: "⭐",
    };
    return emojiMap[category] || "⭐";
  };

  return (
    <div className="mechanic-details">
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          color: "white",
          padding: "2rem",
          borderRadius: "0.75rem",
          marginBottom: "2rem",
          border: "1px solid #444",
        }}
      >
        <h1
          style={{
            margin: "0 0 1rem 0",
            fontSize: "2.5rem",
            fontWeight: "700",
          }}
        >
          {mechanic.name}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          {isEvergreen && (
            <span
              style={{
                background: "rgba(40, 167, 69, 0.9)",
                padding: "0.25rem 0.75rem",
                borderRadius: "1rem",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              ♾️ Evergreen
            </span>
          )}

          {isBeginnerFriendly && (
            <span
              style={{
                background: "rgba(212, 237, 218, 0.9)",
                color: "#155724",
                padding: "0.25rem 0.75rem",
                borderRadius: "1rem",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              ✨ Beginner-Friendly
            </span>
          )}

          {mechanicDetails?.complexity && (
            <span
              style={{
                background: getComplexityColor(mechanicDetails.complexity),
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "1rem",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              {mechanicDetails.complexity.charAt(0).toUpperCase() +
                mechanicDetails.complexity.slice(1)}
            </span>
          )}

          {mechanicDetails?.category && (
            <span
              style={{
                background: "rgba(108, 117, 125, 0.9)",
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "1rem",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              {getCategoryEmoji(mechanicDetails.category)}{" "}
              {mechanicDetails.category.replace("_", " ")}
            </span>
          )}
        </div>

        {mechanicDetails?.simpleDescription && (
          <p
            style={{
              fontSize: "1.2rem",
              margin: 0,
              lineHeight: "1.6",
              opacity: 0.95,
              background: "rgba(0, 0, 0, 0.3)",
              padding: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {mechanicDetails.simpleDescription}
          </p>
        )}
      </div>

      {/* Main Description */}
      {mechanicDetails?.description && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#ffc107", marginBottom: "1rem" }}>
            📋 Description
          </h3>
          <div
            style={{
              background: "#1a1a1a",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #444",
            }}
          >
            <p
              style={{
                margin: 0,
                lineHeight: "1.6",
                fontSize: "1rem",
                color: "#e0e0e0",
              }}
            >
              {mechanicDetails.description}
            </p>
          </div>
        </div>
      )}

      {/* Rules Text */}
      {mechanicDetails?.rulesText && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#ffc107", marginBottom: "1rem" }}>
            📖 Rules Text
          </h3>
          <div
            style={{
              background: "#1a1a1a",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #444",
            }}
          >
            <p
              style={{
                margin: 0,
                lineHeight: "1.6",
                fontSize: "0.95rem",
                color: "#e0e0e0",
                fontFamily: "monospace",
              }}
            >
              {mechanicDetails.rulesText}
            </p>
          </div>
        </div>
      )}

      {/* Reminder Text */}
      {mechanicDetails?.reminderText && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#ffc107", marginBottom: "1rem" }}>
            💭 Reminder Text
          </h3>
          <div
            style={{
              background: "#1a1a1a",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #444",
            }}
          >
            <p
              style={{
                margin: 0,
                lineHeight: "1.6",
                fontSize: "0.95rem",
                color: "#e0e0e0",
                fontStyle: "italic",
              }}
            >
              ({mechanicDetails.reminderText})
            </p>
          </div>
        </div>
      )}

      {/* Example Cards */}
      {mechanicDetails?.exampleCards &&
        mechanicDetails.exampleCards.length > 0 && (
          <div className="card" style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "#ffc107", marginBottom: "1rem" }}>
              🃏 Example Cards
            </h3>
            <div
              style={{
                background: "#1a1a1a",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #444",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}
              >
                {mechanicDetails.exampleCards
                  .filter((card) => card && card.trim().length > 0)
                  .slice(0, 5)
                  .map((card, index) => (
                    <span
                      key={index}
                      style={{
                        background: "#0070f3",
                        color: "white",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      {card}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )}

      {/* Additional Info Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {/* Type and Category */}
        <div className="card">
          <h4 style={{ color: "#ffc107", marginBottom: "0.75rem" }}>
            🏷️ Classification
          </h4>
          <div style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>
            {mechanicDetails?.type && (
              <p style={{ margin: "0 0 0.5rem 0" }}>
                <strong>Type:</strong>{" "}
                {mechanicDetails.type
                  .replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
            )}
            {mechanicDetails?.firstAppeared &&
              mechanicDetails.firstAppeared !== "Unknown" && (
                <p style={{ margin: "0 0 0.5rem 0" }}>
                  <strong>First appeared:</strong>{" "}
                  {mechanicDetails.firstAppeared}
                </p>
              )}
            {mechanicDetails?.category && (
              <p style={{ margin: 0 }}>
                <strong>Category:</strong>{" "}
                {mechanicDetails.category.replace("_", " ")}
              </p>
            )}
          </div>
        </div>

        {/* Learn More */}
        <div className="card">
          <h4 style={{ color: "#ffc107", marginBottom: "0.75rem" }}>
            🔗 Learn More
          </h4>
          <div style={{ fontSize: "0.9rem" }}>
            {mechanicDetails?.wikiUrl && (
              <a
                href={mechanicDetails.wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0070f3",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  marginBottom: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.target.style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = "none";
                }}
              >
                MTG Wiki ↗
              </a>
            )}
            <p style={{ margin: 0, color: "#ccc", fontSize: "0.85rem" }}>
              Visit the MTG Wiki for comprehensive rules details and more
              examples.
            </p>
          </div>
        </div>
      </div>

      {/* Fallback for basic mechanics */}
      {!mechanicDetails?.description && (
        <div className="card">
          <h3 style={{ color: "#ffc107", marginBottom: "1rem" }}>
            📋 About {mechanic.name}
          </h3>
          <div
            style={{
              background: "#1a1a1a",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #444",
            }}
          >
            <p
              style={{
                margin: 0,
                lineHeight: "1.6",
                fontSize: "1rem",
                color: "#e0e0e0",
              }}
            >
              {mechanic.name} is a Magic: The Gathering mechanic. Detailed
              information is being added to our database. Check back soon or
              visit the MTG Wiki for more information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
