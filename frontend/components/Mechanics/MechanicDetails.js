import { useState, useEffect } from "react";
import {
  evergreenKeywords,
  beginnerFriendly,
  getMechanicDetails,
  getMechanicWikiUrl,
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
  const wikiUrl = getMechanicWikiUrl(mechanic.name);
  const isEvergreen = mechanicDetails?.isEvergreen || evergreenKeywords.includes(mechanic.name);
  const isBeginnerFriendly = mechanicDetails?.isEvergreen || beginnerFriendly.includes(mechanic.name);

  // Get category colour
  const getCategoryColor = (category) => {
    switch (category) {
      case "evasion":
        return "#0d6efd";
      case "combat":
        return "#dc3545";
      case "protection":
        return "#198754";
      case "utility":
        return "#ffc107";
      case "timing":
        return "#6f42c1";
      case "cost_reduction":
        return "#20c997";
      case "triggered":
        return "#fd7e14";
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

          {mechanicDetails?.category && (
            <span
              style={{
                background: getCategoryColor(mechanicDetails.category),
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "1rem",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              {getCategoryEmoji(mechanicDetails.category)}{" "}
              {mechanicDetails.category.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          )}


        </div>

        {mechanicDetails?.description && (
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
            {mechanicDetails.description.length > 200
              ? mechanicDetails.description.substring(0, 200) + "..."
              : mechanicDetails.description}
          </p>
        )}
      </div>

      {/* Full Description */}
      {mechanicDetails?.description && mechanicDetails.description.length > 200 && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#ffc107", marginBottom: "1rem" }}>
            📋 Full Description
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

      {/* Wiki Link Section */}
      {wikiUrl && (
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#ffc107", marginBottom: "1rem" }}>
            🔗 Learn More
          </h3>
          <div
            style={{
              background: "#1a1a1a",
              padding: "1.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #444",
            }}
          >
            <a
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#0070f3",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "1.1rem",
                fontWeight: "500",
                padding: "0.75rem 1rem",
                background: "rgba(0, 112, 243, 0.1)",
                borderRadius: "0.5rem",
                border: "1px solid rgba(0, 112, 243, 0.3)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(0, 112, 243, 0.2)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(0, 112, 243, 0.1)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              📖 View on MTG Wiki ↗
            </a>
            <p style={{ margin: "0.75rem 0 0 0", color: "#ccc", fontSize: "0.9rem" }}>
              Visit the MTG Wiki for comprehensive rules details, card examples, and rulings.
            </p>
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
        {/* Classification */}
        <div className="card">
          <h4 style={{ color: "#ffc107", marginBottom: "0.75rem" }}>
            🏷️ Classification
          </h4>
          <div style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>
            {mechanicDetails?.category && (
              <p style={{ margin: "0 0 0.5rem 0" }}>
                <strong>Category:</strong>{" "}
                <span style={{
                  color: getCategoryColor(mechanicDetails.category),
                  fontWeight: "500"
                }}>
                  {getCategoryEmoji(mechanicDetails.category)}{" "}
                  {mechanicDetails.category.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </p>
            )}
            <p style={{ margin: "0 0 0.5rem 0" }}>
              <strong>Type:</strong>{" "}
              {isEvergreen ? "Evergreen Keyword" : "Non-Evergreen Mechanic"}
            </p>
            {isBeginnerFriendly && (
              <p style={{ margin: 0, color: "#28a745" }}>
                <strong>✨ Beginner-Friendly:</strong> Great for new players
              </p>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="card">
          <h4 style={{ color: "#ffc107", marginBottom: "0.75rem" }}>
            📊 Quick Facts
          </h4>
          <div style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>
            <p style={{ margin: "0 0 0.5rem 0" }}>
              <strong>Status:</strong>{" "}
              <span style={{
                color: isEvergreen ? "#28a745" : "#6c757d",
                fontWeight: "500"
              }}>
                {isEvergreen ? "♾️ Always available" : "📦 Set-specific"}
              </span>
            </p>
            <p style={{ margin: 0 }}>
              <strong>Complexity:</strong>{" "}
              <span style={{ color: isBeginnerFriendly ? "#28a745" : "#ffc107" }}>
                {isBeginnerFriendly ? "🟢 Simple" : "🟡 Intermediate"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Fallback for basic mechanics */}
      {!mechanicDetails && (
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
                margin: "0 0 1rem 0",
                lineHeight: "1.6",
                fontSize: "1rem",
                color: "#e0e0e0",
              }}
            >
              {mechanic.name} is a Magic: The Gathering mechanic.
            </p>
            {wikiUrl && (
              <a
                href={wikiUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#0070f3",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                📖 Learn more on MTG Wiki ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
