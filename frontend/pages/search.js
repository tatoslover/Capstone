import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout/Layout";
import { CardSearch } from "../components/Card";
import SearchCard from "../components/Search/SearchCard";
import Loading from "../components/UI/Loading";
import { useTheme } from "../contexts/ThemeContext";
import { apiService } from "../services/apiService";

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

  const [sortBy, setSortBy] = useState("relevance");
  const [filterBy, setFilterBy] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const resultsPerPage = 10;

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

  // Extract unique card types for filtering
  const cardTypes = useMemo(() => {
    const types = [
      ...new Set(
        searchResults
          .map((card) => {
            if (card.type_line) {
              const mainType = card.type_line
                .split("—")[0]
                .trim()
                .split(" ")[0];
              return mainType;
            }
            return null;
          })
          .filter((type) => type),
      ),
    ];
    return types.sort();
  }, [searchResults]);

  // Extract unique rarities for filtering
  const rarities = useMemo(() => {
    const rarityList = [
      ...new Set(
        searchResults.map((card) => card.rarity).filter((rarity) => rarity),
      ),
    ];
    return rarityList.sort();
  }, [searchResults]);

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...searchResults];

    // Apply search filter
    if (searchFilter.trim()) {
      const search = searchFilter.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.name.toLowerCase().includes(search) ||
          (card.oracle_text &&
            card.oracle_text.toLowerCase().includes(search)) ||
          (card.type_line && card.type_line.toLowerCase().includes(search)),
      );
    }

    // Apply type filter
    if (filterBy !== "all") {
      if (filterBy.startsWith("type-")) {
        const type = filterBy.replace("type-", "");
        filtered = filtered.filter(
          (card) =>
            card.type_line &&
            card.type_line.toLowerCase().includes(type.toLowerCase()),
        );
      } else if (filterBy.startsWith("rarity-")) {
        const rarity = filterBy.replace("rarity-", "");
        filtered = filtered.filter((card) => card.rarity === rarity);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
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
        case "relevance":
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchResults, searchFilter, filterBy, sortBy]);

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

  const performSearch = async (query) => {
    if (!query || !query.trim()) {
      setError("Please enter a search term");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setHasSearched(true);

      let data;
      let displayQuery;

      // Handle random card request
      if (query === "*") {
        data = await apiService.cards.random();
        displayQuery = "Random Card";
      } else {
        data = await apiService.cards.search(query);
        displayQuery = query;

        // Update URL without causing a page reload for regular searches
        if (router.query.q !== query) {
          router.replace(`/search?q=${encodeURIComponent(query)}`, undefined, {
            shallow: true,
          });
        }
      }

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

      // Filter out cards with incomplete essential data
      const validCards = cards.filter(card => {
        // Ensure card has essential properties for good UX
        const isValid = card &&
               card.name &&
               card.id &&
               (card.type_line || card.oracle_text || card.mana_cost);

        if (!isValid && card) {
          console.warn(`Filtering out incomplete card: ${card.name || 'Unknown'} - missing essential data`);
        }

        return isValid;
      });

      if (validCards.length < cards.length) {
        console.log(`Filtered search results: ${validCards.length}/${cards.length} cards had complete data`);
      }

      setSearchResults(validCards);
      setTotalResults(validCards.length);
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
      await apiService.favourites.create({
        user_id: currentUser.id,
        card_name: card.name,
        scryfall_id: card.id,
        ability_type: extractAbilityType(card),
        mana_cost: card.mana_cost || null,
        color_identity: card.color_identity ? card.color_identity.join('') : null,
        notes: "",
      });

      // Show success notification
      showNotification(`Added "${card.name}" to your favourites!`, "success");
    } catch (err) {
      console.error("Error adding to favourites:", err);
      if (err.message && err.message.includes("already exists")) {
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

        {/* Search Interface */}
        <CardSearch
          onSearch={handleSearch}
          loading={loading}
          initialQuery={currentQuery}
        />

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <Loading message="Searching cards..." size="large" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error text-center mt-2 mb-2">
            <h3 className="mb-2">Search Error</h3>
            <p className="mb-3">{error}</p>
            <button
              onClick={() => {
                setError("");
                setHasSearched(false);
              }}
              className="btn"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Search Results */}
        {!loading && !error && hasSearched && (
          <>
            {/* Search and Filter Controls */}
            {searchResults.length > 0 && (
              <div className="card mb-3">
                {/* Search within results */}
                <div className="form-group">
                  <div className="search-results-header-combined">
                    <h3 className="search-results-title">
                      🔍 Search Results - Found {searchResults.length} cards
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
                    <label className="form-label">Filter results:</label>
                  </div>
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filter by card name, text, or type..."
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
                      <option value="relevance">Relevance</option>
                      <option value="name">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                      <option value="mana-cost">Mana Cost</option>
                      <option value="rarity">Rarity</option>
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
                      <option value="all">
                        All Results ({searchResults.length})
                      </option>
                      {cardTypes.map((type) => {
                        const count = searchResults.filter(
                          (card) =>
                            card.type_line &&
                            card.type_line
                              .toLowerCase()
                              .includes(type.toLowerCase()),
                        ).length;
                        return (
                          <option key={type} value={`type-${type}`}>
                            {type} ({count})
                          </option>
                        );
                      })}
                      {rarities.map((rarity) => {
                        const count = searchResults.filter(
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
                {(searchFilter ||
                  filterBy !== "all" ||
                  sortBy !== "relevance") && (
                  <div className="filter-clear-section">
                    <button
                      onClick={() => {
                        setSearchFilter("");
                        setFilterBy("all");
                        setSortBy("relevance");
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
            {filteredAndSortedResults.length !== searchResults.length && (
              <div className="card mb-2">
                <p className="search-results-filtered">
                  Showing {filteredAndSortedResults.length} filtered results
                  {searchFilter && ` matching "${searchFilter}"`}
                </p>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length === 0 ? (
              <div className="search-empty-state card">
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
                    <li>Search for creature types like "dragon" or "angel"</li>
                    <li>Use the filters above to browse by colour or type</li>
                    <li>Try more general terms like "red" or "artifact"</li>
                  </ul>
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
                      key={card.id || index}
                      className={`fade-in fade-in-delay-${Math.min(index + 1, 5)}`}
                    >
                      <SearchCard
                        card={card}
                        currentUser={currentUser}
                        onFavouriteToggle={handleFavouriteToggle}
                        showFavouriteButton={true}
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
      </div>
    </Layout>
  );
}
