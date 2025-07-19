import { useState, useMemo } from 'react';
import FavouriteCard from './FavoriteCard';
import Loading from '../UI/Loading';

export default function FavouritesList({
  favourites = [],
  loading = false,
  error = '',
  currentUser,
  onEditFavorite,
  onDeleteFavorite,
  onCardClick
}) {
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  // Extract unique ability types for filtering
  const abilityTypes = useMemo(() => {
    const types = [...new Set(favourites
      .map(fav => fav.ability_type)
      .filter(type => type && type !== '')
    )];
    return types.sort();
  }, [favourites]);

  // Filter and sort favourites
  const filteredAndSortedFavourites = useMemo(() => {
    let filtered = [...favourites];

    // Apply search filter
    if (searchFilter.trim()) {
      const search = searchFilter.toLowerCase();
      filtered = filtered.filter(fav =>
        fav.card_name.toLowerCase().includes(search) ||
        (fav.notes && fav.notes.toLowerCase().includes(search)) ||
        (fav.ability_type && fav.ability_type.toLowerCase().includes(search))
      );
    }

    // Apply ability type filter
    if (filterBy !== 'all') {
      if (filterBy === 'no-type') {
        filtered = filtered.filter(fav => !fav.ability_type || fav.ability_type === '');
      } else {
        filtered = filtered.filter(fav => fav.ability_type === filterBy);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'name':
          return a.card_name.localeCompare(b.card_name);
        case 'type':
          const typeA = a.ability_type || 'zzz';
          const typeB = b.ability_type || 'zzz';
          return typeA.localeCompare(typeB);
        default:
          return 0;
      }
    });

    return filtered;
  }, [favourites, sortBy, filterBy, searchFilter]);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  if (loading && favourites.length === 0) {
    return (
      <div className="loading-container">
        <Loading message="Loading your favourites..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error text-center mt-2 mb-2">
        <h3 className="mb-2">Failed to Load Favourites</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      {favourites.length > 0 && (
        <div className="card mb-3">
          {/* Search */}
          <div className="form-group">
            <label className="form-label">
              🔍 Search Favourites
            </label>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by card name, notes, or ability..."
              className="search-input"
            />
          </div>

          {/* Filters */}
          <div className="filters-grid">
            {/* Sort By */}
            <div className="form-group">
              <label className="form-label">
                📊 Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Card Name A-Z</option>
                <option value="type">Ability Type</option>
              </select>
            </div>

            {/* Filter By Type */}
            <div className="form-group">
              <label className="form-label">
                🎯 Filter By Type
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Cards ({favourites.length})</option>
                {abilityTypes.map(type => {
                  const count = favourites.filter(fav => fav.ability_type === type).length;
                  return (
                    <option key={type} value={type}>
                      {type} ({count})
                    </option>
                  );
                })}
                {favourites.some(fav => !fav.ability_type || fav.ability_type === '') && (
                  <option value="no-type">
                    Other Cards ({favourites.filter(fav => !fav.ability_type || fav.ability_type === '').length})
                  </option>
                )}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchFilter || filterBy !== 'all' || sortBy !== 'newest') && (
            <div className="text-center mt-2">
              <button
                onClick={() => {
                  setSearchFilter('');
                  setFilterBy('all');
                  setSortBy('newest');
                }}
                className="btn btn-secondary"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      {favourites.length > 0 && filteredAndSortedFavourites.length !== favourites.length && (
        <div className="search-results-summary">
          <p className="text-center">
            Showing {filteredAndSortedFavourites.length} of {favourites.length} favourites
            {searchFilter && ` matching "${searchFilter}"`}
          </p>
        </div>
      )}

      {/* Favourites List */}
      {favourites.length === 0 ? (
        <div className="card text-center">
          <div className="empty-state-icon">⭐</div>
          <h3 className="card-title">
            No Favourites Yet
          </h3>
          <p className="mb-3">
            Start building your collection by searching for cards and clicking the ⭐ button!
          </p>
          <a href="/search" className="btn">
            🔍 Search for Cards
          </a>
        </div>
      ) : filteredAndSortedFavourites.length === 0 ? (
        <div className="search-empty-state">
          <div className="search-empty-icon">🔍</div>
          <h3 className="search-empty-title">
            No matches found
          </h3>
          <p className="search-empty-subtitle">
            Try adjusting your search or filter settings.
          </p>
        </div>
      ) : (
        <div>
          {/* Favourites Grid */}
          <div className="favourites-grid">
            {filteredAndSortedFavourites.map((favourite, index) => (
              <div
                key={favourite.id}
                className="favourite-card-wrapper"
              >
                <FavouriteCard
                  favourite={favourite}
                  currentUser={currentUser}
                  onEdit={onEditFavorite}
                  onDelete={onDeleteFavorite}
                  onCardClick={() => handleCardClick(favourite)}
                />
              </div>
            ))}
          </div>


        </div>
      )}

      {/* Card Details Modal */}
      {selectedCard && (
        <div className="card-modal-overlay" onClick={handleCloseModal}>
          <div className="card-modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="card-modal-header">
              <h2 className="card-modal-title">{selectedCard.card_name}</h2>
              <button className="card-modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="card-modal-body">
              {/* Card Info */}
              <div className="card-info-section">
                {selectedCard.ability_type && (
                  <span className="ability-badge">{selectedCard.ability_type}</span>
                )}
                {selectedCard.mana_cost && (
                  <p className="mana-cost-display">Mana Cost: {selectedCard.mana_cost}</p>
                )}
                {selectedCard.oracle_text && (
                  <p className="oracle-text">{selectedCard.oracle_text}</p>
                )}
                {selectedCard.power && selectedCard.toughness && (
                  <p className="power-toughness">Power/Toughness: {selectedCard.power}/{selectedCard.toughness}</p>
                )}
                <p className="date-added">Added: {new Date(selectedCard.created_at).toLocaleDateString()}</p>
              </div>

              {/* Notes Section */}
              <div className="notes-section">
                <div className="notes-header">
                  <h4>📝 My Notes</h4>
                  <button
                    onClick={() => {/* Add edit functionality */}}
                    className="btn-outline btn-small"
                  >
                    ✏️ Edit
                  </button>
                </div>

                <div className="notes-display">
                  {selectedCard.notes ? (
                    <p>{selectedCard.notes}</p>
                  ) : (
                    <p className="notes-placeholder">
                      No notes added yet. Click "Edit" to add your thoughts about this card.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="card-modal-footer">
              <span className="action-hint">Added to your favourites collection</span>
              <button
                onClick={() => {
                  onDeleteFavorite(selectedCard.id);
                  handleCloseModal();
                }}
                className="btn btn-danger"
              >
                🗑️ Remove from Favourites
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && favourites.length > 0 && (
        <div className="loading-overlay">
          <div className="loading-overlay-content">
            <Loading message="Updating favourites..." />
          </div>
        </div>
      )}

      <style jsx>{`
        .search-input {
          width: 100%;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .filter-select {
          width: 100%;
        }

        .search-results-summary {
          background: rgba(26, 26, 26, 0.95);
          backdrop-filter: blur(2px);
          padding: 1rem;
          border-radius: 0.5rem;
          border: 1px solid var(--theme-border);
          margin-bottom: 1rem;
          color: var(--theme-text);
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }

        .search-empty-state {
          background: rgba(26, 26, 26, 0.95);
          backdrop-filter: blur(2px);
          text-align: center;
          padding: 3rem 2rem;
          border-radius: 0.75rem;
          border: 1px solid var(--theme-border);
        }

        .search-empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .search-empty-title {
          color: var(--theme-accent);
          margin-bottom: 0.5rem;
        }

        .search-empty-subtitle {
          color: var(--theme-textLight);
          margin: 0;
        }

        .favourites-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .favourite-card-wrapper {
          opacity: 0;
          animation: fadeInUp 0.5s ease-out forwards;
        }

        .favourite-card-wrapper:nth-child(1) { animation-delay: 0.1s; }
        .favourite-card-wrapper:nth-child(2) { animation-delay: 0.2s; }
        .favourite-card-wrapper:nth-child(3) { animation-delay: 0.3s; }
        .favourite-card-wrapper:nth-child(4) { animation-delay: 0.4s; }
        .favourite-card-wrapper:nth-child(5) { animation-delay: 0.5s; }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loading-overlay-content {
          background: rgba(26, 26, 26, 0.95);
          backdrop-filter: blur(2px);
          padding: 2rem;
          border-radius: 0.75rem;
          border: 1px solid var(--theme-border);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .card-modal-content {
          background: var(--theme-cardBg);
          border-radius: 1rem;
          border: 1px solid var(--theme-border);
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .card-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          border-bottom: 1px solid var(--theme-border);
          background: linear-gradient(135deg, var(--theme-cardBg), var(--theme-hover));
        }

        .card-modal-title {
          margin: 0;
          color: var(--theme-accent);
          font-size: 1.75rem;
          font-weight: bold;
        }

        .card-modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--theme-textLight);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-modal-close:hover {
          background: var(--theme-hover);
          color: var(--theme-text);
          transform: scale(1.1);
        }

        .card-modal-body {
          padding: 2rem;
        }

        .card-info-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--theme-border);
        }

        .ability-badge {
          background: rgba(var(--theme-primary-rgb), 0.15);
          color: var(--theme-primary);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid var(--theme-primary);
          display: inline-block;
          margin-bottom: 1rem;
        }

        .mana-cost-display,
        .oracle-text,
        .power-toughness,
        .date-added {
          margin: 0.75rem 0;
          font-size: 1rem;
          line-height: 1.6;
        }

        .oracle-text {
          font-style: italic;
          color: var(--theme-textLight);
          background: var(--theme-hover);
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 3px solid var(--theme-primary);
        }

        .power-toughness {
          font-weight: bold;
          color: var(--theme-accent);
        }

        .date-added {
          color: var(--theme-textLight);
          font-size: 0.9rem;
        }

        .notes-section {
          margin-bottom: 1rem;
        }

        .notes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .notes-header h4 {
          margin: 0;
          font-size: 1.1rem;
          color: var(--theme-accent);
        }

        .btn-small {
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
        }

        .notes-display p {
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
        }

        .notes-placeholder {
          font-style: italic;
          color: var(--theme-textLight);
          opacity: 0.8;
        }

        .card-modal-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem;
          border-top: 1px solid var(--theme-border);
          background: var(--theme-hover);
          border-bottom-left-radius: 1rem;
          border-bottom-right-radius: 1rem;
        }

        .action-hint {
          font-size: 0.9rem;
          color: var(--theme-textLight);
        }

        @media (max-width: 768px) {
          .favourites-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .card-modal-content {
            margin: 0.5rem;
            max-height: 95vh;
          }

          .card-modal-header,
          .card-modal-body,
          .card-modal-footer {
            padding: 1.5rem;
          }

          .card-modal-title {
            font-size: 1.5rem;
          }

          .card-modal-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}
