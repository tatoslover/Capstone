import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { ThemeSelector } from "../Theme";
import { useTheme } from "../../contexts/ThemeContext";

export default function Layout({ children, title = "Planeswalker's Primer" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const isActive = (path) => router.pathname === path;

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
          <div className="container d-flex align-center justify-between">
            {/* Brand/Logo */}
            <Link href="/" className="nav-brand">
              ⚡ Planeswalker's Primer
            </Link>

            {/* Desktop Navigation */}
            <div className="nav-links d-none d-md-flex">
              <Link
                href="/"
                className={`nav-link ${isActive("/") ? "active" : ""}`}
              >
                Home
              </Link>
              <Link
                href="/search"
                className={`nav-link ${isActive("/search") ? "active" : ""}`}
              >
                Search Cards
              </Link>
              <Link
                href="/favourites"
                className={`nav-link ${isActive("/favourites") ? "active" : ""}`}
              >
                My Favourites
              </Link>
              <Link
                href="/documentation"
                className={`nav-link ${isActive("/documentation") ? "active" : ""}`}
              >
                Documentation
              </Link>
              <Link
                href="/profile"
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              >
                Profile
              </Link>

              {/* Theme Selector in Navigation */}
              <div
                style={{
                  marginLeft: "1rem",
                  paddingLeft: "1rem",
                  borderLeft: "1px solid var(--theme-border)",
                }}
              >
                <ThemeSelector compact={true} showLabel={false} />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="d-md-none"
              style={{
                background: "transparent",
                border: "1px solid var(--theme-border)",
                padding: "0.5rem",
                borderRadius: "0.25rem",
                color: "var(--theme-text)",
                fontSize: "1.25rem",
              }}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div
              style={{
                background: "rgba(26, 26, 26, 0.95)",
                backdropFilter: "blur(8px)",
                borderTop: "1px solid var(--theme-border)",
                padding: "1rem 0",
              }}
            >
              <div className="container">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <Link
                    href="/"
                    className={`nav-link ${isActive("/") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    href="/search"
                    className={`nav-link ${isActive("/search") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Search Cards
                  </Link>
                  <Link
                    href="/favourites"
                    className={`nav-link ${isActive("/favourites") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Favourites
                  </Link>
                  <Link
                    href="/documentation"
                    className={`nav-link ${isActive("/documentation") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Documentation
                  </Link>
                  <Link
                    href="/profile"
                    className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  {/* Theme Selector for Mobile */}
                  <div
                    style={{
                      marginTop: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--theme-border)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        marginBottom: "0.75rem",
                        color: "var(--theme-accent)",
                      }}
                    >
                      Choose Theme:
                    </div>
                    <ThemeSelector compact={true} showLabel={false} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

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

            <div
              style={{
                borderTop: "1px solid var(--theme-border)",
                paddingTop: "1rem",
                color: "var(--theme-textLight)",
                fontSize: "0.875rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>© 2024 Planeswalker's Primer - Academic Project</div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <span style={{ fontSize: "0.8rem" }}>Theme:</span>
                  <span
                    style={{
                      color: "var(--theme-accent)",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    {theme.symbol} {theme.name}
                  </span>
                </div>
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

        .d-md-flex {
          display: none;
        }

        @media (min-width: 768px) {
          .d-md-flex {
            display: flex;
          }
          .d-md-none {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
