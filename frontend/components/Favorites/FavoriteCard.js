import { useState } from 'react';
import CardPreview from '../Card/CardPreview';

export default function FavoriteCard({
  favorite,
  currentUser,
  onEdit,
  onDelete,
  onCardClick
}) {
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
      `Are you sure you want to remove "${favorite.card_name}" from your favorites?`
    );

    if (confirmDelete) {
      try {
        setLoading(true);
        await onDelete(favorite.id);
      } catch (error) {
        console.error('Error deleting favorite:', error);
        alert('Failed to remove favorite. Please try again.');
        setLoading(false);
      }
    }
  };

  // Mock card object for CardPreview (since we only have basic info in favorites)
  const mockCard = {
    id: favorite.scryfall_id,
    name: favorite.card_name,
    type_line: favorite.ability_type || 'Card',
    // These would ideally be fetched from Scryfall if needed
    image_uris: favorite.image_uris ? { small: favorite.image_uris.small } : null,
    oracle_text: favorite.oracle_text || '',
    mana_cost: favorite.mana_cost || '',
    power: favorite.power,
    toughness: favorite.toughness,
    rarity: favorite.rarity || 'common'
  };

  return (
    <div style={{
      background: 'white',
      border: '2px solid #ffc107',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      {/* Favorite Indicator */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: '#ffc107',
        color: '#212529',
        borderRadius: '50%',
        width: '2.5rem',
        height: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        fontWeight: 'bold'
      }}>
        ⭐
      </div>

      {/* Card Preview */}
      <div style={{ marginBottom: '1.5rem' }}>
        <CardPreview
          card={mockCard}
          onClick={onCardClick}
          currentUser={currentUser}
          showFavoriteButton={false}
        />
      </div>

      {/* Favorite Metadata */}
      <div style={{
        background: '#f8f9fa',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: '1px solid #e9ecef',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
            <strong>Added:</strong> {new Date(favorite.created_at).toLocaleDateString()}
          </div>
          {favorite.ability_type && (
            <div style={{
              background: '#e3f2fd',
              color: '#1565c0',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              {favorite.ability_type}
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      <div style={{
        background: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '0.5rem',
        padding: '1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem'
        }}>
          <h4 style={{
            margin: 0,
            fontSize: '1rem',
            color: '#856404'
          }}>
            📝 My Notes
          </h4>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              style={{
                background: 'transparent',
                border: '1px solid #856404',
                color: '#856404',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              ✏️ Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Add your personal notes about this card..."
              disabled={loading}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '0.25rem',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '0.75rem'
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleSaveNotes}
                disabled={loading}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {loading ? 'Saving...' : 'Save Notes'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={loading}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            {favorite.notes ? (
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                lineHeight: '1.5',
                color: '#856404',
                fontStyle: favorite.notes ? 'normal' : 'italic'
              }}>
                {favorite.notes}
              </p>
            ) : (
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: '#856404',
                fontStyle: 'italic',
                opacity: 0.7
              }}>
                No notes added yet. Click "Edit" to add your thoughts about this card.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e9ecef'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
          Added to your favorites collection
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            cursor: 'pointer',
            fontWeight: '500',
            opacity: loading ? 0.6 : 1
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.background = '#c82333';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.background = '#dc3545';
            }
          }}
        >
          {loading ? 'Removing...' : '🗑️ Remove'}
        </button>
      </div>
    </div>
  );
}
