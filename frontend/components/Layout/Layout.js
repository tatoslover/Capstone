import { useState } from 'react';
import Head from 'next/head';

export default function Layout({ children, title = "Plansewalker's Primer" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="MTG Rulebook for Beginners - Quick reference for Magic: The Gathering abilities and keywords" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="nav">
          <div className="container d-flex align-center justify-between">
            {/* Brand/Logo */}
            <a href="/" className="nav-brand">
              ⚡ Plansewalker's Primer
            </a>

            {/* Desktop Navigation */}
            <div className="nav-links d-none d-md-flex">
              <a href="/" className="nav-link">
                Home
              </a>
              <a href="/search" className="nav-link">
                Search Cards
              </a>
              <a href="/favorites" className="nav-link">
                My Favorites
              </a>
              <a href="/profile" className="nav-link">
                Profile
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="d-md-none btn-outline"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                padding: '0.5rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1.5rem'
              }}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="d-md-none" style={{
              background: 'white',
              borderTop: '1px solid #e9ecef',
              padding: '1rem 0'
            }}>
              <div className="container">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a
                    href="/"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </a>
                  <a
                    href="/search"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Search Cards
                  </a>
                  <a
                    href="/favorites"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Favorites
                  </a>
                  <a
                    href="/profile"
                    className="nav-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </a>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          background: 'white',
          borderTop: '1px solid #e9ecef',
          padding: '2rem 0',
          marginTop: '4rem',
          textAlign: 'center',
          color: '#6c757d'
        }}>
          <div className="container">
            <p style={{ marginBottom: '0.5rem' }}>
              Made for Magic: The Gathering beginners
            </p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              Card data provided by{' '}
              <a
                href="https://scryfall.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007bff' }}
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
