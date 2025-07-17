import { useState } from 'react';

export default function CardPreview({ card, onClick, currentUser, onFavoriteToggle, showFavoriteButton = true }) {
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
    if (!manaCost) return '';
    return manaCost
      .replace(/{([^}]+)}/g, '($1)')
      .replace(/\(/g, ' (')
      .trim();
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

  // Extract key abilities for preview
  const extractKeywords = (text) => {
    if (!text) return [];

    const keywords = [
      'Flying', 'Trample', 'First strike', 'Double strike', 'Deathtouch',
      'Lifelink', 'Vigilance', 'Haste', 'Reach', 'Hexproof', 'Indestructible',
      'Menace', 'Prowess', 'Flash', 'Defender'
    ];

    const found = [];
    keywords.forEach(keyword => {
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
      style={{
        display: 'flex',
        background: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '0.5rem',
        padding: '1rem',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        gap: '1rem'
      }}
      onMouseOver={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = '#007bff';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }
      }}
      onMouseOut={(e) => {
        if (onClick) {
          e.currentTarget.style.borderColor = '#dee2e6';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }
      }}
    >
      {/* Favorite Button */}
      {showFavoriteButton && currentUser && (
        <button
          onClick={handleFavoriteClick}
          className="favorite-indicator"
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            zIndex: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          }}
          title="Add to favorites"
        >
          ⭐
        </button>
      )}

      {/* Card Image */}
      <div style={{
        flexShrink: 0,
        width: '80px',
        height: '112px',
        borderRadius: '0.25rem',
        overflow: 'hidden',
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {card.image_uris?.small && !imageError ? (
          <img
            src={card.image_uris.small}
            alt={card.name}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{
            fontSize: '0.7rem',
            color: '#6c757d',
            textAlign: 'center',
            padding: '0.25rem'
          }}>
            🃏
          </div>
        )}
      </div>

      {/* Card Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name and Mana Cost */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.5rem',
          gap: '0.5rem'
        }}>
          <h4 style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: '600',
            color: '#d4b106',
            lineHeight: '1.2',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: '1 1 auto'
          }}>
            {card.name}
          </h4>
          {card.mana_cost && (
            <div style={{
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              fontWeight: 'bold',
              color: '#6c757d',
              background: '#f8f9fa',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.125rem',
              whiteSpace: 'nowrap'
            }}>
              {formatManaSymbols(card.mana_cost)}
            </div>
          )}
        </div>

        {/* Type Line */}
        <div style={{
          fontSize: '0.8rem',
          color: '#6c757d',
          fontStyle: 'italic',
          marginBottom: '0.5rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {card.type_line}
        </div>

        {/* Rarity and Power/Toughness */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          {card.rarity && (
            <span style={{
              fontSize: '0.7rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              color: getRarityColor(card.rarity),
              background: card.rarity?.toLowerCase() === 'common' ? 'rgba(26,26,26,0.1)' : 'rgba(255,215,0,0.1)',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.125rem'
            }}>
              {card.rarity}
            </span>
          )}
          {card.power && card.toughness && (
            <span style={{
              fontSize: '0.9rem',
              fontWeight: '700',
              color: '#d4b106'
            }}>
              {card.power}/{card.toughness}
            </span>
          )}
        </div>

        {/* Keywords */}
        {cardKeywords.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.25rem',
            marginBottom: '0.5rem'
          }}>
            {cardKeywords.map((keyword, index) => (
              <span
                key={index}
                style={{
                  fontSize: '0.7rem',
                  background: '#fff3cd',
                  color: '#856404',
                  padding: '0.125rem 0.25rem',
                  borderRadius: '0.125rem',
                  fontWeight: '500'
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Truncated Oracle Text */}
        {card.oracle_text && (
          <div style={{
            fontSize: '0.75rem',
            color: '#495057',
            lineHeight: '1.3',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis'
          }}>
            {card.oracle_text}
          </div>
        )}

        {/* Set Info */}
        <div style={{
          fontSize: '0.7rem',
          color: '#6c757d',
          marginTop: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>
            {card.set_name || card.set}
            {card.collector_number && ` #${card.collector_number}`}
          </span>
          {onClick && (
            <span style={{
              color: '#007bff',
              fontSize: '0.6rem',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Click for details →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
