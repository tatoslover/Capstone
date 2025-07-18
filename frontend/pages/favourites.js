import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout/Layout";
import { FavoritesList } from "../components/Favorites";
import Loading from "../components/UI/Loading";
import { apiService } from "../services/apiService";

export default function FavoritesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        fetchFavorites(user.id);
      } catch (e) {
        localStorage.removeItem("currentUser");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchFavorites = async (userId) => {
    try {
      setLoading(true);
      setError("");

      const data = await apiService.favourites.getByUserId(userId);
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      // Better error message for offline mode
      if (err.message === "OFFLINE_MODE") {
        setError("Currently offline - demo mode active with sample data");
      } else {
        setError("Failed to load your favourites. Please try again.");
      }
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFavorite = async (favoriteId, newNotes) => {
    try {
      setActionLoading(true);

      await apiService.favourites.update(favoriteId, { notes: newNotes });

      // Update local state
      setFavorites((prevFavorites) =>
        prevFavorites.map((fav) =>
          fav.id === favoriteId ? { ...fav, notes: newNotes } : fav,
        ),
      );

      // Show success notification
      showNotification("Notes updated successfully!", "success");
    } catch (err) {
      console.error("Error updating favorite:", err);
      showNotification(err.message, "error");
      throw err; // Re-throw to handle in component
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteFavorite = async (favoriteId) => {
    try {
      setActionLoading(true);

      await apiService.favourites.delete(favoriteId);

      // Update local state
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.id !== favoriteId),
      );

      showNotification("Card removed from favourites!", "success");
    } catch (err) {
      console.error("Error deleting favorite:", err);
      showNotification(err.message, "error");
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

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === "success" ? "#28a745" : "#dc3545"};
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
    const style = document.createElement("style");
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
        notification.style.animation = "slideIn 0.3s ease-out reverse";
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
        <div className="container page-content">
          <div
            className="card text-center"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>👤</div>
            <h2 className="card-title">Profile Required</h2>
            <p className="mb-3" style={{ fontSize: "1.1rem" }}>
              You need to create a profile to save and view your favorite cards.
            </p>
            <div
              className="d-flex gap-2 justify-center"
              style={{ flexWrap: "wrap" }}
            >
              <a href="/profile" className="btn-outline">
                Create Profile
              </a>
              <button
                onClick={() => {
                  // Set demo user for offline experience
                  const demoUser = { id: 1, username: "Demo" };
                  localStorage.setItem("currentUser", JSON.stringify(demoUser));
                  setCurrentUser(demoUser);
                  fetchFavorites(1);
                }}
                className="btn-secondary"
              >
                Demo Profile
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Favorites - Planeswalker's Primer">
      <div className="container page-content">
        {/* Page Header */}
        <div className="text-center mb-3">
          <div className="header-box">
            <h1>My Favourite Cards</h1>
            <p>
              {currentUser
                ? `${currentUser.username}'s personal collection`
                : "Your saved MTG cards"}
            </p>
            {currentUser && (
              <p className="card-count">
                {favorites.length} {favorites.length === 1 ? 'card' : 'cards'} saved
              </p>
            )}
          </div>
        </div>



        {/* Loading State */}
        {loading && (
          <div className="loading">
            <Loading message="Loading your favourites..." size="large" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error text-center mt-2 mb-2">
            <h3 className="mb-2">Unable to Load Favourites</h3>
            <p className="mb-3">{error}</p>
            <button
              onClick={() => currentUser && fetchFavorites(currentUser.id)}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Favourites List */}
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
          <div className="card mt-3">
            <h4 className="card-title">
              💡 How to Build Your Favourites Collection
            </h4>
            <ol style={{ paddingLeft: "1.5rem" }}>
              <li className="mb-1">
                <strong>Search for cards:</strong> Use the search page to find
                interesting cards
              </li>
              <li className="mb-1">
                <strong>Click the ⭐ button:</strong> Save cards that catch your
                attention
              </li>
              <li className="mb-1">
                <strong>Add personal notes:</strong> Remember why each card is
                useful to you
              </li>
              <li className="mb-1">
                <strong>Organise and review:</strong> Use filters to find cards
                quickly during games
              </li>
            </ol>
          </div>
        )}
      </div>

      <style jsx>{`
        .header-box {
          max-width: 800px;
          margin: 0 auto;
        }

        .card-count {
          font-size: 1.1rem;
          color: var(--theme-textLight);
          margin-top: 0.5rem;
          margin-bottom: 0;
        }
      `}</style>
    </Layout>
  );
}
