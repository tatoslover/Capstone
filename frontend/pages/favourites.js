import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout/Layout";
import SearchCard from "../components/Search/SearchCard";
import Loading from "../components/UI/Loading";
import {
  apiService,
  addConnectionListener,
  removeConnectionListener,
} from "../services/apiService";

export default function FavouritesPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Filtering and sorting state
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const resultsPerPage = 10;

  // Load user from localStorage on mount
  useEffect(() => {
    // Check for reset query parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === 'true') {
      localStorage.removeItem("currentUser");
      window.history.replaceState({}, '', window.location.pathname);
      setLoading(false);
      return;
    }

    // Listen for connection status changes first
    const handleConnectionChange = (online) => {
      setIsOnline(online);
    };

    addConnectionListener(handleConnectionChange);

    // Get initial connection status
    setIsOnline(apiService.isOnline());

    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        // Check connection and fetch if online
        if (apiService.isOnline()) {
          fetchFavourites(user.id);
        } else {
          setLoading(false);
        }
      } catch (e) {
        localStorage.removeItem("currentUser");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    return () => {
      removeConnectionListener(handleConnectionChange);
    };
  }, []);

  // Separate effect to handle connection changes for existing users
  useEffect(() => {
    if (isOnline && currentUser && favourites.length === 0 && !loading) {
      fetchFavourites(currentUser.id);
    }
  }, [isOnline, currentUser]);

  const fetchFavourites = async (userId) => {
    if (!isOnline) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // First verify that the user exists
      try {
        await apiService.users.getById(userId);
      } catch (userError) {
        console.warn(`User ID ${userId} not found, clearing stored user`);
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        setFavourites([]);
        setError("The selected user no longer exists. Please select a valid user.");
        setLoading(false);
        return;
      }

      // Get favourites list from backend
      const favouritesData = await apiService.favourites.getByUserId(userId);

      if (!Array.isArray(favouritesData) || favouritesData.length === 0) {
        setFavourites([]);
        return;
      }

      // Fetch actual card data from Scryfall for each favourite
      const cardPromises = favouritesData.map(async (fav) => {
        try {
          if (fav.scryfall_id) {
            const cardData = await apiService.cards.getById(fav.scryfall_id);
            // Merge Scryfall card data with favourite metadata
            return {
              ...cardData,
              favourite_id: fav.id,
              notes: fav.notes,
              created_at: fav.created_at,
              ability_type: fav.ability_type,
            };
          } else {
            // Fallback for favourites without scryfall_id
            return {
              id: fav.id,
              name: fav.card_name || "Unknown Card",
              favourite_id: fav.id,
              notes: fav.notes,
              created_at: fav.created_at,
              ability_type: fav.ability_type,
            };
          }
        } catch (cardError) {
          console.warn(
            `Failed to fetch card data for favourite ${fav.id}:`,
            cardError,
          );
          // Return fallback data if Scryfall fetch fails
          return {
            id: fav.scryfall_id || fav.id,
            name: fav.card_name || "Unknown Card",
            favourite_id: fav.id,
            notes: fav.notes,
            created_at: fav.created_at,
            ability_type: fav.ability_type,
          };
        }
      });

      const cardsWithFavouriteData = await Promise.all(cardPromises);
      setFavourites(cardsWithFavouriteData);
    } catch (err) {
      console.error("Error fetching favourites:", err);

      // Handle specific API errors
      if (err.message && err.message.includes("404")) {
        localStorage.removeItem("currentUser");
        setCurrentUser(null);
        setError("User not found. Please select a valid user.");
      } else {
        setError("Failed to load your favourites. Please try again.");
      }
      setFavourites([]);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique ability types for filtering
  const abilityTypes = useMemo(() => {
    const types = [
      ...new Set(
        favourites
          .map((fav) => fav.ability_type)
          .filter((type) => type && type !== ""),
      ),
    ];
    return types.sort();
  }, [favourites]);

  // Extract unique rarities for filtering
  const rarities = useMemo(() => {
    const rarityList = [
      ...new Set(
        favourites.map((card) => card.rarity).filter((rarity) => rarity),
      ),
    ];
    return rarityList.sort();
  }, [favourites]);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...favourites];

    // Apply search filter
    if (searchFilter.trim()) {
      const search = searchFilter.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.name.toLowerCase().includes(search) ||
          (card.oracle_text &&
            card.oracle_text.toLowerCase().includes(search)) ||
          (card.type_line && card.type_line.toLowerCase().includes(search)) ||
          (card.notes && card.notes.toLowerCase().includes(search)),
      );
    }

    // Apply type filter
    if (filterBy !== "all") {
      if (filterBy.startsWith("type-")) {
        const type = filterBy.replace("type-", "");
        filtered = filtered.filter((card) => card.ability_type === type);
      } else if (filterBy.startsWith("rarity-")) {
        const rarity = filterBy.replace("rarity-", "");
        filtered = filtered.filter((card) => card.rarity === rarity);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "name":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "mana-cost":
          const aCmc = a.cmc || 0;
          const bCmc = b.cmc || 0;
          return aCmc - bCmc;
        case "rarity":
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, mythic: 4 };
          return (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0);
        case "type":
          const typeA = a.ability_type || "zzz";
          const typeB = b.ability_type || "zzz";
          return typeA.localeCompare(typeB);
        default:
          return 0;
      }
    });

    return filtered;
  }, [favourites, searchFilter, filterBy, sortBy]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedResults.length / resultsPerPage,
  );
  const startIndex = (currentPage - 1) * resultsPerPage;
  const paginatedResults = filteredAndSortedResults.slice(
    startIndex,
    startIndex + resultsPerPage,
  );

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchFilter, filterBy, sortBy]);

  const handleRemoveFavourite = async (card) => {
    if (!isOnline) {
      showNotification("Cannot remove favourites while offline.", "error");
      return;
    }

    try {
      setActionLoading(true);

      await apiService.favourites.delete(card.favourite_id);

      // Update local state
      setFavourites((prevFavourites) =>
        prevFavourites.filter((fav) => fav.favourite_id !== card.favourite_id),
      );

      showNotification("Card removed from favourites!", "success");
    } catch (err) {
      console.error("Error deleting favourite:", err);
      showNotification(
        "Failed to remove from favourites. Please try again.",
        "error",
      );
    } finally {
      setActionLoading(false);
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

  // Show offline message if backend is not connected
  if (!isOnline) {
    return (
      <Layout title="Favourites - Planeswalker's Primer">
        <div className="container page-content">
          <div
            className="card text-center"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🌐</div>
            <h2 className="card-title">Currently Offline</h2>
            <p className="mb-3" style={{ fontSize: "1.1rem" }}>
              Your favourites require a connection to the backend server. Please
              check your connection and try again.
            </p>
            <div
              className="d-flex gap-2 justify-center"
              style={{ flexWrap: "wrap" }}
            >
              <button onClick={() => window.location.reload()} className="btn">
                🔄 Retry Connection
              </button>
              <a href="/search" className="btn-outline">
                🔍 Search Cards Instead
              </a>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Redirect to home if no user
  if (!loading && !currentUser) {
    return (
      <Layout title="Favourites - Planeswalker's Primer">
        <div className="container page-content">
          <div
            className="card text-center"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>👤</div>
            <h2 className="card-title">Profile Required</h2>
            <p className="mb-3" style={{ fontSize: "1.1rem" }}>
              You need to create a profile to save and view your favourite
              cards.
            </p>
            <div
              className="d-flex gap-2 justify-center"
              style={{ flexWrap: "wrap" }}
            >
              <a href="/profile" className="btn-outline">
                Create Profile
              </a>
              <a href="/search" className="btn">
                Browse Cards
              </a>
            </div>
            <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--theme-textMuted)" }}>
              <p>Need to reset? <a href="/favourites?reset=true" style={{ color: "var(--theme-primary)" }}>Clear stored user data</a></p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Favourites - Planeswalker's Primer">
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
            {currentUser && !loading && (
              <p className="card-count">
                {favourites.length} {favourites.length === 1 ? "card" : "cards"}{" "}
                saved
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <Loading message="Loading your favourites..." size="large" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error text-center mt-2 mb-2">
            <h3 className="mb-2">Unable to Load Favourites</h3>
            <p className="mb-3">{error}</p>
            <button
              onClick={() => currentUser && fetchFavourites(currentUser.id)}
              className="btn"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Search and Filter Controls */}
        {!loading && !error && currentUser && favourites.length > 0 && (
          <div className="card mb-3">
            {/* Search within results */}
            <div className="form-group">
              <div className="search-results-header-combined">
                <h3 className="search-results-title">
                  ⭐ Your Favourites - Found {favourites.length} cards
                </h3>
                <p className="search-results-query">Your saved collection</p>
                {filteredAndSortedResults.length > resultsPerPage && (
                  <p className="pagination-info">
                    Page {currentPage} of {totalPages} ({startIndex + 1}-
                    {Math.min(
                      startIndex + resultsPerPage,
                      filteredAndSortedResults.length,
                    )}{" "}
                    of {filteredAndSortedResults.length} results)
                  </p>
                )}
                <label className="form-label">Filter favourites:</label>
              </div>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter by card name, text, notes, or type..."
                className="search-input"
              />
            </div>

            {/* Filters */}
            <div className="filters-grid">
              {/* Sort By */}
              <div className="form-group">
                <label className="form-label">📊 Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="mana-cost">Mana Cost</option>
                  <option value="rarity">Rarity</option>
                  <option value="type">Ability Type</option>
                </select>
              </div>

              {/* Filter By Type */}
              <div className="form-group">
                <label className="form-label">🎯 Filter By</label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Cards ({favourites.length})</option>
                  {abilityTypes.map((type) => {
                    const count = favourites.filter(
                      (card) => card.ability_type === type,
                    ).length;
                    return (
                      <option key={type} value={`type-${type}`}>
                        {type} ({count})
                      </option>
                    );
                  })}
                  {rarities.map((rarity) => {
                    const count = favourites.filter(
                      (card) => card.rarity === rarity,
                    ).length;
                    return (
                      <option key={rarity} value={`rarity-${rarity}`}>
                        {rarity.charAt(0).toUpperCase() + rarity.slice(1)} (
                        {count})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchFilter || filterBy !== "all" || sortBy !== "newest") && (
              <div className="filter-clear-section">
                <button
                  onClick={() => {
                    setSearchFilter("");
                    setFilterBy("all");
                    setSortBy("newest");
                  }}
                  className="btn btn-secondary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Show filtered results info if applicable */}
        {!loading &&
          !error &&
          filteredAndSortedResults.length !== favourites.length &&
          favourites.length > 0 && (
            <div className="card mb-2">
              <p className="search-results-filtered">
                Showing {filteredAndSortedResults.length} filtered results
                {searchFilter && ` matching "${searchFilter}"`}
              </p>
            </div>
          )}

        {/* Results */}
        {!loading && !error && currentUser && (
          <>
            {favourites.length === 0 ? (
              <div className="search-empty-state card">
                <div className="search-empty-icon">⭐</div>
                <h3 className="search-empty-title">No Favourites Yet</h3>
                <div className="search-empty-content">
                  <p className="search-empty-subtitle">
                    Start building your collection by searching for cards and
                    clicking the ⭐ button!
                  </p>
                  <div className="mt-3">
                    <a href="/search" className="btn">
                      🔍 Search for Cards
                    </a>
                  </div>
                </div>
              </div>
            ) : filteredAndSortedResults.length === 0 ? (
              <div className="search-empty-state card">
                <div className="search-empty-icon">🔍</div>
                <h3 className="search-empty-title">No matches found</h3>
                <p className="search-empty-subtitle">
                  Try adjusting your search or filter settings.
                </p>
              </div>
            ) : (
              <div>
                {/* Results Grid */}
                <div className="cards-grid">
                  {paginatedResults.map((card, index) => (
                    <div
                      key={card.favourite_id || card.id}
                      className={`fade-in fade-in-delay-${Math.min(index + 1, 5)}`}
                    >
                      <SearchCard
                        card={card}
                        currentUser={currentUser}
                        onRemoveFavourite={handleRemoveFavourite}
                        showFavouriteButton={true}
                        isFavourite={true}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pagination-controls card">
                    <div className="pagination-buttons">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="btn btn-secondary pagination-btn"
                      >
                        First
                      </button>
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-secondary pagination-btn"
                      >
                        Previous
                      </button>

                      {/* Page numbers */}
                      <div className="page-numbers">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`btn ${currentPage === pageNum ? "btn-primary" : "btn-secondary"} pagination-btn`}
                              >
                                {pageNum}
                              </button>
                            );
                          },
                        )}
                      </div>

                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary pagination-btn"
                      >
                        Next
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary pagination-btn"
                      >
                        Last
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Help Section */}
        {!loading && currentUser && favourites.length === 0 && !error && (
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
