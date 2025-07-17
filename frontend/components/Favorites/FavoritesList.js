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
    return <Loading message="Loading your favorites..." size="large" />;
  }

  if (error) {
    return (
      <div className="error" style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h3 style={{ marginBottom: '0.5rem' }}>Failed to Load Favorites</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ margin: 0, color: '#d4b106' }}>
            My Favorite Cards
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d' }}>
            {favorites.length} {favorites.length === 1 ? 'card' : 'cards'} saved
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      {favorites.length > 0 && (
        <div style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #e9ecef',
          marginBottom: '2rem'
        }}>
          {/* Search */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#495057'
            }}>
              🔍 Search Favorites
            </label>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by card name, notes, or ability..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ced4da',
                borderRadius: '0.5rem',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Filters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {/* Sort By */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                📊 Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ced4da',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Card Name A-Z</option>
                <option value="type">Ability Type</option>
              </select>
            </div>

            {/* Filter By Type */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#495057',
                fontSize: '0.9rem'
              }}>
                🎯 Filter By Type
              </label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ced4da',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem'
                }}
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
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                onClick={() => {
                  setSearchFilter('');
                  setFilterBy('all');
                  setSortBy('newest');
                }}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      {favorites.length > 0 && filteredAndSortedFavorites.length !== favorites.length && (
        <div style={{
          background: '#e3f2fd',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #bbdefb',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#1565c0' }}>
            Showing {filteredAndSortedFavorites.length} of {favorites.length} favorites
            {searchFilter && ` matching "${searchFilter}"`}
          </p>
        </div>
      )}

      {/* Favorites List */}
      {favorites.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'white',
          borderRadius: '1rem',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>⭐</div>
          <h3 style={{ color: '#495057', marginBottom: '1rem' }}>
            No Favorites Yet
          </h3>
          <p style={{ color: '#6c757d', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Start building your collection by searching for cards and clicking the ⭐ button!
          </p>
          <a
            href="/search"
            style={{
              display: 'inline-block',
              background: '#007bff',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '1.1rem'
            }}
          >
            🔍 Search for Cards
          </a>
        </div>
      ) : filteredAndSortedFavorites.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          background: '#fff3cd',
          borderRadius: '0.75rem',
          border: '1px solid #ffeaa7'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: '#856404', marginBottom: '0.5rem' }}>
            No matches found
          </h3>
          <p style={{ color: '#856404', margin: 0 }}>
            Try adjusting your search or filter settings.
          </p>
        </div>
      ) : (
        <div>
          {/* Favorites Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredAndSortedFavorites.map((favorite, index) => (
              <div
                key={favorite.id}
                style={{
                  opacity: 0,
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`
                }}
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
            <div style={{
              textAlign: 'center',
              marginTop: '3rem',
              padding: '2rem',
              background: '#f8f9fa',
              borderRadius: '0.75rem',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ color: '#495057', marginBottom: '0.5rem' }}>
                📚 Collection Summary
              </h4>
              <p style={{ color: '#6c757d', margin: 0 }}>
                You have {favorites.length} cards in your favorites collection.
                Keep exploring to find more cards that catch your interest!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && favorites.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
          }}>
            <Loading message="Updating favorites..." />
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style jsx>{`
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

        /* Mobile responsive */
        @media (max-width: 768px) {
          .favorites-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
