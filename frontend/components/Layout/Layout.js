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
            <div className="nav-container">
              {/* Brand/Logo - Always visible and centred */}
              <Link href="/" className="nav-brand nav-brand-layout">
                <ManaSymbols size={60} />
                Planeswalker's Primer
              </Link>

              {/* Navigation Links - Mobile (Centred) */}
              <div className="d-md-none nav-mobile">
                <Link href="/" className="nav-link nav-link-mobile">
                  <WizardIcon size={64} />
                  <span
                    className={`nav-link-text ${isActive("/") ? "active" : ""}`}
                  >
                    Home
                  </span>
                </Link>
                <Link href="/search" className="nav-link nav-link-mobile">
                  <WizardStaff size={64} />
                  <span
                    className={`nav-link-text ${isActive("/search") ? "active" : ""}`}
                  >
                    Search Cards
                  </span>
                </Link>
                <Link href="/favourites" className="nav-link nav-link-mobile">
                  <WizardSilhouette size={64} />
                  <span
                    className={`nav-link-text ${isActive("/favourites") ? "active" : ""}`}
                  >
                    My Favourites
                  </span>
                </Link>
                <Link
                  href="/documentation"
                  className="nav-link nav-link-mobile"
                >
                  <WizardSwirl size={64} />
                  <span
                    className={`nav-link-text ${isActive("/documentation") ? "active" : ""}`}
                  >
                    Documentation
                  </span>
                </Link>
                <Link href="/profile" className="nav-link nav-link-mobile">
                  <MinimalWizard size={64} />
                  <span
                    className={`nav-link-text ${isActive("/profile") ? "active" : ""}`}
                  >
                    Profile
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation - Horizontal */}
              <div className="d-none d-md-flex nav-desktop">
                <Link href="/" className="nav-link nav-link-desktop">
                  <WizardIcon size={56} />
                  <span
                    className={`nav-link-text-desktop ${isActive("/") ? "active" : ""}`}
                  >
                    Home
                  </span>
                </Link>
                <Link href="/search" className="nav-link nav-link-desktop">
                  <WizardStaff size={56} />
                  <span
                    className={`nav-link-text-desktop ${isActive("/search") ? "active" : ""}`}
                  >
                    Search Cards
                  </span>
                </Link>
                <Link href="/favourites" className="nav-link nav-link-desktop">
                  <WizardSilhouette size={56} />
                  <span
                    className={`nav-link-text-desktop ${isActive("/favourites") ? "active" : ""}`}
                  >
                    My Favourites
                  </span>
                </Link>
                <Link
                  href="/documentation"
                  className="nav-link nav-link-desktop"
                >
                  <WizardSwirl size={56} />
                  <span
                    className={`nav-link-text-desktop ${isActive("/documentation") ? "active" : ""}`}
                  >
                    Documentation
                  </span>
                </Link>
                <Link href="/profile" className="nav-link nav-link-desktop">
                  <MinimalWizard size={56} />
                  <span
                    className={`nav-link-text-desktop ${isActive("/profile") ? "active" : ""}`}
                  >
                    Profile
                  </span>
                </Link>
              </div>

              {/* Theme Selector and Quick Reference - Always at bottom and centred */}
              <div className="nav-bottom-section">
                {/* Theme Selector */}
                <div className="theme-selector-section">
                  <div className="theme-selector-label">Choose Theme:</div>
                  <ThemeSelector compact={true} showLabel={false} />
                </div>

                {/* Quick Reference Button */}
                <button
                  onClick={toggleQuickReference}
                  className="quick-reference-btn"
                >
                  📖 Quick Reference
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Quick Reference Panel */}
        {showQuickReference && (
          <div className="quick-reference-panel">
            <div className="quick-reference-header">
              <h3 className="quick-reference-title">Quick Reference</h3>
              <button
                onClick={toggleQuickReference}
                className="quick-reference-close"
              >
                ✕
              </button>
            </div>
            <div className="quick-reference-content">
              {Object.entries(quickReferenceData).map(([key, section]) => (
                <div key={key} className="quick-reference-section">
                  <h4 className="quick-reference-section-title">
                    <span>{section.icon}</span>
                    {section.title}
                  </h4>
                  <ul className="quick-reference-list">
                    {section.content.map((item, index) => (
                      <li
                        key={index}
                        className={`quick-reference-item ${index < section.content.length - 1 ? "" : ""}`}
                        style={{
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
        <footer className="footer-layout">
          <div className="container">
            <div className="footer-grid">
              <div>
                <h4 className="footer-section-title">Planeswalker's Primer</h4>
                <p className="footer-description">
                  Your beginner-friendly guide to Magic: The Gathering mechanics
                  and keywords. Learn, explore, and save your favourite cards.
                </p>
              </div>

              <div>
                <h5 className="footer-section-title">Quick Links</h5>
                <div className="footer-links">
                  <Link href="/" className="footer-link">
                    Home
                  </Link>
                  <Link href="/search" className="footer-link">
                    Search Cards
                  </Link>
                  <Link href="/favourites" className="footer-link">
                    My Favourites
                  </Link>
                  <Link href="/documentation" className="footer-link">
                    Documentation
                  </Link>
                </div>
              </div>

              <div>
                <h5 className="footer-section-title">Legal Notice</h5>
                <p className="footer-legal">
                  This is an independent academic project. Magic: The Gathering
                  is a trademark of Wizards of the Coast. Card data and basic
                  land art provided by{" "}
                  <a
                    href="https://scryfall.com"
                    target="_blank"
                    rel="noopener noreferrer"
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
    </>
  );
}
