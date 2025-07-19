import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function CardDisplay({
  card,
  showFavoriteButton = true,
  currentUser,
  onFavoriteToggle,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { theme } = useTheme();

  if (!card) {
    return null;
  }

  const handleFavoriteClick = () => {
    if (onFavoriteToggle && currentUser) {
      onFavoriteToggle(card);
    }
  };

  // Helper function to determine CSS colour class from colour identity
  const getCardColourClass = (colours) => {
    if (!colours || colours.length === 0) {
      return "mtg-colour-colourless";
    } else if (colours.length === 1) {
      const classMap = {
        W: "mtg-colour-white",
        U: "mtg-colour-blue",
        B: "mtg-colour-black",
        R: "mtg-colour-red",
        G: "mtg-colour-green",
      };
      return classMap[colours[0]] || "mtg-colour-colourless";
    } else {
      return "mtg-colour-multicolour";
    }
  };

  // Get colours from the card data
  const cardColours = card.color_identity || card.colours || [];
  const colourClass = getCardColourClass(cardColours);

  // Check if we should show placeholder (no image available or error)
  const showPlaceholder = !card.image_uris?.normal || imageError;

  // Parse mana symbols for better display
  const formatManaSymbols = (manaCost) => {
    if (!manaCost) return "";
    // Simple formatting - could be enhanced with actual mana symbol images
    return manaCost
      .replace(/{([^}]+)}/g, "($1)")
      .replace(/\(/g, " (")
      .trim();
  };

  // Extract creature power/toughness
  const getPowerToughness = () => {
    if (card.power && card.toughness) {
      return `${card.power}/${card.toughness}`;
    }
    return null;
  };

  // Get card rarity color
  const getRarityColor = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case "common":
        return "var(--theme-text)";
      case "uncommon":
        return "#c0c0c0";
      case "rare":
        return "var(--theme-warning)";
      case "mythic":
        return "var(--theme-highlight)";
      default:
        return "var(--theme-textLight)";
    }
  };

  // Highlight ability keywords in oracle text
  const highlightKeywords = (text) => {
    if (!text) return "";

    const keywords = [
      "Flying",
      "Trample",
      "First strike",
      "Double strike",
      "Deathtouch",
      "Lifelink",
      "Vigilance",
      "Haste",
      "Reach",
      "Hexproof",
      "Indestructible",
      "Menace",
      "Prowess",
      "Scry",
      "Flash",
      "Defender",
    ];

    let highlightedText = text;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span class="keyword-highlight">${keyword}</span>`,
      );
    });

    return highlightedText;
  };

  return (
    <div className="mtg-card-container">
      {/* Favorite Button */}
      {showFavoriteButton && currentUser && (
        <button
          onClick={handleFavoriteClick}
          className="favorite-btn"
          title="Add to favorites"
        >
          ⭐
        </button>
      )}

      {/* Card Image */}
      <div className="card-image-container">
        {showPlaceholder ? (
          <div className={`mtg-card-placeholder ${colourClass}`}>
            <div className="mtg-card-placeholder-content">
              <h3 className="mtg-card-placeholder-name">{card.name}</h3>
              {card.type_line && (
                <p className="mtg-card-placeholder-type">{card.type_line}</p>
              )}
              {card.mana_cost && (
                <p className="mtg-card-placeholder-mana">{formatManaSymbols(card.mana_cost)}</p>
              )}
              <p className="mtg-card-placeholder-hint">Offline demo mode</p>
            </div>
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div className="card-image-placeholder">Loading image...</div>
            )}
            <img
              src={card.image_uris.normal}
              alt={card.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`card-image ${imageLoaded ? "loaded" : ""}`}
            />
          </>
        )}
      </div>

      {/* Card Details */}
      <div className="mtg-card-details">
        {/* Card Name and Mana Cost */}
        <div className="card-header-row">
          <h3 className="mtg-card-title">{card.name}</h3>
          {card.mana_cost && (
            <div className="mtg-mana-cost-header">
              {formatManaSymbols(card.mana_cost)}
            </div>
          )}
        </div>

        {/* Type Line */}
        <div className="mtg-card-type-line">{card.type_line}</div>

        {/* Rarity */}
        {card.rarity && (
          <div
            className={`rarity-badge rarity-${card.rarity?.toLowerCase()} mb-3`}
          >
            {card.rarity}
          </div>
        )}

        {/* Oracle Text */}
        {card.oracle_text && (
          <div className="mtg-card-oracle-text">
            <div
              dangerouslySetInnerHTML={{
                __html: highlightKeywords(card.oracle_text),
              }}
            />
          </div>
        )}

        {/* Power/Toughness */}
        {getPowerToughness() && (
          <div className="power-toughness">{getPowerToughness()}</div>
        )}

        {/* Set Information */}
        <div className="card-footer-row">
          <div>
            <strong>{card.set_name || card.set}</strong>
            {card.collector_number && ` #${card.collector_number}`}
          </div>
          {card.artist && (
            <div style={{ fontStyle: "italic" }}>Art: {card.artist}</div>
          )}
        </div>

        {/* Beginner Help */}
        {card.oracle_text &&
          card.oracle_text.match(
            /(Flying|Trample|First strike|Deathtouch|Lifelink|Vigilance|Haste|Hexproof)/i,
          ) && (
            <div className="info-box">
              <div className="info-box-header">💡 Beginner Tip</div>
              <div className="info-box-content">
                This card has keyword abilities highlighted above. Check the
                homepage to learn what they mean!
              </div>
            </div>
          )}

        {/* External Links */}
        <div className="d-flex gap-2 mt-3" style={{ flexWrap: "wrap" }}>
          {card.scryfall_uri && (
            <a
              href={card.scryfall_uri}
              target="_blank"
              rel="noopener noreferrer"
              className="link-btn"
            >
              View on Scryfall
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
