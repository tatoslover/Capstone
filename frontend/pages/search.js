import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout/Layout";
import { CardSearch, CardList } from "../components/Card";
import Loading from "../components/UI/Loading";
import { useTheme } from "../contexts/ThemeContext";

export default function SearchPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentQuery, setCurrentQuery] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  // Handle URL query parameters
  useEffect(() => {
    if (router.isReady && router.query.q) {
      const query = router.query.q;
      setCurrentQuery(query);
      performSearch(query);
    }
  }, [router.isReady, router.query.q]);

  const performSearch = async (query) => {
    if (!query || !query.trim()) {
      setError("Please enter a search term");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setHasSearched(true);

      let endpoint;
      let displayQuery;

      // Handle random card request
      if (query === "*") {
        endpoint = `${API_URL}/api/cards/random`;
        displayQuery = "Random Card";
      } else {
        endpoint = `${API_URL}/api/cards/search?q=${encodeURIComponent(query)}`;
        displayQuery = query;

        // Update URL without causing a page reload for regular searches
        if (router.query.q !== query) {
          router.replace(`/search?q=${encodeURIComponent(query)}`, undefined, {
            shallow: true,
          });
        }
      }

      const response = await fetch(endpoint);

      if (!response.ok) {
        if (response.status === 404) {
          setSearchResults([]);
          setTotalResults(0);
          return;
        }
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats
      let cards, total;
      if (query === "*") {
        // Random card returns a single card object
        cards = [data];
        total = 1;
      } else {
        // Regular search returns Scryfall API response format
        cards = data.data || [];
        total = data.total_cards || cards.length;
      }

      setSearchResults(cards);
      setTotalResults(total);
      setCurrentQuery(displayQuery);

      // Scroll to results on mobile
      if (cards.length > 0 && window.innerWidth <= 768) {
        setTimeout(() => {
          const resultsElement = document.getElementById("search-results");
          if (resultsElement) {
            resultsElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search cards. Please try again.");
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    performSearch(query);
  };

  const handleFavouriteToggle = async (card) => {
    if (!currentUser) {
      alert("Please create a profile first to save favourites!");
      return;
    }

    try {
      // Add card to favourites via API
      const response = await fetch(`${API_URL}/api/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          card_name: card.name,
          scryfall_id: card.id,
          ability_type: extractAbilityType(card),
          notes: "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add to favourites");
      }

      // Show success notification
      showNotification(`Added "${card.name}" to your favourites!`, "success");
    } catch (err) {
      console.error("Error adding to favourites:", err);
      if (err.message.includes("already exists")) {
        showNotification(
          `"${card.name}" is already in your favourites!`,
          "info",
        );
      } else {
        showNotification(
          "Failed to add to favourites. Please try again.",
          "error",
        );
      }
    }
  };

  // Helper function to extract ability type from card
  const extractAbilityType = (card) => {
    if (!card.oracle_text) return "";

    const abilities = [
      "Flying",
      "Trample",
      "First Strike",
      "Deathtouch",
      "Lifelink",
      "Vigilance",
      "Haste",
      "Hexproof",
    ];

    for (const ability of abilities) {
      if (card.oracle_text.toLowerCase().includes(ability.toLowerCase())) {
        return ability;
      }
    }

    return card.type_line?.split(" ")[0] || "";
  };

  // Helper function to show notifications
  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "slideIn 0.3s ease-out reverse";
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }
    }, 3000);
  };

  return (
    <Layout title="Search Cards - Planeswalker's Primer">
      <div className="container page-content">
        {/* Page Header */}
        <div className="text-center mb-3">
          <div className="header-box search-page-header">
            <h1 className="search-page-title">Search Magic Cards</h1>
            <p className="search-page-subtitle">
              Find cards by name, ability, or creature type. Use filters to
              narrow your search.
            </p>
          </div>
        </div>

        {/* User Status */}
        {currentUser && (
          <div className="user-status-panel">
            <p className="user-status-welcome">
              <strong>Welcome back, {currentUser.username}!</strong>
              <span className="user-status-text">
                Click ⭐ on any card to save it to your favourites.
              </span>
            </p>
          </div>
        )}

        {/* Search Interface */}
        <CardSearch
          onSearch={handleSearch}
          loading={loading}
          initialQuery={currentQuery}
        />

        {/* Search Results */}
        <div id="search-results">
          {loading && !hasSearched && (
            <div className="loading-container">
              <Loading message="Searching cards..." size="large" />
            </div>
          )}

          {error && (
            <div className="error search-error-section">
              <h3 className="search-error-title">Search Error</h3>
              <p className="search-error-message">{error}</p>
              <button
                onClick={() => {
                  setError("");
                  setHasSearched(false);
                }}
                className="search-error-retry"
              >
                Try Again
              </button>
            </div>
          )}

          {hasSearched && !loading && !error && (
            <>
              {/* Results Summary */}
              {searchResults.length > 0 && (
                <div className="search-results-summary">
                  <div className="search-results-header">
                    <div>
                      <h3 className="search-results-title">
                        Found {searchResults.length} cards
                        {totalResults > searchResults.length && (
                          <span className="search-results-total">
                            (showing first {searchResults.length} of{" "}
                            {totalResults} total)
                          </span>
                        )}
                      </h3>
                      <p className="search-results-query">
                        Search: "{currentQuery}"
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchResults([]);
                        setHasSearched(false);
                        setCurrentQuery("");
                        router.replace("/search", undefined, { shallow: true });
                      }}
                      className="search-new-btn"
                    >
                      New Search
                    </button>
                  </div>
                </div>
              )}

              {/* Card Results */}
              <CardList
                cards={searchResults}
                loading={loading}
                error={error}
                currentUser={currentUser}
                onFavoriteToggle={handleFavouriteToggle}
                emptyMessage={`No cards found for "${currentQuery}"`}
                showFavoriteButtons={true}
              />

              {/* Search Tips for Empty Results */}
              {searchResults.length === 0 && !loading && (
                <div className="search-empty-state">
                  <div className="search-empty-icon">🔍</div>
                  <h3 className="search-empty-title">
                    No cards found for "{currentQuery}"
                  </h3>
                  <div className="search-empty-content">
                    <p className="search-empty-subtitle">
                      Try these search tips:
                    </p>
                    <ul className="search-tips-list">
                      <li>Check spelling of card names</li>
                      <li>
                        Try searching for abilities like "flying" or "trample"
                      </li>
                      <li>
                        Search for creature types like "dragon" or "angel"
                      </li>
                      <li>Use the filters above to browse by colour or type</li>
                      <li>Try more general terms like "red" or "artifact"</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
