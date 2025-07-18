import { useState, useMemo } from 'react';
import FavoriteCard from './FavoriteCard';
import Loading from '../UI/Loading';

export default function FavoritesList({
  favorites = [],
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

  // Extract unique ability types for filtering
  const abilityTypes = useMemo(() => {
    const types = [...new Set(favorites
      .map(fav => fav.ability_type)
      .filter(type => type && type !== '')
    )];
    return types.sort();
  }, [favorites]);

  // Filter and sort favorites
  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = [...favorites];

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
  }, [favorites, sortBy, filterBy, searchFilter]);

  if (loading && favorites.length === 0) {
    return <Loading message="Loading your favourites..." size="large" />;
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
      {favorites.length > 0 && (
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
                <option value="all">All Cards ({favorites.length})</option>
                {abilityTypes.map(type => {
                  const count = favorites.filter(fav => fav.ability_type === type).length;
                  return (
                    <option key={type} value={type}>
                      {type} ({count})
                    </option>
                  );
                })}
                {favorites.some(fav => !fav.ability_type || fav.ability_type === '') && (
                  <option value="no-type">
                    Other Cards ({favorites.filter(fav => !fav.ability_type || fav.ability_type === '').length})
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
      {favorites.length > 0 && filteredAndSortedFavorites.length !== favorites.length && (
        <div className="search-results-summary">
          <p className="text-center">
            Showing {filteredAndSortedFavorites.length} of {favorites.length} favourites
            {searchFilter && ` matching "${searchFilter}"`}
          </p>
        </div>
      )}

      {/* Favourites List */}
      {favorites.length === 0 ? (
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
      ) : filteredAndSortedFavorites.length === 0 ? (
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
            {filteredAndSortedFavorites.map((favorite, index) => (
              <div
                key={favorite.id}
                className="favourite-card-wrapper"
              >
                <FavoriteCard
                  favorite={favorite}
                  currentUser={currentUser}
                  onEdit={onEditFavorite}
                  onDelete={onDeleteFavorite}
                  onCardClick={onCardClick}
                />
              </div>
            ))}
          </div>

          {/* Summary */}
          {filteredAndSortedFavorites.length > 5 && (
            <div className="card text-center mt-3">
              <h4 className="card-title">
                📚 Collection Summary
              </h4>
              <p>
                You have {favorites.length} cards in your favourites collection.
                Keep exploring to find more cards that catch your interest!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && favorites.length > 0 && (
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
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
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

        @media (max-width: 768px) {
          .favourites-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
