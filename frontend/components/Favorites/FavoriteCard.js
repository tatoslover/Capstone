import { useState } from 'react';

export default function FavoriteCard({
  favorite,
  currentUser,
  onEdit,
  onDelete,
  onCardClick
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState(favorite.notes || '');
  const [loading, setLoading] = useState(false);

  if (!favorite) {
    return null;
  }

  const handleSaveNotes = async () => {
    if (!onEdit) return;

    try {
      setLoading(true);
      await onEdit(favorite.id, editNotes);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditNotes(favorite.notes || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to remove "${favorite.card_name}" from your favourites?`
    );

    if (confirmDelete) {
      try {
        setLoading(true);
        await onDelete(favorite.id);
      } catch (error) {
        console.error('Error deleting favourite:', error);
        alert('Failed to remove favourite. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  // Use real Scryfall image data if available
  const cardImageUrl = favorite.image_uris?.normal || favorite.image_uris?.large || favorite.image_uris?.small || null;

  return (
    <div className="mtg-card-container favourite-card">
      {/* Favourite Star Indicator */}
      <div className="favourite-star">⭐</div>

      {/* Card Image - Main Focus */}
      <div className="card-image-container" onClick={handleCardClick}>
        {cardImageUrl ? (
          <img
            src={cardImageUrl}
            alt={favorite.card_name}
            className="card-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* Fallback/Placeholder */}
        <div className="card-placeholder" style={{ display: cardImageUrl ? 'none' : 'flex' }}>
          <div className="card-placeholder-content">
            <h3 className="mtg-card-name">{favorite.card_name}</h3>
            {favorite.ability_type && (
              <p className="mtg-card-type">{favorite.ability_type}</p>
            )}
            <p className="click-hint">Click to view details</p>
          </div>
        </div>

        {/* Click Overlay */}
        <div className="card-click-overlay">
          <span className="click-hint">Click for details</span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="card-details-expanded">
          {/* Card Info */}
          <div className="card-header">
            <h3 className="card-title">{favorite.card_name}</h3>
            {favorite.ability_type && (
              <span className="ability-badge">{favorite.ability_type}</span>
            )}
          </div>

          {/* Metadata */}
          <div className="card-metadata">
            <p>Added: {new Date(favorite.created_at).toLocaleDateString()}</p>
          </div>

          {/* Notes Section */}
          <div className="notes-section">
            <div className="notes-header">
              <h4>📝 My Notes</h4>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                  className="btn-outline"
                >
                  ✏️ Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="notes-editor">
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add your personal notes about this card..."
                  disabled={loading}
                  className="notes-textarea"
                />
                <div className="notes-actions">
                  <button
                    onClick={handleSaveNotes}
                    disabled={loading}
                    className="btn btn-success"
                  >
                    {loading ? 'Saving...' : 'Save Notes'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="notes-display">
                {favorite.notes ? (
                  <p>{favorite.notes}</p>
                ) : (
                  <p className="notes-placeholder">
                    No notes added yet. Click "Edit" to add your thoughts about this card.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="card-actions">
            <span className="action-hint">Added to your favourites collection</span>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="btn btn-danger"
            >
              {loading ? 'Removing...' : '🗑️ Remove'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .favourite-card {
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid var(--theme-highlight);
        }

        .favourite-card:hover {
          box-shadow: 0 6px 12px rgba(var(--theme-accent-rgb), 0.2);
          transform: translateY(-2px);
        }

        .favourite-star {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: var(--theme-warning);
          color: var(--theme-cardBg);
          border-radius: 50%;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: bold;
          z-index: 2;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .card-image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 5/7;
          border-radius: 0.75rem;
          overflow: hidden;
          cursor: pointer;
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
          background: var(--theme-cardBg);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed var(--theme-border);
          border-radius: 0.75rem;
        }

        .card-placeholder-content {
          text-align: center;
          padding: 1rem;
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
          font-size: 0.875rem;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .card-details-expanded {
          padding: 1rem;
          animation: slideDown 0.3s ease-out;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .ability-badge {
          background: rgba(var(--theme-primary-rgb), 0.1);
          color: var(--theme-primary);
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          border: 1px solid var(--theme-primary);
        }

        .card-metadata {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--theme-border);
        }

        .card-metadata p {
          font-size: 0.875rem;
          color: var(--theme-textLight);
          margin: 0;
        }

        .notes-section {
          margin-bottom: 1rem;
        }

        .notes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .notes-header h4 {
          margin: 0;
          font-size: 1rem;
          color: var(--theme-accent);
        }

        .notes-textarea {
          width: 100%;
          min-height: 100px;
          margin-bottom: 0.75rem;
          resize: vertical;
        }

        .notes-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .notes-display p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .notes-placeholder {
          font-style: italic;
          color: var(--theme-textLight);
          opacity: 0.8;
        }

        .card-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--theme-border);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .action-hint {
          font-size: 0.8rem;
          color: var(--theme-textLight);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .card-header,
          .notes-header,
          .card-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .notes-actions {
            width: 100%;
          }

          .notes-actions button {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}
