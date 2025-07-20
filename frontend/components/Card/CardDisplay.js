import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function CardDisplay({
  card,
  showFavouriteButton = true,
  currentUser,
  onFavouriteToggle,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { theme } = useTheme();

  if (!card) {
    return null;
  }

  const handleFavouriteClick = () => {
    if (onFavouriteToggle && currentUser) {
      onFavouriteToggle(card);
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
    <div
      className="mtg-card"
      onClick={() => setShowModal(true)}
      style={{ cursor: "pointer" }}
    >
      {/* Favourite Button */}
      {showFavouriteButton && currentUser && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleFavouriteClick();
          }}
          className="favourite-btn"
          title="Add to favourites"
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
                <p className="mtg-card-placeholder-mana">
                  {formatManaSymbols(card.mana_cost)}
                </p>
              )}
              <p className="mtg-card-placeholder-hint">Placeholder</p>
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
              onClick={(e) => e.stopPropagation()}
            >
              View on Scryfall
            </a>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="card-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="card-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="card-modal-header">
              <h2 className="card-modal-title">{card.name}</h2>
              <button
                className="card-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="card-modal-body">
              {/* Card Image in Modal */}
              <div className="card-modal-image-container">
                {showPlaceholder ? (
                  <div className={`mtg-card-placeholder ${colourClass} large`}>
                    <div className="mtg-card-placeholder-content">
                      <h3 className="mtg-card-placeholder-name">{card.name}</h3>
                      {card.type_line && (
                        <p className="mtg-card-placeholder-type">
                          {card.type_line}
                        </p>
                      )}
                      {card.mana_cost && (
                        <p className="mtg-card-placeholder-mana">
                          {formatManaSymbols(card.mana_cost)}
                        </p>
                      )}
                      <p className="mtg-card-placeholder-hint">Placeholder</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={card.image_uris?.normal}
                    alt={card.name}
                    className="card-modal-image"
                  />
                )}
              </div>

              {/* Card Details in Modal */}
              <div className="card-modal-info">
                <div className="card-info-section">
                  {card.mana_cost && (
                    <p className="mana-cost-display">
                      Mana Cost: {formatManaSymbols(card.mana_cost)}
                    </p>
                  )}
                  <p className="type-line-display">Type: {card.type_line}</p>
                  {card.oracle_text && (
                    <div className="oracle-text">
                      <strong>Rules Text:</strong>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: highlightKeywords(card.oracle_text),
                        }}
                      />
                    </div>
                  )}
                  {getPowerToughness() && (
                    <p className="power-toughness-display">
                      Power/Toughness: {getPowerToughness()}
                    </p>
                  )}
                  {card.rarity && (
                    <p className="rarity-display">
                      Rarity:{" "}
                      <span className={`rarity-${card.rarity?.toLowerCase()}`}>
                        {card.rarity}
                      </span>
                    </p>
                  )}
                  {card.set_name && (
                    <p className="set-display">Set: {card.set_name}</p>
                  )}
                  {card.artist && (
                    <p className="artist-display">Artist: {card.artist}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="card-modal-footer">
              {showFavouriteButton && currentUser && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavouriteClick();
                  }}
                  className="favourite-btn-modal"
                  title="Add to favourites"
                >
                  ⭐ Add to Favourites
                </button>
              )}
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
      )}
    </div>
  );
}
