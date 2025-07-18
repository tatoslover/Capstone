import { useState, useEffect } from "react";

const AnnotatedCard = ({ onPartSelect, selectedPart, cardData }) => {
  const [hoveredPart, setHoveredPart] = useState(null);
  const [artworkUrl, setArtworkUrl] = useState(null);
  const [artworkLoading, setArtworkLoading] = useState(true);

  // Define hotspot areas for each card part
  const hotspots = [
    {
      id: "cardName",
      top: "6%",
      left: "8%",
      width: "60%",
      height: "8%",
      label: "Card Name",
    },
    {
      id: "manaCost",
      top: "6%",
      right: "8%",
      width: "25%",
      height: "8%",
      label: "Mana Cost",
    },
    {
      id: "artBox",
      top: "16%",
      left: "8%",
      width: "84%",
      height: "32%",
      label: "Artwork",
    },
    {
      id: "typeLine",
      top: "50%",
      left: "8%",
      width: "70%",
      height: "6%",
      label: "Type Line",
    },
    {
      id: "setSymbol",
      top: "50%",
      right: "8%",
      width: "15%",
      height: "6%",
      label: "Set Symbol",
    },
    {
      id: "rulesText",
      top: "58%",
      left: "8%",
      width: "84%",
      height: "28%",
      label: "Rules Text",
    },
    {
      id: "powerToughness",
      bottom: "6%",
      right: "8%",
      width: "20%",
      height: "8%",
      label: "Power/Toughness",
    },
  ];

  const cardStyle = {
    position: "relative",
    width: "320px",
    height: "448px",
    background: "linear-gradient(135deg, #fdf2f2 0%, #fce8e8 100%)",
    borderRadius: "16px",
    margin: "0 auto",
    border: "3px solid #dc2626",
    boxShadow: "0 8px 24px rgba(220, 38, 38, 0.3)",
    overflow: "hidden",
    cursor: "default",
    transition: "all 0.3s ease",
    maxWidth: "90vw",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
  };

  // Fetch Lightning Bolt artwork from Scryfall API
  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setArtworkLoading(true);
        const response = await fetch(
          "https://api.scryfall.com/cards/named?exact=Lightning+Bolt",
        );
        const cardData = await response.json();
        if (cardData.image_uris) {
          // Use art_crop for better fitting in the art box
          setArtworkUrl(
            cardData.image_uris.art_crop || cardData.image_uris.normal,
          );
        }
      } catch (error) {
        console.log("Failed to fetch Lightning Bolt artwork:", error);
      } finally {
        setArtworkLoading(false);
      }
    };

    fetchArtwork();
  }, []);

  const getHotspotStyle = (hotspot) => {
    const isSelected = selectedPart === hotspot.id;
    const isHovered = hoveredPart === hotspot.id;

    return {
      position: "absolute",
      top: hotspot.top,
      bottom: hotspot.bottom,
      left: hotspot.left,
      right: hotspot.right,
      width: hotspot.width,
      height: hotspot.height,
      cursor: "pointer",
      border: isSelected
        ? "3px solid #ffc107"
        : isHovered
          ? "2px solid rgba(255, 193, 7, 0.7)"
          : "2px solid transparent",
      borderRadius: "6px",
      background: isSelected
        ? "rgba(255, 193, 7, 0.2)"
        : isHovered
          ? "rgba(255, 193, 7, 0.1)"
          : "transparent",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.75rem",
      fontWeight: "bold",
      color: isSelected || isHovered ? "#000" : "transparent",
      textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)",
      minHeight: "44px",
      minWidth: "44px",
      touchAction: "manipulation",
      WebkitTapHighlightColor: "transparent",
    };
  };

  const handleHotspotClick = (partId) => {
    if (onPartSelect) {
      onPartSelect(selectedPart === partId ? null : partId);
    }
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
      {/* Card Container */}
      <div style={cardStyle}>
        {/* Card Content Mockup */}

        {/* Card Name Area */}
        <div
          style={{
            position: "absolute",
            top: "6%",
            left: "8%",
            width: "60%",
            height: "8%",
            background: "rgba(220, 38, 38, 0.08)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "8px",
            fontSize: "0.9rem",
            fontWeight: "bold",
            color: "#7f1d1d",
            border: "1px solid rgba(220, 38, 38, 0.2)",
          }}
        >
          Lightning Bolt
        </div>

        {/* Mana Cost Area */}
        <div
          style={{
            position: "absolute",
            top: "6%",
            right: "8%",
            width: "25%",
            height: "8%",
            background: "radial-gradient(circle, #dc2626, #991b1b)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.1rem",
            fontWeight: "bold",
            color: "#ffffff",
            border: "2px solid #7f1d1d",
            boxShadow: "0 2px 4px rgba(220, 38, 38, 0.4)",
          }}
        >
          R
        </div>

        {/* Art Box */}
        <div
          style={{
            position: "absolute",
            top: "16%",
            left: "8%",
            width: "84%",
            height: "32%",
            borderRadius: "6px",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            background: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {artworkUrl && !artworkLoading ? (
            <img
              src={artworkUrl}
              alt="Lightning Bolt artwork by Christopher Moeller"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                borderRadius: "6px",
                transition: "opacity 0.3s ease",
              }}
              onError={() => {
                console.log("Failed to load Lightning Bolt artwork");
                setArtworkUrl(null);
                setArtworkLoading(false);
              }}
              onLoad={() => setArtworkLoading(false)}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                color: "#fff",
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                background: artworkLoading
                  ? "linear-gradient(45deg, #666, #999)"
                  : "linear-gradient(45deg, #ff6b6b, #ffd93d)",
                borderRadius: "6px",
              }}
            >
              {artworkLoading ? "⏳ Loading artwork..." : "⚡ Artwork ⚡"}
            </div>
          )}
        </div>

        {/* Type Line */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "8%",
            width: "70%",
            height: "6%",
            background: "rgba(220, 38, 38, 0.08)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "8px",
            fontSize: "0.8rem",
            fontStyle: "italic",
            color: "#7f1d1d",
            border: "1px solid rgba(220, 38, 38, 0.2)",
          }}
        >
          Instant
        </div>

        {/* Set Symbol */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "8%",
            width: "15%",
            height: "6%",
            background: "radial-gradient(circle, #dc2626, #991b1b)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.7rem",
            fontWeight: "bold",
            color: "#ffffff",
            border: "2px solid #7f1d1d",
            boxShadow: "0 1px 3px rgba(220, 38, 38, 0.4)",
          }}
        >
          ⚡
        </div>

        {/* Rules Text Box */}
        <div
          style={{
            position: "absolute",
            top: "58%",
            left: "8%",
            width: "84%",
            height: "28%",
            background: "rgba(254, 242, 242, 0.95)",
            borderRadius: "6px",
            padding: "8px",
            fontSize: "0.7rem",
            lineHeight: "1.3",
            color: "#7f1d1d",
            border: "1px solid rgba(220, 38, 38, 0.2)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div style={{ marginBottom: "4px" }}>
            Lightning Bolt deals 3 damage to any target.
          </div>
          <div
            style={{
              fontStyle: "italic",
              color: "#991b1b",
              fontSize: "0.65rem",
              marginTop: "auto",
            }}
          >
            "The sparkmage shrieked, calling on the rage of the storms..."
          </div>
        </div>

        {/* Power/Toughness (not applicable for instants, but shown for completeness) */}
        <div
          style={{
            position: "absolute",
            bottom: "6%",
            right: "8%",
            width: "20%",
            height: "8%",
            background: "rgba(220, 38, 38, 0.08)",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.7rem",
            color: "#991b1b",
            border: "1px dashed rgba(220, 38, 38, 0.3)",
          }}
        >
          N/A
        </div>

        {/* Interactive Hotspots */}
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            style={getHotspotStyle(hotspot)}
            onClick={() => handleHotspotClick(hotspot.id)}
            onMouseEnter={() => setHoveredPart(hotspot.id)}
            onMouseLeave={() => setHoveredPart(null)}
            onTouchStart={() => setHoveredPart(hotspot.id)}
            onTouchEnd={() => setHoveredPart(null)}
            title={`Click to learn about: ${hotspot.label}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleHotspotClick(hotspot.id);
              }
            }}
          >
            {(selectedPart === hotspot.id || hoveredPart === hotspot.id) && (
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  fontWeight: "600",
                  pointerEvents: "none",
                }}
              >
                {hotspot.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="width: 320px"] {
            width: 280px !important;
            height: 392px !important;
          }
        }

        @media (max-width: 480px) {
          div[style*="width: 320px"] {
            width: 260px !important;
            height: 364px !important;
          }
        }

        /* Ensure touch targets are accessible */
        div[role="button"] {
          -webkit-tap-highlight-color: rgba(255, 193, 7, 0.3);
          tap-highlight-color: rgba(255, 193, 7, 0.3);
        }

        /* Improve touch interaction on mobile */
        @media (hover: none) and (pointer: coarse) {
          div[role="button"]:active {
            background: rgba(255, 193, 7, 0.3) !important;
            border-color: #ffc107 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnnotatedCard;
