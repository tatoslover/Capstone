import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { ThemeSelector } from "../Theme";
import { useTheme } from "../../contexts/ThemeContext";
import WizardIcon from "../UI/WizardIcon";
import WizardStaff from "../UI/WizardStaff";
import WizardSilhouette from "../UI/WizardSilhouette";
import WizardSwirl from "../UI/WizardSwirl";
import MinimalWizard from "../UI/MinimalWizard";
import ManaSymbols from "../UI/ManaSymbols";

export default function Layout({ children, title = "Planeswalker's Primer" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showQuickReference, setShowQuickReference] = useState(false);

  const router = useRouter();
  const { theme } = useTheme();

  const isActive = (path) => router.pathname === path;

  const toggleQuickReference = () => {
    setShowQuickReference(!showQuickReference);
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

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="MTG Rulebook for Beginners - Quick reference for Magic: The Gathering mechanics and keywords"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="nav">
          <div className="container">
            {/* Mobile-first centred layout */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 0",
              }}
            >
              {/* Brand/Logo - Always visible and centred */}
              <Link
                href="/"
                className="nav-brand"
                style={{
                  textAlign: "center",
                  fontSize: "3rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  textDecoration: "none",
                }}
              >
                <ManaSymbols size={60} />
                Planeswalker's Primer
              </Link>

              {/* Navigation Links - Mobile (Centred) */}
              <div
                className="d-md-none"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  width: "100%",
                }}
              >
                <Link
                  href="/"
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    textDecoration: "none",
                  }}
                >
                  <WizardIcon size={64} />
                  <span
                    style={{
                      color: isActive("/")
                        ? "#000000"
                        : "var(--theme-text, #2d3748)",
                      fontWeight: isActive("/") ? "600" : "400",
                      backgroundColor: isActive("/")
                        ? "var(--theme-accent, #805ad5)"
                        : "transparent",
                      padding: "0.5rem 1rem",
                      borderRadius: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Home
                  </span>
                </Link>
                <Link
                  href="/search"
                  className={`nav-link ${isActive("/search") ? "active" : ""}`}
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    textDecoration: "none",
                  }}
                >
                  <WizardStaff size={64} />
                  <span
                    style={{
                      color: isActive("/search")
                        ? "#000000"
                        : "var(--theme-text, #2d3748)",
                      fontWeight: isActive("/search") ? "600" : "400",
                      backgroundColor: isActive("/search")
                        ? "var(--theme-accent, #805ad5)"
                        : "transparent",
                      padding: "0.5rem 1rem",
                      borderRadius: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Search Cards
                  </span>
                </Link>
                <Link
                  href="/favourites"
                  className={`nav-link ${isActive("/favourites") ? "active" : ""}`}
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    textDecoration: "none",
                  }}
                >
                  <WizardSilhouette size={64} />
                  <span
                    style={{
                      color: isActive("/favourites")
                        ? "#000000"
                        : "var(--theme-text, #2d3748)",
                      fontWeight: isActive("/favourites") ? "600" : "400",
                      backgroundColor: isActive("/favourites")
                        ? "var(--theme-accent, #805ad5)"
                        : "transparent",
                      padding: "0.5rem 1rem",
                      borderRadius: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    My Favourites
                  </span>
                </Link>
                <Link
                  href="/documentation"
                  className={`nav-link ${isActive("/documentation") ? "active" : ""}`}
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    textDecoration: "none",
                  }}
                >
                  <WizardSwirl size={64} />
                  <span
                    style={{
                      color: isActive("/documentation")
                        ? "#000000"
                        : "var(--theme-text, #2d3748)",
                      fontWeight: isActive("/documentation") ? "600" : "400",
                      backgroundColor: isActive("/documentation")
                        ? "var(--theme-accent, #805ad5)"
                        : "transparent",
                      padding: "0.5rem 1rem",
                      borderRadius: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Documentation
                  </span>
                </Link>
                <Link
                  href="/profile"
                  className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                  style={{
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    textDecoration: "none",
                  }}
                >
                  <MinimalWizard size={64} />
                  <span
                    style={{
                      color: isActive("/profile")
                        ? "#000000"
                        : "var(--theme-text, #2d3748)",
                      fontWeight: isActive("/profile") ? "600" : "400",
                      backgroundColor: isActive("/profile")
                        ? "var(--theme-accent, #805ad5)"
                        : "transparent",
                      padding: "0.5rem 1rem",
                      borderRadius: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Profile
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation - Horizontal */}
              <div
                className="d-none d-md-flex"
                style={{
                  gap: "2rem",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Link
                  href="/"
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                    textDecoration: "none",
                  }}
                >
                  <WizardIcon size={56} />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: isActive("/")
                        ? "#000000"
                        : "var(--theme-text, #2d3748)",
                      fontWeight: isActive("/") ? "600" : "400",
                      backgroundColor: isActive("/")
                        ? "var(--theme-accent, #805ad5)"
                        : "transparent",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Home
                  </span>
                </Link>
                <Link
                  href="/search"
                  className={`nav-link ${isActive("/search") ? "active" : ""}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                    textDecoration: "none",
                  }}
                >
                  <WizardStaff size={56} />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: isActive("/search")
                        ? "#000000"
                        : "var(--theme-text, #2d3748)",
                      fontWeight: isActive("/search") ? "600" : "400",
                      backgroundColor: isActive("/search")
                        ? "var(--theme-accent, #805ad5)"
                        : "transparent",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Search Cards
                  </span>
                </Link>
                <Link
                  href="/favourites"
                  className={`nav-link ${isActive("/favourites") ? "active" : ""}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                    textDecoration: "none",
                  }}
                >
                  <WizardSilhouette size={56} />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: isActive("/favourites")
                        ? "#000000"
                        : "var(--theme-text, #2d3748)",
                      fontWeight: isActive("/favourites") ? "600" : "400",
                      backgroundColor: isActive("/favourites")
                        ? "var(--theme-accent, #805ad5)"
                        : "transparent",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    My Favourites
                  </span>
                </Link>
                <Link
                  href="/documentation"
                  className={`nav-link ${isActive("/documentation") ? "active" : ""}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                    textDecoration: "none",
                  }}
                >
                  <WizardSwirl size={56} />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: isActive("/documentation")
                        ? "#000000"
                        : "var(--theme-text, #2d3748)",
                      fontWeight: isActive("/documentation") ? "600" : "400",
                      backgroundColor: isActive("/documentation")
                        ? "var(--theme-accent, #805ad5)"
                        : "transparent",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Documentation
                  </span>
                </Link>
                <Link
                  href="/profile"
                  className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.25rem",
                    textDecoration: "none",
                  }}
                >
                  <MinimalWizard size={56} />
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: isActive("/profile")
                        ? "#000000"
                        : "var(--theme-text, #2d3748)",
                      fontWeight: isActive("/profile") ? "600" : "400",
                      backgroundColor: isActive("/profile")
                        ? "var(--theme-accent, #805ad5)"
                        : "transparent",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Profile
                  </span>
                </Link>
              </div>

              {/* Theme Selector and Quick Reference - Always at bottom and centred */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  paddingTop: "1rem",
                  width: "100%",
                }}
              >
                {/* Theme Selector */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "var(--theme-accent)",
                      textAlign: "center",
                    }}
                  >
                    Choose Theme:
                  </div>
                  <ThemeSelector compact={true} showLabel={false} />
                </div>

                {/* Quick Reference Button */}
                <button
                  onClick={toggleQuickReference}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "var(--theme-accent, #805ad5)",
                    border: "none",
                    borderRadius: "1rem",
                    color: "#000000",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  📖 Quick Reference
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Quick Reference Panel */}
        {showQuickReference && (
          <div
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              width: "320px",
              maxHeight: "80vh",
              backgroundColor: "rgba(26, 26, 26, 0.95)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--theme-border)",
              borderRadius: "0.5rem",
              zIndex: 1000,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "var(--theme-accent, #805ad5)",
                padding: "1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  color: "#000000",
                  margin: "0",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                }}
              >
                Quick Reference
              </h3>
              <button
                onClick={toggleQuickReference}
                style={{
                  background: "rgba(0,0,0,0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  color: "#000000",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                padding: "1rem",
                maxHeight: "calc(80vh - 60px)",
                overflowY: "auto",
              }}
            >
              {Object.entries(quickReferenceData).map(([key, section]) => (
                <div key={key} style={{ marginBottom: "1rem" }}>
                  <h4
                    style={{
                      color: "var(--theme-accent, #805ad5)",
                      margin: "0 0 0.5rem 0",
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>{section.icon}</span>
                    {section.title}
                  </h4>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: "0",
                      margin: "0",
                    }}
                  >
                    {section.content.map((item, index) => (
                      <li
                        key={index}
                        style={{
                          color: "var(--theme-textLight, #dee2e6)",
                          fontSize: "0.85rem",
                          padding: "0.25rem 0",
                          borderBottom:
                            index < section.content.length - 1
                              ? "1px solid rgba(255,255,255,0.1)"
                              : "none",
                        }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer
          style={{
            background: "rgba(26, 26, 26, 0.95)",
            backdropFilter: "blur(8px)",
            borderTop: "1px solid var(--theme-border)",
            padding: "2rem 0",
            marginTop: "4rem",
            textAlign: "center",
          }}
        >
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "2rem",
                marginBottom: "2rem",
              }}
            >
              <div>
                <h4
                  style={{ color: "var(--theme-accent)", marginBottom: "1rem" }}
                >
                  Planeswalker's Primer
                </h4>
                <p
                  style={{
                    color: "var(--theme-textLight)",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  Your beginner-friendly guide to Magic: The Gathering mechanics
                  and keywords. Learn, explore, and save your favourite cards.
                </p>
              </div>

              <div>
                <h5
                  style={{ color: "var(--theme-accent)", marginBottom: "1rem" }}
                >
                  Quick Links
                </h5>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <Link
                    href="/"
                    style={{
                      color: "var(--theme-textLight)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Home
                  </Link>
                  <Link
                    href="/search"
                    style={{
                      color: "var(--theme-textLight)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Search Cards
                  </Link>
                  <Link
                    href="/favourites"
                    style={{
                      color: "var(--theme-textLight)",
                      fontSize: "0.9rem",
                    }}
                  >
                    My Favourites
                  </Link>
                  <Link
                    href="/documentation"
                    style={{
                      color: "var(--theme-textLight)",
                      fontSize: "0.9rem",
                    }}
                  >
                    Documentation
                  </Link>
                </div>
              </div>

              <div>
                <h5
                  style={{ color: "var(--theme-accent)", marginBottom: "1rem" }}
                >
                  Legal Notice
                </h5>
                <p
                  style={{
                    color: "var(--theme-textLight)",
                    fontSize: "0.8rem",
                    lineHeight: "1.4",
                  }}
                >
                  This is an independent academic project. Magic: The Gathering
                  is a trademark of Wizards of the Coast. Card data and basic
                  land art provided by{" "}
                  <a
                    href="https://scryfall.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--theme-highlight)" }}
                  >
                    Scryfall
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* CSS for responsive display utilities */}
      <style jsx>{`
        .d-none {
          display: none;
        }

        .d-none {
          display: none;
        }

        .d-md-flex {
          display: none;
        }

        @media (min-width: 768px) {
          .d-md-flex {
            display: flex !important;
          }
          .d-md-none {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
