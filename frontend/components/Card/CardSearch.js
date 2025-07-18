import { useState, useEffect } from "react";
import Button from "../UI/Button";
import { beginnerFriendly } from "../../data/mechanics";

export default function CardSearch({
  onSearch,
  loading = false,
  initialQuery = "",
}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    colors: [],
    types: [],
    abilities: [],
    rarity: "",
    cmc: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Common MTG colors
  const colors = [
    { symbol: "W", name: "White", color: "#FFFBD5" },
    { symbol: "U", name: "Blue", color: "#0E68AB" },
    { symbol: "B", name: "Black", color: "#150B00" },
    { symbol: "R", name: "Red", color: "#D3202A" },
    { symbol: "G", name: "Green", color: "#00733E" },
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

    // Add color filters
    if (filters.colors.length > 0) {
      const colorQuery = filters.colors
        .map((color) => `c:${color.toLowerCase()}`)
        .join(" OR ");
      query += query ? ` (${colorQuery})` : `(${colorQuery})`;
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
      filters.colors.length > 0 ||
      filters.types.length > 0 ||
      filters.abilities.length > 0 ||
      filters.rarity ||
      filters.cmc
    );
  };

  const clearFilters = () => {
    setFilters({
      colors: [],
      types: [],
      abilities: [],
      rarity: "",
      cmc: "",
    });
  };

  const toggleFilter = (filterType, value) => {
    setFilters((prev) => {
      if (
        filterType === "colors" ||
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
      <div className="card-header">
        <h3 className="card-title">Search Magic Cards</h3>
        <p className="card-subtitle">
          Find cards by name, ability, or use filters to explore
        </p>
      </div>

      {/* Main Search */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <div className="form-group">
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for cards (e.g., 'Lightning Bolt', 'flying', 'dragon')..."
              style={{ flex: 1 }}
              disabled={loading}
            />
            <Button
              type="submit"
              loading={loading}
              disabled={!searchQuery.trim() && !hasActiveFilters()}
            >
              Search
            </Button>
          </div>
        </div>
      </form>

      {/* Quick Searches */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h4
          style={{
            fontSize: "1rem",
            marginBottom: "0.75rem",
            color: "#495057",
          }}
        >
          Quick Searches
        </h4>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {commonAbilities.map((ability) => (
            <button
              key={ability}
              onClick={() => {
                setSearchQuery(ability.toLowerCase());
                onSearch(`o:${ability.toLowerCase()}`);
              }}
              disabled={loading}
              style={{
                padding: "0.5rem 0.75rem",
                fontSize: "0.875rem",
                background:
                  searchQuery.toLowerCase() === ability.toLowerCase()
                    ? "#007bff"
                    : "white",
                color:
                  searchQuery.toLowerCase() === ability.toLowerCase()
                    ? "white"
                    : "#007bff",
                border: "1px solid #007bff",
                borderRadius: "0.25rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {ability}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="btn-outline"
          style={{ width: "100%", justifyContent: "center" }}
          disabled={loading}
        >
          {showAdvanced ? "▲" : "▼"} Advanced Filters
          {hasActiveFilters() && (
            <span
              style={{
                background: "#dc3545",
                color: "white",
                borderRadius: "50%",
                width: "1.25rem",
                height: "1.25rem",
                fontSize: "0.75rem",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "0.5rem",
              }}
            >
              {filters.colors.length +
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
        <div
          style={{
            background: "#f8f9fa",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #e9ecef",
          }}
        >
          {/* Colors */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h5
              style={{
                fontSize: "0.9rem",
                marginBottom: "0.75rem",
                color: "#495057",
              }}
            >
              Colors
            </h5>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {colors.map((color) => (
                <button
                  key={color.symbol}
                  onClick={() => toggleFilter("colors", color.symbol)}
                  disabled={loading}
                  style={{
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.875rem",
                    background: filters.colors.includes(color.symbol)
                      ? color.color
                      : "white",
                    color: filters.colors.includes(color.symbol)
                      ? color.symbol === "W" || color.symbol === "G"
                        ? "#000"
                        : "#fff"
                      : "#495057",
                    border: `2px solid ${color.color}`,
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {color.symbol} {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Card Types */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h5
              style={{
                fontSize: "0.9rem",
                marginBottom: "0.75rem",
                color: "#495057",
              }}
            >
              Card Types
            </h5>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {cardTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleFilter("types", type)}
                  disabled={loading}
                  style={{
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.875rem",
                    background: filters.types.includes(type)
                      ? "#28a745"
                      : "white",
                    color: filters.types.includes(type) ? "white" : "#28a745",
                    border: "1px solid #28a745",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Abilities */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h5
              style={{
                fontSize: "0.9rem",
                marginBottom: "0.75rem",
                color: "#495057",
              }}
            >
              Abilities
            </h5>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {commonAbilities.map((ability) => (
                <button
                  key={ability}
                  onClick={() => toggleFilter("abilities", ability)}
                  disabled={loading}
                  style={{
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.875rem",
                    background: filters.abilities.includes(ability)
                      ? "#ffc107"
                      : "white",
                    color: filters.abilities.includes(ability)
                      ? "#000"
                      : "#ffc107",
                    border: "1px solid #ffc107",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                  }}
                >
                  {ability}
                </button>
              ))}
            </div>
          </div>

          {/* Rarity */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h5
              style={{
                fontSize: "0.9rem",
                marginBottom: "0.75rem",
                color: "#495057",
              }}
            >
              Rarity
            </h5>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {rarities.map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => toggleFilter("rarity", rarity)}
                  disabled={loading}
                  style={{
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.875rem",
                    background: filters.rarity === rarity ? "#6f42c1" : "white",
                    color: filters.rarity === rarity ? "white" : "#6f42c1",
                    border: "1px solid #6f42c1",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                  }}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>

          {/* Converted Mana Cost */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h5
              style={{
                fontSize: "0.9rem",
                marginBottom: "0.75rem",
                color: "#495057",
              }}
            >
              Mana Cost
            </h5>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, "8+"].map((cmc) => (
                <button
                  key={cmc}
                  onClick={() =>
                    toggleFilter("cmc", cmc === "8+" ? ">=8" : cmc.toString())
                  }
                  disabled={loading}
                  style={{
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.875rem",
                    background:
                      filters.cmc === (cmc === "8+" ? ">=8" : cmc.toString())
                        ? "#17a2b8"
                        : "white",
                    color:
                      filters.cmc === (cmc === "8+" ? ">=8" : cmc.toString())
                        ? "white"
                        : "#17a2b8",
                    border: "1px solid #17a2b8",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                  }}
                >
                  {cmc}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters() && (
            <div style={{ textAlign: "center" }}>
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
