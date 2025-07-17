import { useState } from 'react';

export default function CardDisplay({ card, showFavoriteButton = true, currentUser, onFavoriteToggle }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!card) {
    return null;
  }

  const handleFavoriteClick = () => {
    if (onFavoriteToggle && currentUser) {
      onFavoriteToggle(card);
    }
  };

  // Parse mana symbols for better display
  const formatManaSymbols = (manaCost) => {
    if (!manaCost) return '';
    // Simple formatting - could be enhanced with actual mana symbol images
    return manaCost
      .replace(/{([^}]+)}/g, '($1)')
      .replace(/\(/g, ' (')
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
      case 'common':
        return '#1a1a1a';
      case 'uncommon':
        return '#c0c0c0';
      case 'rare':
        return '#ffd700';
      case 'mythic':
        return '#ff8c00';
      default:
        return '#6c757d';
    }
  };

  // Highlight ability keywords in oracle text
  const highlightKeywords = (text) => {
    if (!text) return '';

    const keywords = [
      'Flying', 'Trample', 'First strike', 'Double strike', 'Deathtouch',
      'Lifelink', 'Vigilance', 'Haste', 'Reach', 'Hexproof', 'Indestructible',
      'Menace', 'Prowess', 'Scry', 'Flash', 'Defender'
    ];

    let highlightedText = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, `<span style="background: #fff3cd; color: #856404; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-weight: 500;">${keyword}</span>`);
    });

    return highlightedText;
  };

  return (
    <div className="mtg-card" style={{
      position: 'relative',
      maxWidth: '350px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      border: '2px solid #d4b106'
    }}>
      {/* Favorite Button */}
      {showFavoriteButton && currentUser && (
        <button
          onClick={handleFavoriteClick}
          className="favorite-indicator"
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem',
            zIndex: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          title="Add to favorites"
        >
          ⭐
        </button>
      )}

      {/* Card Image */}
      {card.image_uris?.normal && !imageError && (
        <div style={{
          position: 'relative',
          width: '100%',
          paddingTop: '139%', // MTG card aspect ratio
          background: '#f8f9fa',
          overflow: 'hidden'
        }}>
          {!imageLoaded && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#6c757d'
            }}>
              Loading image...
            </div>
          )}
          <img
            src={card.image_uris.normal}
            alt={card.name}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        </div>
      )}

      {/* Card Details */}
      <div style={{ padding: '1.5rem' }}>
        {/* Card Name and Mana Cost */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.75rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <h3 className="mtg-card-name" style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: '700',
            lineHeight: '1.2',
            flex: '1 1 auto'
          }}>
            {card.name}
          </h3>
          {card.mana_cost && (
            <div className="mtg-mana-cost" style={{
              fontSize: '1rem',
              whiteSpace: 'nowrap'
            }}>
              {formatManaSymbols(card.mana_cost)}
            </div>
          )}
        </div>

        {/* Type Line */}
        <div className="mtg-card-type" style={{
          marginBottom: '1rem',
          fontSize: '0.9rem',
          color: '#6c757d',
          fontWeight: '500'
        }}>
          {card.type_line}
        </div>

        {/* Rarity */}
        {card.rarity && (
          <div style={{
            display: 'inline-block',
            background: getRarityColor(card.rarity),
            color: card.rarity?.toLowerCase() === 'common' ? 'white' : '#1a1a1a',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            marginBottom: '1rem'
          }}>
            {card.rarity}
          </div>
        )}

        {/* Oracle Text */}
        {card.oracle_text && (
          <div className="mtg-card-text" style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            border: '1px solid #e9ecef'
          }}>
            <div
              dangerouslySetInnerHTML={{
                __html: highlightKeywords(card.oracle_text)
              }}
            />
          </div>
        )}

        {/* Power/Toughness */}
        {getPowerToughness() && (
          <div style={{
            textAlign: 'right',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#d4b106',
            marginBottom: '1rem'
          }}>
            {getPowerToughness()}
          </div>
        )}

        {/* Set Information */}
        <div style={{
          paddingTop: '1rem',
          borderTop: '1px solid #e9ecef',
          fontSize: '0.8rem',
          color: '#6c757d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <strong>{card.set_name || card.set}</strong>
            {card.collector_number && ` #${card.collector_number}`}
          </div>
          {card.artist && (
            <div style={{ fontStyle: 'italic' }}>
              Art: {card.artist}
            </div>
          )}
        </div>

        {/* Beginner Help */}
        {card.oracle_text && card.oracle_text.match(/(Flying|Trample|First strike|Deathtouch|Lifelink|Vigilance|Haste|Hexproof)/i) && (
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: '#e3f2fd',
            borderRadius: '0.5rem',
            border: '1px solid #bbdefb'
          }}>
            <div style={{
              fontSize: '0.8rem',
              color: '#1565c0',
              fontWeight: '600',
              marginBottom: '0.25rem'
            }}>
              💡 Beginner Tip
            </div>
            <div style={{
              fontSize: '0.8rem',
              color: '#1976d2',
              lineHeight: '1.4'
            }}>
              This card has keyword abilities highlighted above.
              Check the homepage to learn what they mean!
            </div>
          </div>
        )}

        {/* External Links */}
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {card.scryfall_uri && (
            <a
              href={card.scryfall_uri}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.8rem',
                color: '#007bff',
                textDecoration: 'none',
                padding: '0.25rem 0.5rem',
                border: '1px solid #007bff',
                borderRadius: '0.25rem',
                display: 'inline-block'
              }}
            >
              View on Scryfall
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
