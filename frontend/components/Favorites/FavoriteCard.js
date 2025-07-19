import { useState } from 'react';

export default function FavouriteCard({
  favourite,
  currentUser,
  onEdit,
  onDelete,
  onCardClick
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState(favourite.notes || '');
  const [loading, setLoading] = useState(false);

  if (!favourite) {
    return null;
  }

  const handleSaveNotes = async () => {
    if (!onEdit) return;

    try {
      setLoading(true);
      await onEdit(favourite.id, editNotes);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditNotes(favourite.notes || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to remove "${favourite.card_name}" from your favourites?`
    );

    if (confirmDelete) {
      try {
        setLoading(true);
        await onDelete(favourite.id);
      } catch (error) {
        console.error('Error deleting favourite:', error);
        alert('Failed to remove favourite. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(favourite);
    }
  };

  // Use real Scryfall image data if available - for demo mode, image_uris is intentionally null
  const cardImageUrl = favourite.image_uris?.normal || favourite.image_uris?.large || favourite.image_uris?.small || null;

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

  // Get colours from the favourite data
  const cardColours = favourite.colour_identity || favourite.colours || [];
  const colourClass = getCardColourClass(cardColours);

  // Debug logging to see why placeholders aren't colored
  console.log(`${favourite.card_name} placeholder debug:`, {
    cardColours,
    colourClass,
    hasImageUris: !!favourite.image_uris,
    cardImageUrl
  });






  return (
    <div className="mtg-card-container favourite-card">
      {/* Favourite Star Indicator */}
      <div className="favourite-star">⭐</div>

      {/* Card Image - Main Focus */}
      <div className="card-image-container" onClick={handleCardClick}>
        {/* Fallback/Placeholder - always show for demo mode */}
        <div className={`mtg-card-placeholder ${colourClass}`}>
          <div className="mtg-card-placeholder-content">
            <h3 className="mtg-card-placeholder-name">{favourite.card_name}</h3>
            {favourite.ability_type && (
              <p className="mtg-card-placeholder-type">{favourite.ability_type}</p>
            )}
            {favourite.mana_cost && (
              <p className="mtg-card-placeholder-mana">{favourite.mana_cost}</p>
            )}
            <p className="mtg-card-placeholder-hint">Click to view details</p>
          </div>
        </div>

        {/* Click Overlay */}
        <div className="card-click-overlay">
          <span className="click-hint">Click for details</span>
        </div>
      </div>

      <style jsx>{`
        .favourite-card {
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid var(--theme-highlight);
          max-width: 300px;
          margin: 0 auto;
        }

        .favourite-card:hover {
          box-shadow: 0 6px 12px rgba(var(--theme-accent-rgb), 0.2);
          transform: translateY(-2px);
        }

        .favourite-star {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          background: var(--theme-warning);
          color: var(--theme-cardBg);
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .card-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 5/7;
          border-radius: 0.5rem;
          overflow: hidden;
          cursor: pointer;
          max-height: 300px;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .card-image:hover {
          transform: scale(1.05);
        }

        .card-placeholder {
          width: 100%;
          height: 100%;
          display: flex !important;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.75rem;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          min-height: 300px;
        }

        .card-placeholder:hover {
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .card-placeholder::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.1) 50%, transparent 51%);
          pointer-events: none;
        }

        .card-placeholder-content {
          text-align: center;
          padding: 1rem;
          z-index: 1;
          position: relative;
        }

        .mtg-card-name {
          font-size: 1.1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
          letter-spacing: 0.5px;
          color: inherit !important;
        }

        .mtg-card-type {
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          font-style: italic;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          color: inherit !important;
          opacity: 0.9;
        }

        .mtg-mana-cost {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-family: 'Courier New', monospace;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          color: inherit !important;
          opacity: 0.8;
        }

        .card-click-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-image-container:hover .card-click-overlay {
          opacity: 1;
        }

        .click-hint {
          font-size: 0.8rem;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          opacity: 0.7;
          color: inherit !important;
        }

        @media (max-width: 768px) {
          .favourite-card {
            border: 2px solid var(--theme-highlight);
            max-width: 300px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
}
