import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout/Layout";
import UserSelector from "../components/User/UserSelector";
import Loading from "../components/UI/Loading";

import { FilteredMechanicsList } from "../components/Mechanics";
import { CardAnatomySection } from "../components/CardAnatomy";
import gameOverview from "../data/gameOverview.json";
import colors from "../data/colors.json";
import cardTypes from "../data/cardTypes.json";
import turnPhases from "../data/turnPhases.json";
import winConditions from "../data/winConditions.json";
import combatBasics from "../data/combatBasics.json";
import deckBuilding from "../data/deckBuilding.json";
import cardAnatomy from "../data/cardAnatomy.json";

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
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedCardType, setSelectedCardType] = useState(null);

  const [selectedWinCondition, setSelectedWinCondition] = useState(null);
  const [selectedDeckType, setSelectedDeckType] = useState(null);
  const [selectedCombatStep, setSelectedCombatStep] = useState(null);

  const phaseInfo = {
    beginning: {
      title: turnPhases.phases.beginning.name,
      content: (
        <div>
          <p style={{ marginBottom: "1rem", color: "#dee2e6" }}>
            {turnPhases.phases.beginning.description}
          </p>
          {Object.values(turnPhases.phases.beginning.steps).map(
            (step, index) => (
              <div key={index} style={{ marginBottom: "0.75rem" }}>
                <p>
                  <strong>{step.name}:</strong> {step.description}
                </p>
                {step.strategicNotes && step.strategicNotes.length > 0 && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#adb5bd",
                      fontStyle: "italic",
                    }}
                  >
                    {step.strategicNotes[0]}
                  </p>
                )}
              </div>
            ),
          )}
        </div>
      ),
    },
    main1: {
      title: turnPhases.phases.main1.name,
      content: (
        <div>
          <p style={{ marginBottom: "1rem", color: "#dee2e6" }}>
            {turnPhases.phases.main1.description}
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong>You can:</strong>
          </p>
          <ul style={{ margin: "0 0 1rem 1.5rem", color: "#dee2e6" }}>
            {turnPhases.phases.main1.whatYouCanDo.map((action, index) => (
              <li key={index} style={{ marginBottom: "0.25rem" }}>
                {action}
              </li>
            ))}
          </ul>
          {turnPhases.phases.main1.tips && (
            <div
              style={{
                background: "#343a40",
                padding: "1rem",
                borderRadius: "0.375rem",
                marginTop: "1rem",
              }}
            >
              <p style={{ fontSize: "0.9rem", color: "#adb5bd", margin: "0" }}>
                <strong>Tip:</strong>{" "}
                {turnPhases.phases.main1.strategicConsiderations[0]}
              </p>
            </div>
          )}
        </div>
      ),
    },
    combat: {
      title: turnPhases.phases.combat.name,
      content: (
        <div>
          <p style={{ marginBottom: "1rem", color: "#dee2e6" }}>
            {turnPhases.phases.combat.description}
          </p>
          <p style={{ marginBottom: "0.75rem" }}>
            <strong>Combat Steps:</strong>
          </p>
          {Object.values(turnPhases.phases.combat.steps).map((step, index) => (
            <div key={index} style={{ marginBottom: "0.75rem" }}>
              <p>
                <strong>{step.name}:</strong> {step.description}
              </p>
              {step.strategicUse && step.strategicUse.length > 0 && (
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "#adb5bd",
                    fontStyle: "italic",
                    marginTop: "0.25rem",
                  }}
                >
                  {step.strategicUse[0]}
                </p>
              )}
            </div>
          ))}
        </div>
      ),
    },
    main2: {
      title: turnPhases.phases.main2.name,
      content: (
        <div>
          <p style={{ marginBottom: "1rem", color: "#dee2e6" }}>
            {turnPhases.phases.main2.description}
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong>You can:</strong>
          </p>
          <ul style={{ margin: "0 0 1rem 1.5rem", color: "#dee2e6" }}>
            {turnPhases.phases.main2.commonActions.map((action, index) => (
              <li key={index} style={{ marginBottom: "0.25rem" }}>
                {action}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    ending: {
      title: turnPhases.phases.ending.name,
      content: (
        <div>
          <p style={{ marginBottom: "1rem", color: "#dee2e6" }}>
            {turnPhases.phases.ending.description}
          </p>
          {Object.values(turnPhases.phases.ending.steps).map((step, index) => (
            <div key={index} style={{ marginBottom: "0.75rem" }}>
              <p>
                <strong>{step.name}:</strong> {step.description}
              </p>
              {step.automaticActions && (
                <ul style={{ margin: "0.5rem 0 0 1.5rem", color: "#dee2e6" }}>
                  {step.automaticActions.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
              {step.commonTriggers && (
                <ul style={{ margin: "0.5rem 0 0 1.5rem", color: "#dee2e6" }}>
                  {step.commonTriggers.map((detail, detailIndex) => (
                    <li
                      key={detailIndex}
                      style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ),
    },
  };

  const gameModeInfo = {
    rotating: {
      title: "🔁 Rotating",
      content: (
        <div>
          <p style={{ marginBottom: "1rem" }}>
            These formats have card pools that change over time:
          </p>
          <ul>
            <li>
              <strong>Standard</strong> - The most popular competitive format
              using cards from the most recent sets. Rotates regularly to keep
              the format fresh.
            </li>
            <li>
              <strong>Pioneer</strong> - Cards from Return to Ravnica (2012)
              onward. Less powerful than Modern but more accessible.
            </li>
            <li>
              <strong>Alchemy</strong> - A Standard-based digital-only format on
              MTG Arena with rebalanced cards and exclusive digital mechanics.
            </li>
            <li>
              <strong>Historic</strong> - Another Arena-only format with a
              growing, curated card pool (eternal).
            </li>
          </ul>
        </div>
      ),
    },
    eternal: {
      title: "♾️ Eternal",
      content: (
        <div>
          <p style={{ marginBottom: "1rem" }}>
            These don't rotate and include all legal cards back to a certain
            point:
          </p>
          <ul>
            <li>
              <strong>Modern</strong> - Cards from 2003 onwards. Higher power
              level with diverse strategies and archetypes.
            </li>
            <li>
              <strong>Legacy</strong> - Includes almost all cards, but with a
              ban list. More powerful and expensive.
            </li>
            <li>
              <strong>Vintage</strong> - Includes every card ever printed, with
              a restricted list instead of bans.
            </li>
            <li>
              <strong>Pauper</strong> - Only commons allowed. Can be
              surprisingly powerful and budget-friendly.
            </li>
          </ul>
        </div>
      ),
    },
    limited: {
      title: "🧪 Limited",
      content: (
        <div>
          <p style={{ marginBottom: "1rem" }}>
            Where you build a deck from unopened boosters:
          </p>
          <ul>
            <li>
              <strong>Sealed</strong> - Build a deck from 6 booster packs.
              Everyone starts on equal footing, making it ideal for tournaments
              and events.
            </li>
            <li>
              <strong>Draft</strong> - Open card packs, pick cards, and build
              your deck on the spot. Great for learning new cards and testing
              your skills.
            </li>
            <li>
              <strong>Cube Draft</strong> - Drafting a curated set of cards (a
              "cube") instead of regular boosters.
            </li>
            <li>
              <strong>Rochester Draft</strong> - A more niche draft format where
              packs are opened face up.
            </li>
          </ul>
        </div>
      ),
    },
    multiplayer: {
      title: "🎮 Casual & Multiplayer",
      content: (
        <div>
          <ul>
            <li>
              <strong>Commander (EDH)</strong> - 100-card singleton format with
              a legendary creature as your commander. Perfect for casual
              multiplayer games.
            </li>
            <li>
              <strong>Brawl</strong> - Like Commander but 60 cards and
              Standard-legal (for 1v1 or multiplayer).
            </li>
            <li>
              <strong>Oathbreaker</strong> - Like Commander but with a
              Planeswalker and a Signature Spell (60-card decks).
            </li>
            <li>
              <strong>Planechase</strong> - Adds oversized plane cards with
              global effects, used with Commander or multiplayer.
            </li>
            <li>
              <strong>Archenemy</strong> - One player is the villain with scheme
              cards vs. a team of players.
            </li>
            <li>
              <strong>Two-Headed Giant</strong> - 2v2 team format, often used in
              Limited events.
            </li>
            <li>
              <strong>Conspiracy</strong> - Draft format with special cards that
              affect the draft itself.
            </li>
          </ul>
        </div>
      ),
    },
    custom: {
      title: "🛠️ Custom & House",
      content: (
        <div>
          <p style={{ marginBottom: "1rem" }}>
            Often made by communities or friends:
          </p>
          <ul>
            <li>
              <strong>Kitchen Table</strong> - Casual play with friends using
              any cards you own. No restrictions, just fun! Perfect for learning
              and experimenting.
            </li>
            <li>
              <strong>Preconstructed Battles</strong> - Use pre-built decks
              against each other.
            </li>
            <li>
              <strong>Highlander</strong> - One-of-a-kind deck format like
              Commander but without a commander.
            </li>
            <li>
              <strong>Canadian Highlander</strong> - A competitive singleton
              format with a points system.
            </li>
          </ul>
        </div>
      ),
    },
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
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            {gameOverview.introduction.title}
          </h2>
          <div
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              color: "#dee2e6",
              lineHeight: "1.6",
            }}
          >
            <p
              style={{
                marginBottom: "1rem",
                fontSize: "1.1rem",
                fontWeight: "500",
                color: "#ffffff",
              }}
            >
              {gameOverview.introduction.tagline}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              {gameOverview.introduction.description.replace(
                /\[\d+\](\[\d+\])*/g,
                "",
              )}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              {gameOverview.coreGameplay.overview.replace(
                /\[\d+\](\[\d+\])*/g,
                "",
              )}
            </p>
            <p style={{ marginBottom: "1.5rem" }}>
              {gameOverview.coreGameplay.gameFlow.replace(
                /\[\d+\](\[\d+\])*/g,
                "",
              )}
            </p>

            {/* Game Basics */}
            <div
              style={{
                background: "#343a40",
                padding: "1.5rem",
                borderRadius: "0.5rem",
                marginBottom: "1.5rem",
                border: "1px solid #495057",
              }}
            >
              <h3
                style={{
                  color: "#ffffff",
                  marginBottom: "1rem",
                  textAlign: "center",
                }}
              >
                Game Basics
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                <div>
                  <strong style={{ color: "#ffffff" }}>Players:</strong>{" "}
                  {gameOverview.basics.players}
                </div>
                <div>
                  <strong style={{ color: "#ffffff" }}>Game Length:</strong>{" "}
                  {gameOverview.basics.gameLength}
                </div>
                <div>
                  <strong style={{ color: "#ffffff" }}>Age Range:</strong>{" "}
                  {gameOverview.basics.ageRange}
                </div>
                <div>
                  <strong style={{ color: "#ffffff" }}>Skills:</strong>{" "}
                  {gameOverview.basics.skillTypes}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Five Colours */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            The Six Colours
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#adb5bd",
            }}
          >
            Learn about Magic's colour pie and what each colour represents
          </p>
          <div
            className="section-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gap: "0.5rem",
              maxWidth: "700px",
              margin: "0 auto 2rem auto",
            }}
          >
            {Object.entries(colors).map(([colorKey, colorData]) => (
              <button
                key={colorKey}
                onClick={() =>
                  setSelectedColor(selectedColor === colorKey ? null : colorKey)
                }
                className={`section-button ${selectedColor === colorKey ? "active" : ""}`}
              >
                <span style={{ fontSize: "1.5rem" }}>{colorData.emoji}</span>
                <span>{colorData.name}</span>
              </button>
            ))}
          </div>

          {selectedColor && (
            <div
              className="section-content"
              style={{
                padding: "1.5rem",
                background: "#495057",
                borderRadius: "0.5rem",
                border: "1px solid #6c757d",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h3
                style={{
                  marginBottom: "1rem",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {colors[selectedColor].name}
              </h3>
              <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
                  {colors[selectedColor].description}
                </p>
                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#ffffff" }}>Philosophy: </strong>
                  <em style={{ color: "#adb5bd" }}>
                    {colors[selectedColor].philosophy}
                  </em>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#ffffff" }}>Strengths: </strong>
                  {colors[selectedColor].strengths.join(", ")}
                </div>
                <div>
                  <strong style={{ color: "#ffffff" }}>Key Mechanics: </strong>
                  {colors[selectedColor].mechanics.join(", ")}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card Types */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            Card Types
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#adb5bd",
            }}
          >
            Understand the different types of cards in Magic
          </p>
          <div
            className="section-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "0.5rem",
              maxWidth: "800px",
              margin: "0 auto 2rem auto",
            }}
          >
            {Object.entries(cardTypes).map(([typeKey, typeData]) => (
              <button
                key={typeKey}
                onClick={() =>
                  setSelectedCardType(
                    selectedCardType === typeKey ? null : typeKey,
                  )
                }
                className={`section-button ${selectedCardType === typeKey ? "active" : ""}`}
              >
                <span style={{ fontSize: "1.5rem" }}>{typeData.icon}</span>
                <span>{typeData.name}</span>
              </button>
            ))}
          </div>

          {selectedCardType && (
            <div
              className="section-content"
              style={{
                padding: "1.5rem",
                background: "#495057",
                borderRadius: "0.5rem",
                border: "1px solid #6c757d",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h3
                style={{
                  marginBottom: "1rem",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {cardTypes[selectedCardType].name}
              </h3>
              <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
                  {cardTypes[selectedCardType].description}
                </p>
                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#ffffff" }}>Timing: </strong>
                  {cardTypes[selectedCardType].timing}
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#ffffff" }}>Usage: </strong>
                  {cardTypes[selectedCardType].usage}
                </div>
                {cardTypes[selectedCardType].examples && (
                  <div>
                    <strong style={{ color: "#ffffff" }}>Examples: </strong>
                    {cardTypes[selectedCardType].examples.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Turn Phases */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            Turn Phases
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#adb5bd",
            }}
          >
            Learn the structure of a Magic turn
          </p>
          <div
            className="section-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "0.5rem",
              maxWidth: "600px",
              margin: "0 auto 2rem auto",
            }}
          >
            <button
              onClick={() =>
                setSelectedPhase(
                  selectedPhase === "beginning" ? null : "beginning",
                )
              }
              className={`section-button ${selectedPhase === "beginning" ? "active" : ""}`}
            >
              <span style={{ fontSize: "1.5rem" }}>🌅</span>
              <span>Beginning</span>
            </button>
            <button
              onClick={() =>
                setSelectedPhase(selectedPhase === "main1" ? null : "main1")
              }
              className={`section-button ${selectedPhase === "main1" ? "active" : ""}`}
            >
              <span style={{ fontSize: "1.5rem" }}>🏗️</span>
              <span>Main 1</span>
            </button>
            <button
              onClick={() =>
                setSelectedPhase(selectedPhase === "combat" ? null : "combat")
              }
              className={`section-button ${selectedPhase === "combat" ? "active" : ""}`}
            >
              <span style={{ fontSize: "1.5rem" }}>⚔️</span>
              <span>Combat</span>
            </button>
            <button
              onClick={() =>
                setSelectedPhase(selectedPhase === "main2" ? null : "main2")
              }
              className={`section-button ${selectedPhase === "main2" ? "active" : ""}`}
            >
              <span style={{ fontSize: "1.5rem" }}>🏛️</span>
              <span>Main 2</span>
            </button>
            <button
              onClick={() =>
                setSelectedPhase(selectedPhase === "ending" ? null : "ending")
              }
              className={`section-button ${selectedPhase === "ending" ? "active" : ""}`}
            >
              <span style={{ fontSize: "1.5rem" }}>🌙</span>
              <span>Ending</span>
            </button>
          </div>

          {selectedPhase && (
            <div
              className="section-content"
              style={{
                padding: "1.5rem",
                background: "#495057",
                borderRadius: "0.5rem",
                border: "1px solid #6c757d",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h3
                style={{
                  marginBottom: "1rem",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {phaseInfo[selectedPhase].title}
              </h3>
              <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                {phaseInfo[selectedPhase].content}
              </div>
            </div>
          )}
        </div>

        {/* Card Anatomy */}
        <CardAnatomySection cardAnatomyData={cardAnatomy} />

        {/* Mechanics Guide */}
        <FilteredMechanicsList
          onMechanicSelect={handleMechanicSelect}
          selectedMechanic={selectedMechanic}
        />

        {/* Game Modes */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            Game Modes
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#adb5bd",
            }}
          >
            Discover different ways to play Magic
          </p>
          <div
            className="section-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "0.5rem",
              maxWidth: "800px",
              margin: "0 auto 2rem auto",
            }}
          >
            <button
              onClick={() =>
                setSelectedGameMode(
                  selectedGameMode === "rotating" ? null : "rotating",
                )
              }
              className={`section-button ${selectedGameMode === "rotating" ? "active" : ""}`}
            >
              <span style={{ fontSize: "1.5rem" }}>🔁</span>
              <span>Rotating</span>
            </button>
            <button
              onClick={() =>
                setSelectedGameMode(
                  selectedGameMode === "eternal" ? null : "eternal",
                )
              }
              className={`section-button ${selectedGameMode === "eternal" ? "active" : ""}`}
            >
              <span style={{ fontSize: "1.5rem" }}>♾️</span>
              <span>Eternal</span>
            </button>
            <button
              onClick={() =>
                setSelectedGameMode(
                  selectedGameMode === "limited" ? null : "limited",
                )
              }
              className={`section-button ${selectedGameMode === "limited" ? "active" : ""}`}
            >
              <span style={{ fontSize: "1.5rem" }}>🧪</span>
              <span>Limited</span>
            </button>
            <button
              onClick={() =>
                setSelectedGameMode(
                  selectedGameMode === "multiplayer" ? null : "multiplayer",
                )
              }
              className={`section-button ${selectedGameMode === "multiplayer" ? "active" : ""}`}
            >
              <span style={{ fontSize: "1.5rem" }}>🎮</span>
              <span>Casual & Multiplayer</span>
            </button>
            <button
              onClick={() =>
                setSelectedGameMode(
                  selectedGameMode === "custom" ? null : "custom",
                )
              }
              className={`section-button ${selectedGameMode === "custom" ? "active" : ""}`}
            >
              <span style={{ fontSize: "1.5rem" }}>🛠️</span>
              <span>Custom & House</span>
            </button>
          </div>

          {selectedGameMode && (
            <div
              className="section-content"
              style={{
                padding: "1.5rem",
                background: "#495057",
                borderRadius: "0.5rem",
                border: "1px solid #6c757d",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#ffffff" }}>
                {gameModeInfo[selectedGameMode].title}
              </h3>
              <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                {gameModeInfo[selectedGameMode].content}
              </div>
            </div>
          )}
        </div>

        {/* Win Conditions */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            Win Conditions
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#adb5bd",
            }}
          >
            Learn the different ways to win a game of Magic
          </p>
          <div
            className="section-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "0.5rem",
              maxWidth: "800px",
              margin: "0 auto 2rem auto",
            }}
          >
            {Object.entries({
              ...winConditions.primaryWinConditions,
              ...winConditions.alternativeWinConditions,
            }).map(([conditionKey, condition]) => (
              <button
                key={conditionKey}
                onClick={() =>
                  setSelectedWinCondition(
                    selectedWinCondition === conditionKey ? null : conditionKey,
                  )
                }
                className={`section-button ${selectedWinCondition === conditionKey ? "active" : ""}`}
              >
                <span style={{ fontSize: "1.5rem" }}>{condition.emoji}</span>
                <span>{condition.name}</span>
              </button>
            ))}
          </div>

          {selectedWinCondition && (
            <div
              className="section-content"
              style={{
                padding: "1.5rem",
                background: "#495057",
                borderRadius: "0.5rem",
                border: "1px solid #6c757d",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h3
                style={{
                  marginBottom: "1rem",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {
                  (
                    winConditions.primaryWinConditions[selectedWinCondition] ||
                    winConditions.alternativeWinConditions[selectedWinCondition]
                  ).name
                }
              </h3>
              <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
                  {
                    (
                      winConditions.primaryWinConditions[
                        selectedWinCondition
                      ] ||
                      winConditions.alternativeWinConditions[
                        selectedWinCondition
                      ]
                    ).description
                  }
                </p>
                <p style={{ marginBottom: "1rem", color: "#adb5bd" }}>
                  {
                    (
                      winConditions.primaryWinConditions[
                        selectedWinCondition
                      ] ||
                      winConditions.alternativeWinConditions[
                        selectedWinCondition
                      ]
                    ).explanation
                  }
                </p>
                {(
                  winConditions.primaryWinConditions[selectedWinCondition] ||
                  winConditions.alternativeWinConditions[selectedWinCondition]
                ).tips && (
                  <div>
                    <strong style={{ color: "#ffffff" }}>Tips: </strong>
                    <ul style={{ margin: "0.5rem 0 0 1rem", padding: "0" }}>
                      {(
                        winConditions.primaryWinConditions[
                          selectedWinCondition
                        ] ||
                        winConditions.alternativeWinConditions[
                          selectedWinCondition
                        ]
                      ).tips.map((tip, index) => (
                        <li key={index} style={{ marginBottom: "0.25rem" }}>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Deck Building Fundamentals */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            Deck Building Fundamentals
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#adb5bd",
            }}
          >
            Essential rules and principles for constructing your deck
          </p>

          <div
            className="section-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "0.5rem",
              maxWidth: "800px",
              margin: "0 auto 2rem auto",
            }}
          >
            {Object.entries(deckBuilding.deckTypes).map(
              ([typeKey, deckType]) => {
                const emojiMap = {
                  aggro: "⚡",
                  control: "🛡️",
                  midrange: "⚖️",
                  combo: "🔗",
                };
                return (
                  <button
                    key={typeKey}
                    onClick={() =>
                      setSelectedDeckType(
                        selectedDeckType === typeKey ? null : typeKey,
                      )
                    }
                    className={`section-button ${selectedDeckType === typeKey ? "active" : ""}`}
                  >
                    <span style={{ fontSize: "1.5rem" }}>
                      {emojiMap[typeKey]}
                    </span>
                    <span>{deckType.name}</span>
                  </button>
                );
              },
            )}
          </div>

          {selectedDeckType && (
            <div
              className="section-content"
              style={{
                padding: "1.5rem",
                background: "#495057",
                borderRadius: "0.5rem",
                border: "1px solid #6c757d",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h3
                style={{
                  marginBottom: "1rem",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {deckBuilding.deckTypes[selectedDeckType].name}
              </h3>
              <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
                  {deckBuilding.deckTypes[selectedDeckType].description}
                </p>
                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "#ffffff" }}>
                    Key Characteristics:
                  </strong>
                  <ul style={{ margin: "0.5rem 0 0 1rem", padding: "0" }}>
                    {deckBuilding.deckTypes[
                      selectedDeckType
                    ].characteristics.map((characteristic, index) => (
                      <li key={index} style={{ marginBottom: "0.25rem" }}>
                        {characteristic}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong style={{ color: "#ffffff" }}>Tip: </strong>
                  <em style={{ color: "#adb5bd" }}>
                    {deckBuilding.deckTypes[selectedDeckType].tips}
                  </em>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Combat Basics */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            {combatBasics.combatOverview.title}
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#adb5bd",
            }}
          >
            {combatBasics.combatOverview.description}
          </p>
          <div
            className="section-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "0.5rem",
              maxWidth: "800px",
              margin: "0 auto 2rem auto",
            }}
          >
            {Object.entries(combatBasics.combatSteps).map(([stepKey, step]) => {
              const emojiMap = {
                beginningOfCombat: "🌅",
                declareAttackers: "🏃",
                declareBlockers: "🛡️",
                combatDamage: "💥",
                endOfCombat: "🏁",
              };
              return (
                <button
                  key={stepKey}
                  onClick={() =>
                    setSelectedCombatStep(
                      selectedCombatStep === stepKey ? null : stepKey,
                    )
                  }
                  className={`section-button ${selectedCombatStep === stepKey ? "active" : ""}`}
                >
                  <span style={{ fontSize: "1.5rem" }}>
                    {emojiMap[stepKey]}
                  </span>
                  <span>{step.name}</span>
                </button>
              );
            })}
          </div>

          {selectedCombatStep && (
            <div
              className="section-content"
              style={{
                padding: "1.5rem",
                background: "#495057",
                borderRadius: "0.5rem",
                border: "1px solid #6c757d",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              <h3
                style={{
                  marginBottom: "1rem",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {combatBasics.combatSteps[selectedCombatStep].name}
              </h3>
              <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
                  {combatBasics.combatSteps[selectedCombatStep].description}
                </p>
                <div>
                  <strong style={{ color: "#ffffff" }}>What Happens: </strong>
                  <ul style={{ margin: "0.5rem 0 0 1rem", padding: "0" }}>
                    {combatBasics.combatSteps[
                      selectedCombatStep
                    ].whatHappens.map((point, index) => (
                      <li key={index} style={{ marginBottom: "0.25rem" }}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
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
