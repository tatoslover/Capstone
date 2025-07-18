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
    colors: [],
    types: [],
    abilities: [],
    rarity: "",
    cmc: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { theme } = useTheme();

  // Common MTG colors
  const colors = [
    { symbol: "W", name: "White", color: "#FFFBD5", textColor: "#000000" },
    { symbol: "U", name: "Blue", color: "#0E68AB", textColor: "#FFFFFF" },
    { symbol: "B", name: "Black", color: "#9370DB", textColor: "#FFFFFF" },
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
        <h3 className="card-title" style={{ color: "var(--theme-text)" }}>
          Search Magic Cards
        </h3>
        <p
          className="card-subtitle"
          style={{ color: "var(--theme-textLight)" }}
        >
          Find cards by name, ability, or use filters to explore
        </p>
      </div>

      {/* Main Search */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem" }}>
        <div className="form-group">
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for cards (e.g., 'Lightning Bolt', 'flying', 'dragon')..."
                style={{
                  width: "100%",
                  backgroundColor: "var(--theme-cardBg)",
                  color: "var(--theme-text)",
                  border: "1px solid var(--theme-border)",
                  borderRadius: "0.375rem",
                  padding: "0.75rem 2.5rem 0.75rem 0.75rem",
                  fontSize: "1rem",
                }}
                disabled={loading}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--theme-textLight)",
                    cursor: "pointer",
                    fontSize: "1.25rem",
                    padding: "0.25rem",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "1.5rem",
                    height: "1.5rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "var(--theme-border)";
                    e.target.style.color = "var(--theme-text)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "var(--theme-textLight)";
                  }}
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
              style={{ color: "#000000" }}
            >
              Search
            </Button>
            <Button
              type="button"
              onClick={() => {
                setSearchQuery("Random Card");
                onSearch("*");
              }}
              loading={loading}
              style={{
                color: "#000000",
                backgroundColor: "var(--theme-highlight)",
                border: "1px solid var(--theme-highlight)",
              }}
            >
              🎲 Random
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
            color: "var(--theme-text)",
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
                    ? "var(--theme-accent)"
                    : "var(--theme-cardBg)",
                color:
                  searchQuery.toLowerCase() === ability.toLowerCase()
                    ? "#000000"
                    : "var(--theme-accent)",
                border: "1px solid var(--theme-accent)",
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
                background: "var(--theme-highlight)",
                color: "#000000",
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
            background: "var(--theme-secondary)",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--theme-border)",
          }}
        >
          {/* Colors */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h5
              style={{
                fontSize: "0.9rem",
                marginBottom: "0.75rem",
                color: "var(--theme-text)",
                fontWeight: "600",
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
                      : "var(--theme-cardBg)",
                    color: filters.colors.includes(color.symbol)
                      ? color.textColor
                      : "var(--theme-text)",
                    border: `2px solid ${color.color}`,
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
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
                color: "var(--theme-text)",
                fontWeight: "600",
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
                      ? "#00733E"
                      : "var(--theme-cardBg)",
                    color: filters.types.includes(type) ? "#FFFFFF" : "#00733E",
                    border: "1px solid #00733E",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
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
                color: "var(--theme-text)",
                fontWeight: "600",
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
                      ? "#FFD700"
                      : "var(--theme-cardBg)",
                    color: filters.abilities.includes(ability)
                      ? "#000000"
                      : "#FFD700",
                    border: "1px solid #FFD700",
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

          {/* Rarity */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h5
              style={{
                fontSize: "0.9rem",
                marginBottom: "0.75rem",
                color: "var(--theme-text)",
                fontWeight: "600",
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
                    background:
                      filters.rarity === rarity
                        ? "#9370DB"
                        : "var(--theme-cardBg)",
                    color: filters.rarity === rarity ? "#FFFFFF" : "#9370DB",
                    border: "1px solid #9370DB",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
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
                color: "var(--theme-text)",
                fontWeight: "600",
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
                        ? "#0E68AB"
                        : "var(--theme-cardBg)",
                    color:
                      filters.cmc === (cmc === "8+" ? ">=8" : cmc.toString())
                        ? "#FFFFFF"
                        : "#0E68AB",
                    border: "1px solid #0E68AB",
                    borderRadius: "0.25rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
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
