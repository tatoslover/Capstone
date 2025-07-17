import { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import UserSelector from "../components/User/UserSelector";
import Loading from "../components/UI/Loading";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [abilities, setAbilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [randomCards, setRandomCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  // Common MTG abilities for beginners
  const commonAbilities = [
    {
      name: "Flying",
      description:
        "This creature can only be blocked by creatures with flying or reach.",
      examples: "Angels, Dragons, Birds",
    },
    {
      name: "Trample",
      description:
        "If this creature would assign enough damage to its blockers to destroy them, you may have it assign the rest of its damage to the player or planeswalker it's attacking.",
      examples: "Large creatures like Beasts and Giants",
    },
    {
      name: "First Strike",
      description:
        "This creature deals combat damage before creatures without first strike.",
      examples: "Knights, Soldiers",
    },
    {
      name: "Deathtouch",
      description:
        "Any amount of damage this deals to a creature is enough to destroy it.",
      examples: "Assassins, Spiders, Snakes",
    },
    {
      name: "Lifelink",
      description:
        "Damage dealt by this creature also causes you to gain that much life.",
      examples: "Angels, Clerics, Vampires",
    },
    {
      name: "Vigilance",
      description: "Attacking doesn't cause this creature to tap.",
      examples: "Vigilant creatures, Guards",
    },
    {
      name: "Haste",
      description:
        "This creature can attack and tap as soon as it comes under your control.",
      examples: "Goblins, Dragons, Lightning creatures",
    },
    {
      name: "Hexproof",
      description:
        "This creature can't be the target of spells or abilities your opponents control.",
      examples: "Elusive creatures, Spirits",
    },
  ];

  useEffect(() => {
    setAbilities(commonAbilities);
  }, []);

  const handleUserSelect = (user) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  };

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

  const fetchRandomCards = async (ability) => {
    if (!ability) return;

    try {
      setLoadingCards(true);
      const response = await fetch(
        `${API_URL}/api/cards/random?ability=${encodeURIComponent(ability.name.toLowerCase())}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch cards");
      }

      const data = await response.json();
      setRandomCards(data.data || []);
    } catch (error) {
      console.error("Error fetching random cards:", error);
      setRandomCards([]);
    } finally {
      setLoadingCards(false);
    }
  };

  const handleAbilityClick = (ability) => {
    setSelectedAbility(ability);
    fetchRandomCards(ability);
  };

  return (
    <Layout title="Plansewalker's Primer - MTG Rulebook for Beginners">
      <div className="container" style={{ padding: "2rem 1rem" }}>
        {/* Hero Section */}
        <div className="text-center mb-3">
          <h1 style={{ color: "#d4b106", marginBottom: "1rem" }}>
            Welcome to Plansewalker's Primer
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#6c757d",
              maxWidth: "600px",
              margin: "0 auto 2rem auto",
            }}
          >
            Your beginner-friendly guide to Magic: The Gathering abilities and
            keywords. Learn the basics, explore cards, and save your favorites!
          </p>
        </div>

        {/* User Management Section */}
        <UserSelector
          onUserSelect={handleUserSelect}
          currentUser={currentUser}
        />

        {/* MTG Abilities Guide */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Common MTG Abilities</h2>
            <p className="card-subtitle">
              Click on any ability to learn more and see example cards
            </p>
          </div>

          {/* Abilities Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {abilities.map((ability, index) => (
              <div
                key={index}
                onClick={() => handleAbilityClick(ability)}
                style={{
                  padding: "1.5rem",
                  border:
                    selectedAbility?.name === ability.name
                      ? "2px solid #007bff"
                      : "1px solid #dee2e6",
                  borderRadius: "0.75rem",
                  background:
                    selectedAbility?.name === ability.name
                      ? "#f8f9fa"
                      : "white",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
                onMouseOver={(e) => {
                  if (selectedAbility?.name !== ability.name) {
                    e.currentTarget.style.borderColor = "#007bff";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0,0,0,0.1)";
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedAbility?.name !== ability.name) {
                    e.currentTarget.style.borderColor = "#dee2e6";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 2px 4px rgba(0,0,0,0.05)";
                  }
                }}
              >
                <h3
                  style={{
                    color: "#d4b106",
                    marginBottom: "0.75rem",
                    fontSize: "1.25rem",
                    fontWeight: "700",
                  }}
                >
                  {ability.name}
                </h3>
                <p
                  style={{
                    marginBottom: "0.75rem",
                    lineHeight: "1.5",
                    color: "#495057",
                  }}
                >
                  {ability.description}
                </p>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#6c757d",
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  <strong>Common in:</strong> {ability.examples}
                </p>
              </div>
            ))}
          </div>

          {/* Selected Ability Details */}
          {selectedAbility && (
            <div
              style={{
                background: "#e3f2fd",
                padding: "1.5rem",
                borderRadius: "0.75rem",
                border: "1px solid #bbdefb",
              }}
            >
              <h3
                style={{
                  color: "#1565c0",
                  marginBottom: "1rem",
                  fontSize: "1.5rem",
                }}
              >
                {selectedAbility.name} - Example Cards
              </h3>

              {loadingCards ? (
                <Loading message="Finding example cards..." />
              ) : randomCards.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "1rem",
                  }}
                >
                  {randomCards.slice(0, 6).map((card, index) => (
                    <div
                      key={index}
                      className="mtg-card"
                      style={{ padding: "1rem" }}
                    >
                      <div className="mtg-card-name">{card.name}</div>
                      {card.mana_cost && (
                        <div className="mtg-mana-cost">{card.mana_cost}</div>
                      )}
                      <div className="mtg-card-type">{card.type_line}</div>
                      {card.oracle_text && (
                        <div className="mtg-card-text">{card.oracle_text}</div>
                      )}
                      {card.power && card.toughness && (
                        <div
                          style={{
                            fontWeight: "bold",
                            color: "#d4b106",
                            textAlign: "right",
                            fontSize: "1.1rem",
                          }}
                        >
                          {card.power}/{card.toughness}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#6c757d", fontStyle: "italic" }}>
                  No example cards found for this ability. Try searching
                  manually!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginTop: "2rem",
          }}
        >
          <div className="card text-center">
            <h3 style={{ color: "#28a745", marginBottom: "1rem" }}>
              🔍 Search Cards
            </h3>
            <p style={{ marginBottom: "1.5rem", color: "#6c757d" }}>
              Find specific Magic cards and learn about their abilities
            </p>
            <a
              href="/search"
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                background: "#28a745",
                color: "white",
                borderRadius: "0.5rem",
                textDecoration: "none",
                fontWeight: "500",
                transition: "background-color 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
            >
              Start Searching
            </a>
          </div>

          <div className="card text-center">
            <h3 style={{ color: "#ffc107", marginBottom: "1rem" }}>
              ⭐ My Favorites
            </h3>
            <p style={{ marginBottom: "1.5rem", color: "#6c757d" }}>
              {currentUser
                ? `View and manage your saved favorite cards`
                : `Create a profile to save your favorite cards`}
            </p>
            {currentUser ? (
              <a
                href="/favorites"
                style={{
                  display: "inline-block",
                  padding: "0.75rem 1.5rem",
                  background: "#ffc107",
                  color: "#212529",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  fontWeight: "500",
                  transition: "background-color 0.2s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#e0a800")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#ffc107")}
              >
                View Favorites
              </a>
            ) : (
              <button
                onClick={() =>
                  document
                    .querySelector(".card")
                    .scrollIntoView({ behavior: "smooth" })
                }
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Create Profile First
              </button>
            )}
          </div>
        </div>

        {/* Beginner Tips */}
        <div
          className="card"
          style={{ marginTop: "2rem", background: "#f8f9fa" }}
        >
          <h3 style={{ color: "#495057", marginBottom: "1rem" }}>
            💡 Tips for New Players
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div>
              <h4 style={{ color: "#007bff", marginBottom: "0.5rem" }}>
                Start with Keywords
              </h4>
              <p style={{ color: "#6c757d", margin: 0 }}>
                Focus on learning the basic keyword abilities above. They appear
                on many cards and form the foundation of MTG strategy.
              </p>
            </div>
            <div>
              <h4 style={{ color: "#007bff", marginBottom: "0.5rem" }}>
                Save Your Favorites
              </h4>
              <p style={{ color: "#6c757d", margin: 0 }}>
                Create a profile to save cards you find interesting or
                confusing. This helps you build your own reference library.
              </p>
            </div>
            <div>
              <h4 style={{ color: "#007bff", marginBottom: "0.5rem" }}>
                Practice Reading Cards
              </h4>
              <p style={{ color: "#6c757d", margin: 0 }}>
                Use the search feature to look up cards you encounter in games.
                Understanding card text is key to improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
