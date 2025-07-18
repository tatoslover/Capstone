import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import { FavoritesList } from '../components/Favorites';
import Loading from '../components/UI/Loading';

export default function FavoritesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        fetchFavorites(user.id);
      } catch (e) {
        localStorage.removeItem('currentUser');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = async (userId) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_URL}/api/favorites/${userId}`);

      if (!response.ok) {
        if (response.status === 404) {
          setFavorites([]);
          return;
        }
        throw new Error(`Failed to fetch favorites: ${response.status}`);
      }

      const data = await response.json();
      setFavorites(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load your favorites. Please try again.');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFavorite = async (favoriteId, newNotes) => {
    try {
      setActionLoading(true);

      const response = await fetch(`${API_URL}/api/favorites/${favoriteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: newNotes }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update notes');
      }

      const updatedFavorite = await response.json();

      // Update local state
      setFavorites(prevFavorites =>
        prevFavorites.map(fav =>
          fav.id === favoriteId ? { ...fav, notes: newNotes } : fav
        )
      );

      // Show success notification
      showNotification('Notes updated successfully!', 'success');

    } catch (err) {
      console.error('Error updating favorite:', err);
      showNotification(err.message, 'error');
      throw err; // Re-throw to handle in component
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      setActionLoading(true);

      const response = await fetch(`${API_URL}/api/favorites/${favoriteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove favorite');
      }

      // Update local state
      setFavorites(prevFavorites =>
        prevFavorites.filter(fav => fav.id !== favoriteId)
      );

      showNotification('Card removed from favorites!', 'success');

    } catch (err) {
      console.error('Error deleting favorite:', err);
      showNotification(err.message, 'error');
      throw err; // Re-throw to handle in component
    } finally {
      setActionLoading(false);
    }
  };

  const handleCardClick = (card) => {
    // For now, navigate to search with the card name
    if (card && card.name) {
      router.push(`/search?q=${encodeURIComponent(card.name)}`);
    }
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#28a745' : '#dc3545'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 1000;
      font-weight: 500;
      max-width: 300px;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
          document.body.removeChild(notification);
          document.head.removeChild(style);
        }, 300);
      }
    }, 3000);
  };

  // Redirect to home if no user
  if (!loading && !currentUser) {
    return (
      <Layout title="Favorites - Planeswalker's Primer">
        <div className="container" style={{ padding: '2rem 1rem' }}>
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'white',
            borderRadius: '1rem',
            border: '2px solid #ffc107',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>👤</div>
            <h2 style={{ color: '#495057', marginBottom: '1rem' }}>
              Profile Required
            </h2>
            <p style={{ color: '#6c757d', marginBottom: '2rem', fontSize: '1.1rem' }}>
              You need to create a profile to save and view your favorite cards.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="/"
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
                Create Profile
              </a>
              <a
                href="/search"
                style={{
                  display: 'inline-block',
                  background: '#28a745',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '1.1rem'
                }}
              >
                Search Cards
              </a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Favorites - Planeswalker's Primer">
      <div className="container" style={{ padding: '2rem 1rem' }}>
        {/* Page Header */}
        <div className="text-center mb-3">
          <h1 style={{ color: '#d4b106', marginBottom: '0.5rem' }}>
            My Favorite Cards
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#6c757d', marginBottom: '2rem' }}>
            {currentUser ? `${currentUser.username}'s personal collection` : 'Your saved MTG cards'}
          </p>
        </div>

        {/* User Welcome */}
        {currentUser && (
          <div style={{
            background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', color: 'white' }}>
              Welcome back, {currentUser.username}! ⭐
            </h3>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Manage your favorite cards, add personal notes, and build your reference collection.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <Loading message="Loading your favorites..." size="large" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error" style={{ textAlign: 'center', margin: '2rem 0' }}>
            <h3 style={{ marginBottom: '1rem' }}>Unable to Load Favorites</h3>
            <p style={{ marginBottom: '1.5rem' }}>{error}</p>
            <button
              onClick={() => currentUser && fetchFavorites(currentUser.id)}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Favorites List */}
        {!loading && !error && currentUser && (
          <FavoritesList
            favorites={favorites}
            loading={actionLoading}
            error=""
            currentUser={currentUser}
            onEditFavorite={handleEditFavorite}
            onDeleteFavorite={handleDeleteFavorite}
            onCardClick={handleCardClick}
          />
        )}

        {/* Help Section */}
        {!loading && currentUser && favorites.length === 0 && !error && (
          <div style={{
            background: '#e8f4f8',
            padding: '2rem',
            borderRadius: '0.75rem',
            border: '1px solid #b8e6ff',
            marginTop: '2rem'
          }}>
            <h4 style={{ color: '#0c5460', marginBottom: '1rem' }}>
              💡 How to Build Your Favorites Collection
            </h4>
            <div style={{ color: '#155160', lineHeight: '1.6' }}>
              <ol style={{ paddingLeft: '1.5rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Search for cards:</strong> Use the search page to find interesting cards
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Click the ⭐ button:</strong> Save cards that catch your attention
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Add personal notes:</strong> Remember why each card is useful to you
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Organize and review:</strong> Use filters to find cards quickly during games
                </li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
