import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout/Layout";
import { CardSearch, CardList } from "../components/Card";
import Loading from "../components/UI/Loading";

export default function SearchPage() {
  const router = useRouter();
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

      // Update URL without causing a page reload
      if (router.query.q !== query) {
        router.replace(`/search?q=${encodeURIComponent(query)}`, undefined, {
          shallow: true,
        });
      }

      const response = await fetch(
        `${API_URL}/api/cards/search?q=${encodeURIComponent(query)}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          setSearchResults([]);
          setTotalResults(0);
          return;
        }
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      // Handle Scryfall API response format
      const cards = data.data || [];
      const total = data.total_cards || cards.length;

      setSearchResults(cards);
      setTotalResults(total);
      setCurrentQuery(query);

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

  const handleFavoriteToggle = async (card) => {
    if (!currentUser) {
      alert("Please create a profile first to save favorites!");
      return;
    }

    try {
      // Add card to favorites via API
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
        throw new Error(errorData.error || "Failed to add to favorites");
      }

      // Show success notification
      showNotification(`Added "${card.name}" to your favorites!`, "success");
    } catch (err) {
      console.error("Error adding to favorites:", err);
      if (err.message.includes("already exists")) {
        showNotification(
          `"${card.name}" is already in your favorites!`,
          "info",
        );
      } else {
        showNotification(
          "Failed to add to favorites. Please try again.",
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
    const colors = {
      success: "#28a745",
      error: "#dc3545",
      info: "#17a2b8",
    };

    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type]};
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

  return (
    <Layout title="Search Cards - Plansewalker's Primer">
      <div className="container" style={{ padding: "2rem 1rem" }}>
        {/* Page Header */}
        <div className="text-center mb-3">
          <h1 style={{ color: "#d4b106", marginBottom: "0.5rem" }}>
            Search Magic Cards
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#6c757d",
              marginBottom: "2rem",
            }}
          >
            Find cards by name, ability, or creature type. Use filters to narrow
            your search.
          </p>
        </div>

        {/* User Status */}
        {currentUser ? (
          <div
            style={{
              background: "#e3f2fd",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "2rem",
              border: "1px solid #bbdefb",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, color: "#1565c0" }}>
              <strong>Welcome back, {currentUser.username}!</strong>
              <span style={{ marginLeft: "0.5rem" }}>
                Click ⭐ on any card to save it to your favorites.
              </span>
            </p>
          </div>
        ) : (
          <div
            style={{
              background: "#fff3cd",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "2rem",
              border: "1px solid #ffeaa7",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, color: "#856404" }}>
              <strong>Tip:</strong>
              <a href="/" style={{ color: "#007bff", marginLeft: "0.25rem" }}>
                Create a profile
              </a>{" "}
              to save your favorite cards!
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
            <Loading message="Searching cards..." size="large" />
          )}

          {error && (
            <div
              className="error"
              style={{ textAlign: "center", margin: "2rem 0" }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>Search Error</h3>
              <p>{error}</p>
              <button
                onClick={() => {
                  setError("");
                  setHasSearched(false);
                }}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {hasSearched && !loading && !error && (
            <>
              {/* Results Summary */}
              {searchResults.length > 0 && (
                <div
                  style={{
                    background: "#f8f9fa",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    marginBottom: "1.5rem",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          color: "#495057",
                          fontSize: "1.25rem",
                        }}
                      >
                        Found {searchResults.length} cards
                        {totalResults > searchResults.length && (
                          <span
                            style={{
                              color: "#6c757d",
                              fontSize: "0.9rem",
                              marginLeft: "0.5rem",
                            }}
                          >
                            (showing first {searchResults.length} of{" "}
                            {totalResults} total)
                          </span>
                        )}
                      </h3>
                      <p
                        style={{
                          margin: "0.25rem 0 0 0",
                          color: "#6c757d",
                          fontSize: "0.9rem",
                        }}
                      >
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
                      className="btn-outline"
                      style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
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
                onFavoriteToggle={handleFavoriteToggle}
                emptyMessage={`No cards found for "${currentQuery}"`}
                showFavoriteButtons={true}
              />

              {/* Search Tips for Empty Results */}
              {searchResults.length === 0 && !loading && (
                <div
                  style={{
                    background: "#e8f4f8",
                    padding: "2rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #b8e6ff",
                    textAlign: "center",
                    marginTop: "2rem",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                    🔍
                  </div>
                  <h3 style={{ color: "#0c5460", marginBottom: "1rem" }}>
                    No cards found for "{currentQuery}"
                  </h3>
                  <div style={{ color: "#155160", lineHeight: "1.5" }}>
                    <p style={{ marginBottom: "1rem" }}>
                      Try these search tips:
                    </p>
                    <ul
                      style={{
                        textAlign: "left",
                        maxWidth: "400px",
                        margin: "0 auto",
                        paddingLeft: "1.5rem",
                      }}
                    >
                      <li>Check spelling of card names</li>
                      <li>
                        Try searching for abilities like "flying" or "trample"
                      </li>
                      <li>
                        Search for creature types like "dragon" or "angel"
                      </li>
                      <li>Use the filters above to browse by color or type</li>
                      <li>Try more general terms like "red" or "artifact"</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Welcome Message for New Visitors */}
          {!hasSearched && !loading && (
            <div
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "3rem 2rem",
                borderRadius: "1rem",
                textAlign: "center",
                marginTop: "2rem",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🃏</div>
              <h2 style={{ marginBottom: "1rem", color: "white" }}>
                Ready to Explore Magic Cards?
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "2rem",
                  opacity: 0.9,
                  maxWidth: "600px",
                  margin: "0 auto 2rem auto",
                }}
              >
                Search through thousands of Magic: The Gathering cards. Find
                cards by name, learn about abilities, or discover new
                strategies!
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                <button
                  onClick={() => handleSearch("flying")}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  ✈️ Cards with Flying
                </button>
                <button
                  onClick={() => handleSearch("dragon")}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  🐉 Find Dragons
                </button>
                <button
                  onClick={() => handleSearch("lightning")}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                  }}
                >
                  ⚡ Lightning Spells
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
