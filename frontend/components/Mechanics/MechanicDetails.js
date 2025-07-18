import { useState, useEffect } from "react";
import { evergreenKeywords, beginnerFriendly } from "../../data/mechanics";

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

  const isEvergreen = evergreenKeywords.includes(mechanic.name);
  const isBeginnerFriendly = beginnerFriendly.includes(mechanic.name);

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
              ♾️ Evergreen Keyword
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
        </div>

        <p
          style={{
            fontSize: "1.1rem",
            margin: 0,
            lineHeight: "1.6",
            opacity: 0.95,
          }}
        >
          Learn about {mechanic.name} - a Magic: The Gathering mechanic.
        </p>
      </div>

      {/* Description */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#495057", marginBottom: "1rem" }}>
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
            <strong style={{ color: "#ffc107" }}>TBC</strong> - Detailed
            description and rules explanation for {mechanic.name} will be added
            here.
          </p>
        </div>
      </div>

      {/* Quick Info */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        <div className="card">
          <h4 style={{ color: "#495057", marginBottom: "0.75rem" }}>
            💡 Quick Tips
          </h4>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc" }}>
            TBC - Beginner tips and strategy advice for {mechanic.name}
          </p>
        </div>

        <div className="card">
          <h4 style={{ color: "#495057", marginBottom: "0.75rem" }}>
            🔍 Find Cards
          </h4>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#ccc" }}>
            TBC - Information about finding cards with {mechanic.name} and
            example cards
          </p>
        </div>
      </div>
    </div>
  );
}
