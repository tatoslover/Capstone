import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout/Layout";
import UserSelector from "../components/User/UserSelector";
import Loading from "../components/UI/Loading";
import { MechanicsList } from "../components/Mechanics";

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMechanic, setSelectedMechanic] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

  const handleMechanicSelect = (mechanic) => {
    setSelectedMechanic(mechanic);
  };

  const [selectedPhase, setSelectedPhase] = useState(null);
  const [selectedGameMode, setSelectedGameMode] = useState(null);

  const phaseInfo = {
    beginning: {
      title: "Beginning Phase",
      content: (
        <div>
          <p><strong>Untap Step:</strong> You untap all your tapped permanents. No player can cast spells or activate abilities here.</p>
          <p><strong>Upkeep Step:</strong> A chance for upkeep costs, triggers, or effects. Players can cast instants and activate abilities.</p>
          <p><strong>Draw Step:</strong> You draw a card. Players can respond after the draw.</p>
        </div>
      )
    },
    main1: {
      title: "Main Phase (Pre-Combat)",
      content: (
        <div>
          <p>You can:</p>
          <ul>
            <li>Play a land (once per turn)</li>
            <li>Cast sorcery-speed spells (creatures, sorceries, planeswalkers, artefacts, enchantments)</li>
            <li>Activate abilities</li>
          </ul>
        </div>
      )
    },
    combat: {
      title: "Combat Phase",
      content: (
        <div>
          <p>Broken into five steps:</p>
          <ul>
            <li><strong>Beginning of Combat:</strong> Triggers go on the stack. Last chance to play before attackers are declared.</li>
            <li><strong>Declare Attackers:</strong> Active player declares attackers. Creatures tap (unless they have vigilance).</li>
            <li><strong>Declare Blockers:</strong> Defending player declares blockers. Then players can cast spells or use abilities.</li>
            <li><strong>Combat Damage:</strong> Damage is assigned and dealt simultaneously (or First Strike happens, then regular damage if needed).</li>
            <li><strong>End of Combat:</strong> Post-damage effects and abilities resolve.</li>
          </ul>
        </div>
      )
    },
    main2: {
      title: "Main Phase (Post-Combat)",
      content: (
        <div>
          <p>You can do anything you could in the pre-combat main phase again — cast spells, play a land (if you haven't yet), etc.</p>
        </div>
      )
    },
    ending: {
      title: "Ending Phase",
      content: (
        <div>
          <p><strong>End Step:</strong> Triggers that happen "at end of turn" go on the stack.</p>
          <p><strong>Cleanup Step:</strong></p>
          <ul>
            <li>You discard down to your maximum hand size (usually 7).</li>
            <li>Damage is removed from creatures.</li>
            <li>"Until end of turn" effects end.</li>
          </ul>
        </div>
      )
    }
  };

  const handlePhaseClick = (phase) => {
    setSelectedPhase(selectedPhase === phase ? null : phase);
  };

  const handleGameModeClick = (mode) => {
    setSelectedGameMode(selectedGameMode === mode ? null : mode);
  };

  const gameModeInfo = {
    rotating: {
      title: "🔁 Rotating",
      content: (
        <div>
          <p style={{ marginBottom: "1rem" }}>These formats have card pools that change over time:</p>
          <ul>
            <li><strong>Standard</strong> - The most popular competitive format using cards from the most recent sets. Rotates regularly to keep the format fresh.</li>
            <li><strong>Pioneer</strong> - Cards from Return to Ravnica (2012) onward. Less powerful than Modern but more accessible.</li>
            <li><strong>Alchemy</strong> - A Standard-based digital-only format on MTG Arena with rebalanced cards and exclusive digital mechanics.</li>
            <li><strong>Historic</strong> - Another Arena-only format with a growing, curated card pool (eternal).</li>
          </ul>
        </div>
      )
    },
    eternal: {
      title: "♾️ Eternal",
      content: (
        <div>
          <p style={{ marginBottom: "1rem" }}>These don't rotate and include all legal cards back to a certain point:</p>
          <ul>
            <li><strong>Modern</strong> - Cards from 2003 onwards. Higher power level with diverse strategies and archetypes.</li>
            <li><strong>Legacy</strong> - Includes almost all cards, but with a ban list. More powerful and expensive.</li>
            <li><strong>Vintage</strong> - Includes every card ever printed, with a restricted list instead of bans.</li>
            <li><strong>Pauper</strong> - Only commons allowed. Can be surprisingly powerful and budget-friendly.</li>
          </ul>
        </div>
      )
    },
    limited: {
      title: "🧪 Limited",
      content: (
        <div>
          <p style={{ marginBottom: "1rem" }}>Where you build a deck from unopened boosters:</p>
          <ul>
            <li><strong>Sealed</strong> - Build a deck from 6 booster packs. Everyone starts on equal footing, making it ideal for tournaments and events.</li>
            <li><strong>Draft</strong> - Open card packs, pick cards, and build your deck on the spot. Great for learning new cards and testing your skills.</li>
            <li><strong>Cube Draft</strong> - Drafting a curated set of cards (a "cube") instead of regular boosters.</li>
            <li><strong>Rochester Draft</strong> - A more niche draft format where packs are opened face up.</li>
          </ul>
        </div>
      )
    },
    multiplayer: {
      title: "🎮 Casual & Multiplayer",
      content: (
        <div>
          <ul>
            <li><strong>Commander (EDH)</strong> - 100-card singleton format with a legendary creature as your commander. Perfect for casual multiplayer games.</li>
            <li><strong>Brawl</strong> - Like Commander but 60 cards and Standard-legal (for 1v1 or multiplayer).</li>
            <li><strong>Oathbreaker</strong> - Like Commander but with a Planeswalker and a Signature Spell (60-card decks).</li>
            <li><strong>Planechase</strong> - Adds oversized plane cards with global effects, used with Commander or multiplayer.</li>
            <li><strong>Archenemy</strong> - One player is the villain with scheme cards vs. a team of players.</li>
            <li><strong>Two-Headed Giant</strong> - 2v2 team format, often used in Limited events.</li>
            <li><strong>Conspiracy</strong> - Draft format with special cards that affect the draft itself.</li>
          </ul>
        </div>
      )
    },
    custom: {
      title: "🛠️ Custom & House",
      content: (
        <div>
          <p style={{ marginBottom: "1rem" }}>Often made by communities or friends:</p>
          <ul>
            <li><strong>Kitchen Table</strong> - Casual play with friends using any cards you own. No restrictions, just fun! Perfect for learning and experimenting.</li>
            <li><strong>Preconstructed Battles</strong> - Use pre-built decks against each other.</li>
            <li><strong>Highlander</strong> - One-of-a-kind deck format like Commander but without a commander.</li>
            <li><strong>Canadian Highlander</strong> - A competitive singleton format with a points system.</li>
          </ul>
        </div>
      )
    }
  };



  return (
    <Layout title="Planeswalker's Primer - MTG Rulebook for Beginners">
      <div className="container" style={{ padding: "2rem 1rem" }}>
        {/* Hero Section */}
        <div className="text-center mb-3">
          <div
            className="header-box"
            style={{ maxWidth: "800px", margin: "0 auto" }}
          >
            <h1>Welcome to Planeswalker's Primer</h1>
            <p style={{ fontSize: "1.25rem" }}>
              Your beginner-friendly guide to Magic: The Gathering mechanics and
              keywords. Learn the basics, explore cards, and save your
              favourites!
            </p>
          </div>
        </div>

        {/* What is Magic: The Gathering? */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>What is Magic: The Gathering?</h2>
          <div style={{ maxWidth: "700px", margin: "0 auto", color: "#dee2e6", lineHeight: "1.6" }}>
            <p style={{ marginBottom: "1rem" }}>
              Magic: The Gathering (MTG) is a collectible card game where players take on the role of powerful wizards called <strong>Planeswalkers</strong>.
              Each player starts with 20 life and uses a deck of spells, creatures, and other magical effects to reduce their opponent's life to zero.
            </p>
            <p style={{ marginBottom: "1rem" }}>
              Players cast spells by paying <strong>mana</strong> - magical energy that comes from lands. Different colours of mana (White, Blue, Black, Red, Green)
              represent different types of magic, each with their own strengths and strategies.
            </p>
            <p>
              The game combines strategy, deck building, and a bit of luck as you draw cards from your library and adapt to your opponent's plays.
              Ready to learn the basics? Let's start with how a turn works!
            </p>
          </div>
        </div>

        {/* The Five Colours */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>The Five Colours</h2>
          <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#adb5bd" }}>
            Learn about Magic's colour pie and what each colour represents
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "0.5rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <div style={{
              padding: "1rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚪</div>
              <h4 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>White</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.8rem" }}>TBC</p>
            </div>
            <div style={{
              padding: "1rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔵</div>
              <h4 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>Blue</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.8rem" }}>TBC</p>
            </div>
            <div style={{
              padding: "1rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚫</div>
              <h4 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>Black</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.8rem" }}>TBC</p>
            </div>
            <div style={{
              padding: "1rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔴</div>
              <h4 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>Red</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.8rem" }}>TBC</p>
            </div>
            <div style={{
              padding: "1rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🟢</div>
              <h4 style={{ color: "#ffffff", marginBottom: "0.5rem" }}>Green</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.8rem" }}>TBC</p>
            </div>
          </div>
        </div>

        {/* Card Types */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Card Types</h2>
          <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#adb5bd" }}>
            Understand the different types of cards in Magic
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>Lands</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - Provide mana</p>
            </div>
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>Creatures</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - Attack and block</p>
            </div>
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>Instants</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - Cast anytime</p>
            </div>
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>Sorceries</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - Main phase only</p>
            </div>
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>Artefacts</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - Permanent effects</p>
            </div>
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>Enchantments</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - Ongoing effects</p>
            </div>
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>Planeswalkers</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - Powerful allies</p>
            </div>
          </div>
        </div>

        {/* Turn Phases */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Turn Phases</h2>
          <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#adb5bd" }}>
            Learn the structure of a Magic turn
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "0.5rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <button
              onClick={() => handlePhaseClick('beginning')}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedPhase === 'beginning' ? "#495057" : "#343a40",
                border: `2px solid ${selectedPhase === 'beginning' ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedPhase !== 'beginning') {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedPhase !== 'beginning') {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              Beginning
            </button>
            <button
              onClick={() => handlePhaseClick('main1')}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedPhase === 'main1' ? "#495057" : "#343a40",
                border: `2px solid ${selectedPhase === 'main1' ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedPhase !== 'main1') {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedPhase !== 'main1') {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              Main 1
            </button>
            <button
              onClick={() => handlePhaseClick('combat')}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedPhase === 'combat' ? "#495057" : "#343a40",
                border: `2px solid ${selectedPhase === 'combat' ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedPhase !== 'combat') {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedPhase !== 'combat') {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              Combat
            </button>
            <button
              onClick={() => handlePhaseClick('main2')}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedPhase === 'main2' ? "#495057" : "#343a40",
                border: `2px solid ${selectedPhase === 'main2' ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedPhase !== 'main2') {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedPhase !== 'main2') {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              Main 2
            </button>
            <button
              onClick={() => handlePhaseClick('ending')}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedPhase === 'ending' ? "#495057" : "#343a40",
                border: `2px solid ${selectedPhase === 'ending' ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedPhase !== 'ending') {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedPhase !== 'ending') {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              Ending
            </button>
          </div>

          {selectedPhase && (
            <div style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h3 style={{ marginBottom: "1rem", color: "#ffffff" }}>
                {phaseInfo[selectedPhase].title}
              </h3>
              <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                {phaseInfo[selectedPhase].content}
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "1rem", color: "#adb5bd", fontSize: "0.9rem" }}>
            Click a phase to learn more
          </div>
        </div>

        {/* Card Anatomy */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Card Anatomy</h2>
          <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#adb5bd" }}>
            Learn what each part of a Magic card means
          </p>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
            background: "#495057",
            borderRadius: "0.5rem",
            border: "1px solid #6c757d"
          }}>
            <div style={{ color: "#dee2e6", textAlign: "center" }}>
              <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>📋 Card breakdown coming soon</p>
              <p style={{ fontSize: "0.9rem" }}>TBC - Mana cost, name, type line, text box, power/toughness, etc.</p>
            </div>
          </div>
        </div>

        {/* MTG Mechanics Guide */}
        <div className="card">
          <MechanicsList
            onMechanicSelect={handleMechanicSelect}
            selectedMechanic={selectedMechanic}
          />
        </div>

        {/* Game Modes */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Game Modes</h2>
          <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#adb5bd" }}>
            Discover different ways to play Magic
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "0.5rem",
              maxWidth: "800px",
              margin: "0 auto 2rem auto",
            }}
          >
            <button
              onClick={() => handleGameModeClick('rotating')}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedGameMode === 'rotating' ? "#495057" : "#343a40",
                border: `2px solid ${selectedGameMode === 'rotating' ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedGameMode !== 'rotating') {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedGameMode !== 'rotating') {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              🔁 Rotating
            </button>
            <button
              onClick={() => handleGameModeClick('eternal')}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedGameMode === 'eternal' ? "#495057" : "#343a40",
                border: `2px solid ${selectedGameMode === 'eternal' ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedGameMode !== 'eternal') {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedGameMode !== 'eternal') {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              ♾️ Eternal
            </button>
            <button
              onClick={() => handleGameModeClick('limited')}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedGameMode === 'limited' ? "#495057" : "#343a40",
                border: `2px solid ${selectedGameMode === 'limited' ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedGameMode !== 'limited') {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedGameMode !== 'limited') {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              🧪 Limited
            </button>
            <button
              onClick={() => handleGameModeClick('multiplayer')}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedGameMode === 'multiplayer' ? "#495057" : "#343a40",
                border: `2px solid ${selectedGameMode === 'multiplayer' ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedGameMode !== 'multiplayer') {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedGameMode !== 'multiplayer') {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              🎮 Casual & Multiplayer
            </button>
            <button
              onClick={() => handleGameModeClick('custom')}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedGameMode === 'custom' ? "#495057" : "#343a40",
                border: `2px solid ${selectedGameMode === 'custom' ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedGameMode !== 'custom') {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedGameMode !== 'custom') {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              🛠️ Custom & House
            </button>
          </div>

          {selectedGameMode && (
            <div style={{
              marginTop: "1rem",
              padding: "1.5rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h3 style={{ marginBottom: "1rem", color: "#ffffff" }}>
                {gameModeInfo[selectedGameMode].title}
              </h3>
              <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                {gameModeInfo[selectedGameMode].content}
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "1rem", color: "#adb5bd", fontSize: "0.9rem" }}>
            Click a category to learn more
          </div>
        </div>

        {/* Win Conditions */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Win Conditions</h2>
          <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#adb5bd" }}>
            Learn the different ways to win a game of Magic
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>❤️ Life Total</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - Reduce opponent to 0 life</p>
            </div>
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>📚 Mill</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - Opponent runs out of cards</p>
            </div>
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>☠️ Poison</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - 10 poison counters</p>
            </div>
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>⚔️ Commander Damage</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - 21 combat damage from one commander</p>
            </div>
            <div style={{
              padding: "1.25rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d"
            }}>
              <h4 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>🏆 Alternate</h4>
              <p style={{ color: "#dee2e6", fontSize: "0.9rem" }}>TBC - Special card effects</p>
            </div>
          </div>
        </div>

        {/* Basic Deck Building */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Basic Deck Building</h2>
          <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#adb5bd" }}>
            Essential rules for constructing your deck
          </p>
          <div style={{
            maxWidth: "700px",
            margin: "0 auto",
            padding: "1.5rem",
            background: "#495057",
            borderRadius: "0.5rem",
            border: "1px solid #6c757d"
          }}>
            <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
              <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>Key Rules:</h4>
              <ul style={{ marginBottom: "1.5rem" }}>
                <li>Minimum 60 cards (TBC - explain why)</li>
                <li>Maximum 4 copies of any card (except basic lands) (TBC)</li>
                <li>Include the right amount of lands (TBC - ratios)</li>
                <li>Balance your mana curve (TBC - what this means)</li>
              </ul>
              <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                TBC - More detailed deck building strategies and examples
              </p>
            </div>
          </div>
        </div>

        {/* Combat Basics */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Combat Basics</h2>
          <p style={{ textAlign: "center", marginBottom: "1.5rem", color: "#adb5bd" }}>
            How attacking and blocking works in practice
          </p>
          <div style={{
            maxWidth: "700px",
            margin: "0 auto",
            padding: "1.5rem",
            background: "#495057",
            borderRadius: "0.5rem",
            border: "1px solid #6c757d"
          }}>
            <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
              <h4 style={{ color: "#ffffff", marginBottom: "1rem" }}>Combat Concepts:</h4>
              <ul style={{ marginBottom: "1.5rem" }}>
                <li>TBC - When creatures can attack</li>
                <li>TBC - How blocking works</li>
                <li>TBC - Damage assignment</li>
                <li>TBC - Combat tricks and timing</li>
                <li>TBC - Keywords like First Strike, Trample, etc.</li>
              </ul>
              <p style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                TBC - Interactive examples and common scenarios
              </p>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <UserSelector
          onUserSelect={handleUserSelect}
          currentUser={currentUser}
        />
      </div>
    </Layout>
  );
}
