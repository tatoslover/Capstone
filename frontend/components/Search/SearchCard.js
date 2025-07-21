import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// Global state to ensure only one modal is open at a time
let globalActiveModal = null;
const modalListeners = [];

const setGlobalActiveModal = (modal) => {
  if (globalActiveModal && globalActiveModal !== modal) {
    globalActiveModal.close();
  }
  globalActiveModal = modal;
  modalListeners.forEach((listener) => listener(modal));
};

export default function SearchCard({
  card,
  currentUser,
  onFavouriteToggle,
  onRemoveFavourite,
  showFavouriteButton = true,
  isFavourite = false,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Modal management
  useEffect(() => {
    const modalManager = {
      close: () => setShowModal(false),
    };

    const listener = (activeModal) => {
      if (activeModal !== modalManager && showModal) {
        setShowModal(false);
      }
    };

    modalListeners.push(listener);

    if (showModal) {
      setGlobalActiveModal(modalManager);
    }

    return () => {
      const index = modalListeners.indexOf(listener);
      if (index > -1) modalListeners.splice(index, 1);
      if (globalActiveModal === modalManager) {
        globalActiveModal = null;
      }
    };
  }, [showModal]);

  if (!card) {
    return null;
  }

  const handleFavouriteClick = () => {
    if (isFavourite && onRemoveFavourite && currentUser) {
      onRemoveFavourite(card);
    } else if (onFavouriteToggle && currentUser) {
      onFavouriteToggle(card);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    if (globalActiveModal) {
      globalActiveModal = null;
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

    // Replace mana symbols with styled spans
    let formatted = manaCost;

    // Generic mana costs {1}, {2}, etc.
    formatted = formatted.replace(
      /\{(\d+)\}/g,
      '<span class="mana-symbol mana-generic">$1</span>',
    );

    // Colored mana symbols
    formatted = formatted.replace(
      /\{W\}/g,
      '<span class="mana-symbol mana-white">W</span>',
    );
    formatted = formatted.replace(
      /\{U\}/g,
      '<span class="mana-symbol mana-blue">U</span>',
    );
    formatted = formatted.replace(
      /\{B\}/g,
      '<span class="mana-symbol mana-black">B</span>',
    );
    formatted = formatted.replace(
      /\{R\}/g,
      '<span class="mana-symbol mana-red">R</span>',
    );
    formatted = formatted.replace(
      /\{G\}/g,
      '<span class="mana-symbol mana-green">G</span>',
    );
    formatted = formatted.replace(
      /\{C\}/g,
      '<span class="mana-symbol mana-colorless">C</span>',
    );

    // Hybrid mana
    formatted = formatted.replace(
      /\{([WUBRG])\/([WUBRG])\}/g,
      '<span class="mana-symbol mana-hybrid">$1/$2</span>',
    );

    // Variable mana
    formatted = formatted.replace(
      /\{X\}/g,
      '<span class="mana-symbol mana-variable">X</span>',
    );

    return formatted;
  };

  // Format oracle text with better line breaks and mana symbols
  const formatOracleText = (text) => {
    if (!text) return "";

    // First replace mana symbols in the text
    let textWithMana = formatManaSymbols(text);

    // Split on periods followed by space and capital letter (sentence boundaries)
    // Also split on specific keywords that should be on new lines
    let formatted = textWithMana
      .replace(/\. ([A-Z])/g, ".\n$1")
      .replace(/\n([A-Z][a-z]+ \([^)]+\))/g, "\n\n$1") // Abilities with reminder text
      .replace(
        /\n(Flying|Trample|Haste|Vigilance|Deathtouch|Lifelink|First strike|Double strike|Hexproof|Indestructible|Reach|Defender|Menace|Ward)/g,
        "\n\n$1",
      )
      .split("\n")
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);

    return formatted;
  };

  // Helper function to get power/toughness
  const getPowerToughness = () => {
    if (card.power !== undefined && card.toughness !== undefined) {
      return `${card.power}/${card.toughness}`;
    }
    return null;
  };

  return (
    <>
      <div
        className="search-card"
        onClick={openModal}
        style={{ cursor: "pointer" }}
      >
        {/* Card Image Only */}
        <div className="search-card-image-container">
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
                className={`search-card-image ${imageLoaded ? "loaded" : ""}`}
              />
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal &&
        mounted &&
        createPortal(
          <div className="card-modal-overlay" onClick={closeModal}>
            <div
              className="card-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="card-modal-header">
                <h2 className="card-modal-title">{card.name}</h2>
                <button className="card-modal-close" onClick={closeModal}>
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="card-modal-body">
                {/* Card Image in Modal */}
                <div className="card-modal-image-container">
                  {showPlaceholder ? (
                    <div className={`mtg-card-placeholder ${colourClass}`}>
                      <div className="mtg-card-placeholder-content">
                        <h3 className="mtg-card-placeholder-name">
                          {card.name}
                        </h3>
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

                {/* Card Details */}
                <div className="card-info-section">
                  {card.mana_cost && (
                    <div className="mana-cost-display">
                      <strong>Mana Cost:</strong>
                      <span
                        className="mana-symbols"
                        dangerouslySetInnerHTML={{
                          __html: formatManaSymbols(card.mana_cost),
                        }}
                      />
                    </div>
                  )}
                  <p className="type-line-display">
                    <strong>Type:</strong> {card.type_line}
                  </p>
                  {card.oracle_text && (
                    <div className="oracle-text">
                      <strong>Rules Text:</strong>
                      <div className="oracle-text-content">
                        {formatOracleText(card.oracle_text).map(
                          (sentence, index) => (
                            <div
                              key={index}
                              className="oracle-sentence"
                              dangerouslySetInnerHTML={{ __html: sentence }}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  )}
                  {getPowerToughness() && (
                    <p className="power-toughness-display">
                      <strong>Power/Toughness:</strong> {getPowerToughness()}
                    </p>
                  )}
                  {card.rarity && (
                    <div className="rarity-display">
                      <strong>Rarity:</strong>{" "}
                      <span
                        className={`rarity-badge rarity-${card.rarity?.toLowerCase()}`}
                      >
                        {card.rarity}
                      </span>
                    </div>
                  )}
                  {card.set_name && (
                    <p className="set-display">
                      <strong>Set:</strong> {card.set_name}
                    </p>
                  )}
                  {card.artist && (
                    <p className="artist-display">
                      <strong>Artist:</strong> {card.artist}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="card-modal-footer">
                {isFavourite && currentUser && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRemoveFavourite) {
                        onRemoveFavourite(card);
                      }
                    }}
                    className="remove-favourite-btn"
                    title="Remove from favourites"
                  >
                    Remove from Favourites
                  </button>
                )}
                {!isFavourite && showFavouriteButton && currentUser && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavouriteClick();
                      closeModal();
                    }}
                    className="add-favourite-btn"
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
                    className="scryfall-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View on Scryfall
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
