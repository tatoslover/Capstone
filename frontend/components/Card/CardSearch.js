import { useState, useEffect } from "react";
import Button from "../UI/Button";
import { beginnerFriendly } from "../../data/mechanics";
import { useTheme } from "../../contexts/ThemeContext";

export default function CardSearch({
  onSearch,
  loading = false,
  initialQuery = "",
}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    colours: [],
    types: [],
    abilities: [],
    rarity: "",
    cmc: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { theme } = useTheme();

  // Common MTG colours
  const colours = [
    { symbol: "W", name: "White", color: "#FFFBD5", textColor: "#000000" },
    { symbol: "U", name: "Blue", color: "#0E68AB", textColor: "#FFFFFF" },
    { symbol: "B", name: "Black", color: "#150B00", textColor: "#FFFFFF" },
    { symbol: "R", name: "Red", color: "#D3202A", textColor: "#FFFFFF" },
    { symbol: "G", name: "Green", color: "#00733E", textColor: "#FFFFFF" },
  ];

  // Common card types
  const cardTypes = [
    "Creature",
    "Instant",
    "Sorcery",
    "Enchantment",
    "Artifact",
    "Planeswalker",
    "Land",
  ];

  // Get beginner-friendly mechanics
  const commonAbilities = beginnerFriendly;

  // Rarity options
  const rarities = ["Common", "Uncommon", "Rare", "Mythic"];

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    if (!searchQuery.trim() && !hasActiveFilters()) {
      return;
    }

    // Build search query with filters
    let query = searchQuery.trim();

    // Add colour filters
    if (filters.colours.length > 0) {
      const colourQuery = filters.colours
        .map((colour) => `c:${colour.toLowerCase()}`)
        .join(" OR ");
      query += query ? ` (${colourQuery})` : `(${colourQuery})`;
    }

    // Add type filters
    if (filters.types.length > 0) {
      const typeQuery = filters.types
        .map((type) => `t:${type.toLowerCase()}`)
        .join(" OR ");
      query += query ? ` (${typeQuery})` : `(${typeQuery})`;
    }

    // Add ability filters
    if (filters.abilities.length > 0) {
      const abilityQuery = filters.abilities
        .map((ability) => `o:${ability.toLowerCase()}`)
        .join(" OR ");
      query += query ? ` (${abilityQuery})` : `(${abilityQuery})`;
    }

    // Add rarity filter
    if (filters.rarity) {
      query += query
        ? ` r:${filters.rarity.toLowerCase()}`
        : `r:${filters.rarity.toLowerCase()}`;
    }

    // Add CMC filter
    if (filters.cmc) {
      query += query ? ` cmc:${filters.cmc}` : `cmc:${filters.cmc}`;
    }

    onSearch(query || "*");
  };

  const hasActiveFilters = () => {
    return (
      filters.colours.length > 0 ||
      filters.types.length > 0 ||
      filters.abilities.length > 0 ||
      filters.rarity ||
      filters.cmc
    );
  };

  const clearFilters = () => {
    setFilters({
      colours: [],
      types: [],
      abilities: [],
      rarity: "",
      cmc: "",
    });
  };

  const toggleFilter = (filterType, value) => {
    setFilters((prev) => {
      if (
        filterType === "colours" ||
        filterType === "types" ||
        filterType === "abilities"
      ) {
        const current = prev[filterType];
        const isSelected = current.includes(value);
        return {
          ...prev,
          [filterType]: isSelected
            ? current.filter((item) => item !== value)
            : [...current, value],
        };
      } else {
        return {
          ...prev,
          [filterType]: prev[filterType] === value ? "" : value,
        };
      }
    });
  };

  // Auto-search when filters change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasActiveFilters() || searchQuery.trim()) {
        performSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="card">
      {/* Main Search */}
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <div className="search-controls">
            <div className="search-input-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cards (e.g., 'Lightning Bolt', 'flying', 'dragon')..."
                className="search-input-field"
                disabled={loading}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="search-clear-btn"
                  disabled={loading}
                >
                  ✕
                </button>
              )}
            </div>
            <Button
              type="submit"
              loading={loading}
              disabled={!searchQuery.trim() && !hasActiveFilters()}
              className="btn-primary search-btn-primary"
              aria-label="Search for MTG cards"
              title="Search for MTG cards"
            >
              🔍
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSearchQuery("Random Card");
                onSearch("*");
              }}
              loading={loading}
              className="btn-primary search-btn-primary"
            >
              🎲 Random
            </Button>
          </div>
        </div>
      </form>

      {/* Quick Searches */}
      <div className="quick-search-section">
        <h4 className="quick-search-title">Quick Searches</h4>
        <div className="quick-search-buttons">
          {commonAbilities.map((ability) => (
            <button
              key={ability}
              onClick={() => {
                setSearchQuery(ability.toLowerCase());
                onSearch(`o:${ability.toLowerCase()}`);
              }}
              disabled={loading}
              className={`quick-search-btn ${
                searchQuery.toLowerCase() === ability.toLowerCase()
                  ? "active"
                  : ""
              }`}
            >
              {ability}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="advanced-filters-toggle">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="btn-outline"
          style={{ width: "100%", justifyContent: "center" }}
          disabled={loading}
        >
          {showAdvanced ? "▲" : "▼"} Advanced Filters
          {hasActiveFilters() && (
            <span className="advanced-filters-badge">
              {filters.colours.length +
                filters.types.length +
                filters.abilities.length +
                (filters.rarity ? 1 : 0) +
                (filters.cmc ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters-panel">
          {/* Colors */}
          <div className="filter-section">
            <h4 className="filter-title">Colours</h4>
            <div className="filter-buttons">
              {colours.map((colour) => (
                <button
                  key={colour.symbol}
                  onClick={() => toggleFilter("colours", colour.symbol)}
                  disabled={loading}
                  className="filter-btn filter-btn-color"
                  style={{
                    background: filters.colours.includes(colour.symbol)
                      ? colour.color
                      : "var(--theme-cardBg)",
                    color: filters.colours.includes(colour.symbol)
                      ? colour.textColor
                      : "var(--theme-text)",
                    borderColor: colour.symbol === "B" ? "#a855f7" : colour.color,
                    borderWidth: "2px",
                    boxShadow: colour.symbol === "B" && filters.colours.includes(colour.symbol)
                      ? "0 0 0 1px #c084fc, 0 2px 4px rgba(168, 85, 247, 0.3)"
                      : colour.symbol === "B"
                      ? "0 0 0 1px #8b5cf6"
                      : "none",
                  }}
                >
                  {colour.symbol} {colour.name}
                </button>
              ))}
            </div>
          </div>

          {/* Card Types */}
          <div className="filter-section">
            <h5 className="filter-title">Card Types</h5>
            <div className="filter-buttons">
              {cardTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleFilter("types", type)}
                  disabled={loading}
                  className={`filter-btn filter-btn-type ${
                    filters.types.includes(type) ? "active" : ""
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div className="filter-section">
            <h5 className="filter-title">Abilities</h5>
            <div className="filter-buttons">
              {commonAbilities.map((ability) => (
                <button
                  key={ability}
                  onClick={() => toggleFilter("abilities", ability)}
                  disabled={loading}
                  className={`filter-btn filter-btn-ability ${
                    filters.abilities.includes(ability) ? "active" : ""
                  }`}
                >
                  {ability}
                </button>
              ))}
            </div>
          </div>

          {/* Rarity */}
          <div className="filter-section">
            <h5 className="filter-title">Rarity</h5>
            <div className="filter-buttons">
              {rarities.map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => toggleFilter("rarity", rarity)}
                  disabled={loading}
                  className={`filter-btn filter-btn-rarity ${
                    filters.rarity === rarity ? "active" : ""
                  }`}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>

          {/* Converted Mana Cost */}
          <div className="filter-section">
            <h5 className="filter-title">Mana Cost</h5>
            <div className="filter-buttons">
              {[0, 1, 2, 3, 4, 5, 6, 7, "8+"].map((cmc) => (
                <button
                  key={cmc}
                  onClick={() =>
                    toggleFilter("cmc", cmc === "8+" ? ">=8" : cmc.toString())
                  }
                  disabled={loading}
                  className={`filter-btn filter-btn-cmc ${
                    filters.cmc === (cmc === "8+" ? ">=8" : cmc.toString())
                      ? "active"
                      : ""
                  }`}
                >
                  {cmc}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters() && (
            <div className="filter-clear-section">
              <button
                onClick={clearFilters}
                className="btn-secondary"
                disabled={loading}
                style={{ fontSize: "0.875rem" }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
