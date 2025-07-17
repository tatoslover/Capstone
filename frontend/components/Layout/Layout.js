import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function Layout({ children, title = "Plansewalker's Primer" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content="MTG Rulebook for Beginners - Quick reference for Magic: The Gathering abilities and keywords"
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
              ⚡ Plansewalker's Primer
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
                href="/favorites"
                className={`nav-link ${isActive("/favorites") ? "active" : ""}`}
              >
                My Favorites
              </Link>
              <Link
                href="/profile"
                className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              >
                Profile
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="d-md-none btn-outline"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                padding: "0.5rem",
                border: "none",
                background: "transparent",
                fontSize: "1.5rem",
              }}
            >
              {isMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div
              className="d-md-none"
              style={{
                background: "white",
                borderTop: "1px solid #e9ecef",
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
                    href="/favorites"
                    className={`nav-link ${isActive("/favorites") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Favorites
                  </Link>
                  <Link
                    href="/profile"
                    className={`nav-link ${isActive("/profile") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
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
            background: "white",
            borderTop: "1px solid #e9ecef",
            padding: "2rem 0",
            marginTop: "4rem",
            textAlign: "center",
            color: "#6c757d",
          }}
        >
          <div className="container">
            <p style={{ marginBottom: "0.5rem" }}>
              Made for Magic: The Gathering beginners
            </p>
            <p style={{ fontSize: "0.875rem", margin: 0 }}>
              Card data provided by{" "}
              <a
                href="https://scryfall.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#007bff" }}
              >
                Scryfall
              </a>
            </p>
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
