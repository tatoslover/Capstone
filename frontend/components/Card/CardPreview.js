import { useState } from "react";

export default function CardPreview({
  card,
  onClick,
  currentUser,
  onFavoriteToggle,
  showFavoriteButton = true,
}) {
  const [imageError, setImageError] = useState(false);

  if (!card) {
    return null;
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavoriteToggle && currentUser) {
      onFavoriteToggle(card);
    }
  };

  // Format mana symbols for compact display
  const formatManaSymbols = (manaCost) => {
    if (!manaCost) return "";
    return manaCost
      .replace(/{([^}]+)}/g, "($1)")
      .replace(/\(/g, " (")
      .trim();
  };

  // Get card rarity color
  const getRarityColor = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case "common":
        return "#1a1a1a";
      case "uncommon":
        return "#c0c0c0";
      case "rare":
        return "#ffd700";
      case "mythic":
        return "#ff8c00";
      default:
        return "#6c757d";
    }
  };

  // Extract key abilities for preview
  const extractKeywords = (text) => {
    if (!text) return [];

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
      "Flash",
      "Defender",
    ];

    const found = [];
    keywords.forEach((keyword) => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        found.push(keyword);
      }
    });

    return found.slice(0, 3); // Limit to 3 for compact display
  };

  const cardKeywords = extractKeywords(card.oracle_text);

  return (
    <div
      onClick={handleCardClick}
      className={`card-preview ${onClick ? "" : ""}`}
      style={{ cursor: onClick ? "pointer" : "default", gap: "1rem" }}
    >
      {/* Favorite Button */}
      {showFavoriteButton && currentUser && (
        <button
          onClick={handleFavoriteClick}
          className="favorite-btn-preview"
          title="Add to favorites"
        >
          ⭐
        </button>
      )}

      {/* Card Image */}
      <div className="card-preview-image-container">
        {card.image_uris?.small && !imageError ? (
          <img
            src={card.image_uris.small}
            alt={card.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="card-preview-image-placeholder">🃏</div>
        )}
      </div>

      {/* Card Info */}
      <div className="card-preview-content">
        {/* Name and Mana Cost */}
        <div className="card-preview-header">
          <h4 className="card-preview-title">{card.name}</h4>
          {card.mana_cost && (
            <div className="mana-cost-small">
              {formatManaSymbols(card.mana_cost)}
            </div>
          )}
        </div>

        {/* Type Line */}
        <div className="card-preview-type">{card.type_line}</div>

        {/* Rarity and Power/Toughness */}
        <div className="card-preview-stats">
          {card.rarity && (
            <span
              className={`card-preview-rarity ${card.rarity?.toLowerCase()}`}
            >
              {card.rarity}
            </span>
          )}
          {card.power && card.toughness && (
            <span className="card-preview-power">
              {card.power}/{card.toughness}
            </span>
          )}
        </div>

        {/* Keywords */}
        {cardKeywords.length > 0 && (
          <div className="keywords-container">
            {cardKeywords.map((keyword, index) => (
              <span key={index} className="keyword-badge">
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Truncated Oracle Text */}
        {card.oracle_text && (
          <div className="card-preview-oracle">{card.oracle_text}</div>
        )}

        {/* Set Info */}
        <div className="card-preview-set">
          <span>
            {card.set_name || card.set}
            {card.collector_number && ` #${card.collector_number}`}
          </span>
          {onClick && (
            <span className="card-preview-click-hint">Click for details →</span>
          )}
        </div>
      </div>
    </div>
  );
}
