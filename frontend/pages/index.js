import { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../components/Layout/Layout";
import UserSelector from "../components/User/UserSelector";
import Loading from "../components/UI/Loading";
import { MechanicsList } from "../components/Mechanics";
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
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showQuickReference, setShowQuickReference] = useState(false);
  const [activeQuickRefSection, setActiveQuickRefSection] = useState(null);

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

  // Load completed learning steps from localStorage
  useEffect(() => {
    const savedSteps = localStorage.getItem("completedLearningSteps");
    if (savedSteps) {
      try {
        setCompletedSteps(JSON.parse(savedSteps));
      } catch (e) {
        localStorage.removeItem("completedLearningSteps");
      }
    }
  }, []);

  const toggleLearningStep = (stepNumber) => {
    const newCompletedSteps = completedSteps.includes(stepNumber)
      ? completedSteps.filter((step) => step !== stepNumber)
      : [...completedSteps, stepNumber];

    setCompletedSteps(newCompletedSteps);
    localStorage.setItem(
      "completedLearningSteps",
      JSON.stringify(newCompletedSteps),
    );
  };

  const toggleQuickReference = () => {
    setShowQuickReference(!showQuickReference);
    if (showQuickReference) {
      setActiveQuickRefSection(null);
    }
  };

  const quickReferenceData = {
    manaSymbols: {
      title: "Mana Symbols",
      icon: "⚡",
      content: [
        "W = White mana",
        "U = Blue mana",
        "B = Black mana",
        "R = Red mana",
        "G = Green mana",
        "C = Colourless mana",
        "X = Variable amount",
        "Numbers = Generic mana",
      ],
    },
    phases: {
      title: "Turn Phases",
      icon: "🕒",
      content: [
        "1. Beginning Phase",
        "2. First Main Phase",
        "3. Combat Phase",
        "4. Second Main Phase",
        "5. Ending Phase",
      ],
    },
    zones: {
      title: "Game Zones",
      icon: "📍",
      content: [
        "Library = Your deck",
        "Hand = Cards you can play",
        "Battlefield = Permanents in play",
        "Graveyard = Used/destroyed cards",
        "Exile = Removed from game",
        "Stack = Spells waiting to resolve",
      ],
    },
    keywords: {
      title: "Common Keywords",
      icon: "🔑",
      content: [
        "Flying = Only blocked by flying/reach",
        "Trample = Excess damage to player",
        "Haste = Can attack immediately",
        "Vigilance = Doesn't tap to attack",
        "Deathtouch = Any damage is lethal",
        "Lifelink = Damage gains life",
        "First Strike = Deals damage first",
        "Flash = Cast at instant speed",
      ],
    },
  };

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
        {/* Quick Reference Toggle Button */}
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={toggleQuickReference}
            style={{
              padding: "0.75rem 1rem",
              background: "#495057",
              border: "2px solid #6c757d",
              borderRadius: "0.5rem",
              color: "#ffffff",
              fontSize: "0.9rem",
              fontWeight: "500",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#6c757d";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#495057";
              e.target.style.transform = "translateY(0)";
            }}
          >
            📖 Quick Reference
          </button>
        </div>

        {/* Quick Reference Panel */}
        {showQuickReference && (
          <div
            style={{
              position: "fixed",
              top: "80px",
              right: "20px",
              width: "320px",
              maxHeight: "70vh",
              overflowY: "auto",
              background: "#343a40",
              border: "2px solid #495057",
              borderRadius: "0.5rem",
              zIndex: 999,
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ padding: "1rem", borderBottom: "1px solid #495057" }}>
              <h3 style={{ color: "#ffffff", margin: "0", fontSize: "1.1rem" }}>
                Quick Reference
              </h3>
            </div>
            <div style={{ padding: "0.5rem" }}>
              {Object.entries(quickReferenceData).map(([key, section]) => (
                <div key={key} style={{ marginBottom: "0.5rem" }}>
                  <button
                    onClick={() =>
                      setActiveQuickRefSection(
                        activeQuickRefSection === key ? null : key,
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background:
                        activeQuickRefSection === key ? "#495057" : "#212529",
                      border: "1px solid #495057",
                      borderRadius: "0.375rem",
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>
                      {section.icon} {section.title}
                    </span>
                    <span
                      style={{
                        transform:
                          activeQuickRefSection === key
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    >
                      ▼
                    </span>
                  </button>
                  {activeQuickRefSection === key && (
                    <div
                      style={{
                        padding: "0.75rem",
                        background: "#495057",
                        borderRadius: "0.375rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      {section.content.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            color: "#dee2e6",
                            fontSize: "0.8rem",
                            marginBottom: "0.25rem",
                            paddingLeft: "0.5rem",
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
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
              {gameOverview.introduction.description}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              {gameOverview.coreGameplay.overview}
            </p>
            <p style={{ marginBottom: "1.5rem" }}>
              {gameOverview.coreGameplay.gameFlow}
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

            {/* Interactive Learning Path */}
            <div
              style={{
                background: "#343a40",
                padding: "1.5rem",
                borderRadius: "0.5rem",
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
                Your Interactive Learning Journey
              </h3>
              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <span style={{ color: "#adb5bd", fontSize: "0.9rem" }}>
                  Click to mark steps as complete • Progress:{" "}
                  {completedSteps.length}/{gameOverview.learningPath.length}
                </span>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "#495057",
                    borderRadius: "4px",
                    marginTop: "0.5rem",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(completedSteps.length / gameOverview.learningPath.length) * 100}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #28a745, #20c997)",
                      borderRadius: "4px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                }}
              >
                {gameOverview.learningPath.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.step);
                  return (
                    <div
                      key={index}
                      onClick={() => toggleLearningStep(step.step)}
                      style={{
                        padding: "1rem",
                        background: isCompleted ? "#28a745" : "#495057",
                        borderRadius: "0.375rem",
                        border: `2px solid ${isCompleted ? "#20c997" : "#6c757d"}`,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        transform: isCompleted ? "scale(1.02)" : "scale(1)",
                      }}
                      onMouseOver={(e) => {
                        if (!isCompleted) {
                          e.currentTarget.style.backgroundColor = "#6c757d";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isCompleted) {
                          e.currentTarget.style.backgroundColor = "#495057";
                          e.currentTarget.style.transform = "scale(1)";
                        }
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <div
                          style={{
                            width: "30px",
                            height: "30px",
                            background: isCompleted ? "#ffffff" : "#6c757d",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "0.5rem",
                            color: isCompleted ? "#28a745" : "#ffffff",
                            fontWeight: "bold",
                            fontSize: "0.9rem",
                          }}
                        >
                          {isCompleted ? "✓" : step.step}
                        </div>
                        <h4
                          style={{
                            color: "#ffffff",
                            margin: "0",
                            fontSize: "0.9rem",
                          }}
                        >
                          {step.title}
                        </h4>
                      </div>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          margin: "0",
                          color: isCompleted ? "#f8f9fa" : "#dee2e6",
                          opacity: isCompleted ? 0.9 : 1,
                        }}
                      >
                        {step.description}
                      </p>
                      {isCompleted && (
                        <div
                          style={{
                            marginTop: "0.5rem",
                            padding: "0.25rem 0.5rem",
                            background: "#ffffff",
                            borderRadius: "0.25rem",
                            color: "#28a745",
                            fontSize: "0.7rem",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          COMPLETED ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "1.5rem",
                  padding: "1rem",
                  background:
                    completedSteps.length === gameOverview.learningPath.length
                      ? "#28a745"
                      : "#495057",
                  borderRadius: "0.5rem",
                  border: `2px solid ${completedSteps.length === gameOverview.learningPath.length ? "#20c997" : "#6c757d"}`,
                }}
              >
                {completedSteps.length === gameOverview.learningPath.length ? (
                  <div>
                    <h4 style={{ color: "#ffffff", margin: "0 0 0.5rem 0" }}>
                      🎉 Congratulations! Learning Path Complete!
                    </h4>
                    <p
                      style={{
                        color: "#f8f9fa",
                        margin: "0",
                        fontSize: "0.9rem",
                      }}
                    >
                      You've mastered the basics of Magic: The Gathering!
                    </p>
                  </div>
                ) : (
                  <p
                    style={{
                      color: "#adb5bd",
                      margin: "0",
                      fontSize: "0.9rem",
                    }}
                  >
                    Keep going! You're{" "}
                    {Math.round(
                      (completedSteps.length /
                        gameOverview.learningPath.length) *
                        100,
                    )}
                    % through your learning journey.
                  </p>
                )}
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
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {Object.entries(colors).map(([colorKey, colorData]) => (
              <div
                key={colorKey}
                style={{
                  padding: "1.5rem",
                  background: "#495057",
                  borderRadius: "0.5rem",
                  border: "1px solid #6c757d",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {colorData.emoji}
                </div>
                <h4
                  style={{
                    color: "#ffffff",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                  }}
                >
                  {colorData.name}
                </h4>
                <p
                  style={{
                    color: "#dee2e6",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                    lineHeight: "1.4",
                  }}
                >
                  {colorData.description}
                </p>
                <div style={{ marginBottom: "1rem" }}>
                  <h5
                    style={{
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Philosophy:
                  </h5>
                  <p
                    style={{
                      color: "#adb5bd",
                      fontSize: "0.8rem",
                      fontStyle: "italic",
                    }}
                  >
                    {colorData.philosophy}
                  </p>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <h5
                    style={{
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Strengths:
                  </h5>
                  <div style={{ fontSize: "0.8rem", color: "#dee2e6" }}>
                    {colorData.strengths.slice(0, 3).map((strength, index) => (
                      <span key={index}>
                        {strength}
                        {index < 2 ? " • " : ""}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5
                    style={{
                      color: "#ffffff",
                      fontSize: "0.9rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Key Mechanics:
                  </h5>
                  <div style={{ fontSize: "0.8rem", color: "#dee2e6" }}>
                    {colorData.mechanics.slice(0, 3).map((mechanic, index) => (
                      <span key={index}>
                        {mechanic}
                        {index < 2 ? " • " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {Object.entries(cardTypes).map(([typeKey, typeData]) => (
              <div
                key={typeKey}
                style={{
                  padding: "1.25rem",
                  background: "#495057",
                  borderRadius: "0.5rem",
                  border: "1px solid #6c757d",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                    {typeData.icon}
                  </span>
                  <h4 style={{ color: "#ffffff", margin: "0" }}>
                    {typeData.name}
                  </h4>
                </div>
                <p
                  style={{
                    color: "#dee2e6",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                    lineHeight: "1.4",
                  }}
                >
                  {typeData.description}
                </p>
                <div style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#ffffff", fontSize: "0.85rem" }}>
                    Timing:{" "}
                  </strong>
                  <span style={{ color: "#adb5bd", fontSize: "0.85rem" }}>
                    {typeData.timing}
                  </span>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <strong style={{ color: "#ffffff", fontSize: "0.85rem" }}>
                    Usage:{" "}
                  </strong>
                  <span style={{ color: "#adb5bd", fontSize: "0.85rem" }}>
                    {typeData.usage}
                  </span>
                </div>
                {typeData.examples && (
                  <div>
                    <strong style={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      Examples:
                    </strong>
                    <div
                      style={{
                        color: "#dee2e6",
                        fontSize: "0.8rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {typeData.examples.slice(0, 2).map((example, index) => (
                        <span key={index}>
                          {example}
                          {index < 1 && typeData.examples.length > 1
                            ? " • "
                            : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
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
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "0.5rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <button
              onClick={() => handlePhaseClick("beginning")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedPhase === "beginning" ? "#495057" : "#343a40",
                border: `2px solid ${selectedPhase === "beginning" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedPhase !== "beginning") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedPhase !== "beginning") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              Beginning
            </button>
            <button
              onClick={() => handlePhaseClick("main1")}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedPhase === "main1" ? "#495057" : "#343a40",
                border: `2px solid ${selectedPhase === "main1" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedPhase !== "main1") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedPhase !== "main1") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              Main 1
            </button>
            <button
              onClick={() => handlePhaseClick("combat")}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedPhase === "combat" ? "#495057" : "#343a40",
                border: `2px solid ${selectedPhase === "combat" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedPhase !== "combat") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedPhase !== "combat") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              Combat
            </button>
            <button
              onClick={() => handlePhaseClick("main2")}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedPhase === "main2" ? "#495057" : "#343a40",
                border: `2px solid ${selectedPhase === "main2" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedPhase !== "main2") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedPhase !== "main2") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              Main 2
            </button>
            <button
              onClick={() => handlePhaseClick("ending")}
              style={{
                padding: "0.75rem 0.5rem",
                background: selectedPhase === "ending" ? "#495057" : "#343a40",
                border: `2px solid ${selectedPhase === "ending" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedPhase !== "ending") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedPhase !== "ending") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              Ending
            </button>
          </div>

          {selectedPhase && (
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background: "#495057",
                borderRadius: "0.5rem",
                border: "1px solid #6c757d",
              }}
            >
              <h3 style={{ marginBottom: "1rem", color: "#ffffff" }}>
                {phaseInfo[selectedPhase].title}
              </h3>
              <div style={{ color: "#dee2e6", lineHeight: "1.6" }}>
                {phaseInfo[selectedPhase].content}
              </div>
            </div>
          )}

          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              color: "#adb5bd",
              fontSize: "0.9rem",
            }}
          >
            Click a phase to learn more
          </div>
        </div>

        {/* Card Anatomy */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1.5rem", textAlign: "center" }}>
            {cardAnatomy.overview.title}
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#adb5bd",
            }}
          >
            {cardAnatomy.overview.description}
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {Object.entries(cardAnatomy.cardParts).map(
              ([partKey, partData]) => (
                <div
                  key={partKey}
                  style={{
                    padding: "1.5rem",
                    background: "#495057",
                    borderRadius: "0.5rem",
                    border: "1px solid #6c757d",
                  }}
                >
                  <h4
                    style={{
                      color: "#ffffff",
                      marginBottom: "1rem",
                      fontSize: "1.1rem",
                    }}
                  >
                    {partData.name}
                  </h4>
                  <div style={{ marginBottom: "1rem" }}>
                    <strong style={{ color: "#ffffff", fontSize: "0.9rem" }}>
                      Location:{" "}
                    </strong>
                    <span style={{ color: "#adb5bd", fontSize: "0.9rem" }}>
                      {partData.location}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#dee2e6",
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {partData.description}
                  </p>
                  {partData.examples && (
                    <div>
                      <strong style={{ color: "#ffffff", fontSize: "0.85rem" }}>
                        Examples:
                      </strong>
                      <ul
                        style={{
                          margin: "0.5rem 0 0 1rem",
                          padding: "0",
                          color: "#dee2e6",
                          fontSize: "0.8rem",
                        }}
                      >
                        {partData.examples.slice(0, 2).map((example, index) => (
                          <li key={index} style={{ marginBottom: "0.25rem" }}>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {partData.readingTips && (
                    <div>
                      <strong style={{ color: "#ffffff", fontSize: "0.85rem" }}>
                        Tips:
                      </strong>
                      <p
                        style={{
                          margin: "0.5rem 0 0 0",
                          color: "#adb5bd",
                          fontSize: "0.8rem",
                          fontStyle: "italic",
                        }}
                      >
                        {partData.readingTips[0]}
                      </p>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        </div>

        {/* Mechanics Guide */}
        <div className="card">
          <MechanicsList
            onMechanicSelect={handleMechanicSelect}
            selectedMechanic={selectedMechanic}
          />
        </div>

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
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "0.5rem",
              maxWidth: "800px",
              margin: "0 auto 2rem auto",
            }}
          >
            <button
              onClick={() => handleGameModeClick("rotating")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedGameMode === "rotating" ? "#495057" : "#343a40",
                border: `2px solid ${selectedGameMode === "rotating" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedGameMode !== "rotating") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedGameMode !== "rotating") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              🔁 Rotating
            </button>
            <button
              onClick={() => handleGameModeClick("eternal")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedGameMode === "eternal" ? "#495057" : "#343a40",
                border: `2px solid ${selectedGameMode === "eternal" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedGameMode !== "eternal") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedGameMode !== "eternal") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              ♾️ Eternal
            </button>
            <button
              onClick={() => handleGameModeClick("limited")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedGameMode === "limited" ? "#495057" : "#343a40",
                border: `2px solid ${selectedGameMode === "limited" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedGameMode !== "limited") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedGameMode !== "limited") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              🧪 Limited
            </button>
            <button
              onClick={() => handleGameModeClick("multiplayer")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedGameMode === "multiplayer" ? "#495057" : "#343a40",
                border: `2px solid ${selectedGameMode === "multiplayer" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedGameMode !== "multiplayer") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedGameMode !== "multiplayer") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              🎮 Casual & Multiplayer
            </button>
            <button
              onClick={() => handleGameModeClick("custom")}
              style={{
                padding: "0.75rem 0.5rem",
                background:
                  selectedGameMode === "custom" ? "#495057" : "#343a40",
                border: `2px solid ${selectedGameMode === "custom" ? "#6c757d" : "#495057"}`,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s ease",
                color: "#ffffff",
              }}
              onMouseOver={(e) => {
                if (selectedGameMode !== "custom") {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#6c757d";
                }
              }}
              onMouseOut={(e) => {
                if (selectedGameMode !== "custom") {
                  e.target.style.backgroundColor = "#343a40";
                  e.target.style.borderColor = "#495057";
                }
              }}
            >
              🛠️ Custom & House
            </button>
          </div>

          {selectedGameMode && (
            <div
              style={{
                marginTop: "1rem",
                padding: "1.5rem",
                background: "#495057",
                borderRadius: "0.5rem",
                border: "1px solid #6c757d",
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

          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              color: "#adb5bd",
              fontSize: "0.9rem",
            }}
          >
            Click a category to learn more
          </div>
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

          {/* Primary Win Conditions */}
          <h3
            style={{
              color: "#ffffff",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Primary Win Conditions
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              maxWidth: "1000px",
              margin: "0 auto 2rem auto",
            }}
          >
            {Object.entries(winConditions.primaryWinConditions).map(
              ([conditionKey, condition]) => (
                <div
                  key={conditionKey}
                  style={{
                    padding: "1.5rem",
                    background: "#495057",
                    borderRadius: "0.5rem",
                    border: "1px solid #6c757d",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                      {condition.emoji}
                    </span>
                    <h4
                      style={{
                        color: "#ffffff",
                        margin: "0",
                        fontSize: "1.1rem",
                      }}
                    >
                      {condition.name}
                    </h4>
                  </div>
                  <p
                    style={{
                      color: "#dee2e6",
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {condition.description}
                  </p>
                  <p
                    style={{
                      color: "#adb5bd",
                      fontSize: "0.85rem",
                      marginBottom: "1rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {condition.explanation}
                  </p>
                  {condition.tips && (
                    <div>
                      <strong style={{ color: "#ffffff", fontSize: "0.85rem" }}>
                        Tips:
                      </strong>
                      <ul
                        style={{
                          margin: "0.5rem 0 0 1rem",
                          padding: "0",
                          color: "#dee2e6",
                          fontSize: "0.8rem",
                        }}
                      >
                        {condition.tips.slice(0, 2).map((tip, index) => (
                          <li key={index} style={{ marginBottom: "0.25rem" }}>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ),
            )}
          </div>

          {/* Alternative Win Conditions */}
          <h3
            style={{
              color: "#ffffff",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Alternative Win Conditions
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            {Object.entries(winConditions.alternativeWinConditions).map(
              ([conditionKey, condition]) => (
                <div
                  key={conditionKey}
                  style={{
                    padding: "1.5rem",
                    background: "#343a40",
                    borderRadius: "0.5rem",
                    border: "1px solid #495057",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                      {condition.emoji}
                    </span>
                    <h4
                      style={{
                        color: "#ffffff",
                        margin: "0",
                        fontSize: "1.1rem",
                      }}
                    >
                      {condition.name}
                    </h4>
                  </div>
                  <p
                    style={{
                      color: "#dee2e6",
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {condition.description}
                  </p>
                  <p
                    style={{
                      color: "#adb5bd",
                      fontSize: "0.85rem",
                      lineHeight: "1.3",
                    }}
                  >
                    {condition.explanation}
                  </p>
                </div>
              ),
            )}
          </div>
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

          {/* Fundamental Rules */}
          <h3
            style={{
              color: "#ffffff",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Fundamental Rules
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
              maxWidth: "1000px",
              margin: "0 auto 2rem auto",
            }}
          >
            {Object.entries(deckBuilding.fundamentalRules).map(
              ([ruleKey, rule]) => (
                <div
                  key={ruleKey}
                  style={{
                    padding: "1.5rem",
                    background: "#495057",
                    borderRadius: "0.5rem",
                    border: "1px solid #6c757d",
                  }}
                >
                  <h4
                    style={{
                      color: "#ffffff",
                      marginBottom: "0.75rem",
                      fontSize: "1.1rem",
                    }}
                  >
                    {rule.title}
                  </h4>
                  <div style={{ marginBottom: "1rem" }}>
                    <strong style={{ color: "#ffffff", fontSize: "0.9rem" }}>
                      Rule:{" "}
                    </strong>
                    <span style={{ color: "#dee2e6", fontSize: "0.9rem" }}>
                      {rule.rule}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#adb5bd",
                      fontSize: "0.85rem",
                      marginBottom: "1rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {rule.explanation}
                  </p>
                  <div>
                    <strong style={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      Reasoning:{" "}
                    </strong>
                    <span style={{ color: "#dee2e6", fontSize: "0.85rem" }}>
                      {rule.reasoning}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Deck Building Steps */}
          <h3
            style={{
              color: "#ffffff",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Building Your First Deck
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
              maxWidth: "1200px",
              margin: "0 auto 2rem auto",
            }}
          >
            {deckBuilding.deckBuildingSteps.map((step, index) => (
              <div
                key={index}
                style={{
                  padding: "1.25rem",
                  background: "#343a40",
                  borderRadius: "0.5rem",
                  border: "1px solid #495057",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      background: "#6c757d",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "0.75rem",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                  >
                    {step.step}
                  </div>
                  <h4
                    style={{
                      color: "#ffffff",
                      margin: "0",
                      fontSize: "1rem",
                    }}
                  >
                    {step.title}
                  </h4>
                </div>
                <p
                  style={{
                    color: "#dee2e6",
                    fontSize: "0.85rem",
                    margin: "0",
                    lineHeight: "1.3",
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Deck Types Overview */}
          <h3
            style={{
              color: "#ffffff",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Common Deck Types
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {Object.entries(deckBuilding.deckTypes).map(
              ([typeKey, deckType]) => (
                <div
                  key={typeKey}
                  style={{
                    padding: "1.5rem",
                    background: "#495057",
                    borderRadius: "0.5rem",
                    border: "1px solid #6c757d",
                  }}
                >
                  <h4
                    style={{
                      color: "#ffffff",
                      marginBottom: "0.75rem",
                      fontSize: "1.1rem",
                    }}
                  >
                    {deckType.name}
                  </h4>
                  <p
                    style={{
                      color: "#dee2e6",
                      fontSize: "0.9rem",
                      marginBottom: "1rem",
                      lineHeight: "1.4",
                    }}
                  >
                    {deckType.strategy}
                  </p>
                  <div style={{ marginBottom: "1rem" }}>
                    <strong style={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      Key Features:
                    </strong>
                    <ul
                      style={{
                        margin: "0.5rem 0 0 1rem",
                        padding: "0",
                        color: "#adb5bd",
                        fontSize: "0.8rem",
                      }}
                    >
                      {deckType.characteristics
                        .slice(0, 3)
                        .map((characteristic, index) => (
                          <li key={index} style={{ marginBottom: "0.25rem" }}>
                            {characteristic}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <strong style={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      Tip:{" "}
                    </strong>
                    <span
                      style={{
                        color: "#dee2e6",
                        fontSize: "0.8rem",
                        fontStyle: "italic",
                      }}
                    >
                      {deckType.tips}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
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
            style={{
              maxWidth: "800px",
              margin: "0 auto 2rem auto",
              padding: "1.5rem",
              background: "#343a40",
              borderRadius: "0.5rem",
              border: "1px solid #495057",
              textAlign: "center",
            }}
          >
            <p
              style={{ color: "#dee2e6", fontSize: "1rem", lineHeight: "1.5" }}
            >
              {combatBasics.combatOverview.importance}
            </p>
          </div>

          {/* Combat Steps */}
          <h3
            style={{
              color: "#ffffff",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Combat Steps in Detail
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1rem",
              maxWidth: "1200px",
              margin: "0 auto 2rem auto",
            }}
          >
            {Object.entries(combatBasics.combatSteps).map(([stepKey, step]) => (
              <div
                key={stepKey}
                style={{
                  padding: "1.5rem",
                  background: "#495057",
                  borderRadius: "0.5rem",
                  border: "1px solid #6c757d",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      background: "#6c757d",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "0.75rem",
                      color: "#ffffff",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                  >
                    {step.order}
                  </div>
                  <h4
                    style={{
                      color: "#ffffff",
                      margin: "0",
                      fontSize: "1rem",
                    }}
                  >
                    {step.name}
                  </h4>
                </div>
                <p
                  style={{
                    color: "#dee2e6",
                    fontSize: "0.9rem",
                    marginBottom: "1rem",
                    lineHeight: "1.4",
                  }}
                >
                  {step.description}
                </p>
                {step.whatHappens && (
                  <div style={{ marginBottom: "1rem" }}>
                    <strong style={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      What Happens:
                    </strong>
                    <ul
                      style={{
                        margin: "0.5rem 0 0 1rem",
                        padding: "0",
                        color: "#adb5bd",
                        fontSize: "0.8rem",
                      }}
                    >
                      {step.whatHappens.slice(0, 2).map((item, index) => (
                        <li key={index} style={{ marginBottom: "0.25rem" }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {step.strategicNotes && (
                  <div>
                    <strong style={{ color: "#ffffff", fontSize: "0.85rem" }}>
                      Strategy:
                    </strong>
                    <p
                      style={{
                        margin: "0.5rem 0 0 0",
                        color: "#dee2e6",
                        fontSize: "0.8rem",
                        fontStyle: "italic",
                      }}
                    >
                      {step.strategicNotes[0]}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Combat Keywords */}
          <h3
            style={{
              color: "#ffffff",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Important Combat Keywords
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1rem",
              maxWidth: "1000px",
              margin: "0 auto 2rem auto",
            }}
          >
            {Object.entries(combatBasics.combatKeywords).map(
              ([categoryKey, keywords]) => (
                <div
                  key={categoryKey}
                  style={{
                    padding: "1.5rem",
                    background: "#343a40",
                    borderRadius: "0.5rem",
                    border: "1px solid #495057",
                  }}
                >
                  <h4
                    style={{
                      color: "#ffffff",
                      marginBottom: "1rem",
                      fontSize: "1rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {categoryKey
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .replace(" Keywords", "")}{" "}
                    Keywords
                  </h4>
                  <div style={{ color: "#dee2e6", fontSize: "0.85rem" }}>
                    {Object.entries(keywords)
                      .slice(0, 4)
                      .map(([keyword, description], index) => (
                        <div key={index} style={{ marginBottom: "0.5rem" }}>
                          <strong style={{ color: "#ffffff" }}>
                            {keyword}:
                          </strong>{" "}
                          {description}
                        </div>
                      ))}
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Combat Tips */}
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "1.5rem",
              background: "#495057",
              borderRadius: "0.5rem",
              border: "1px solid #6c757d",
            }}
          >
            <h4
              style={{
                color: "#ffffff",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              Essential Combat Tips
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              }}
            >
              {combatBasics.practicalTips.slice(0, 6).map((tip, index) => (
                <div
                  key={index}
                  style={{
                    padding: "1rem",
                    background: "#343a40",
                    borderRadius: "0.375rem",
                    border: "1px solid #495057",
                  }}
                >
                  <p
                    style={{
                      color: "#dee2e6",
                      fontSize: "0.85rem",
                      margin: "0",
                      lineHeight: "1.4",
                    }}
                  >
                    {tip}
                  </p>
                </div>
              ))}
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
