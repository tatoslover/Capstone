import CardDisplay from './CardDisplay';
import Loading from '../UI/Loading';

export default function CardList({
  cards = [],
  loading = false,
  error = '',
  currentUser,
  onFavoriteToggle,
  emptyMessage = 'No cards found',
  showFavoriteButtons = true
}) {
  if (loading) {
    return <Loading message="Loading cards..." />;
  }

  if (error) {
    return (
      <div className="error" style={{ textAlign: 'center', margin: '2rem 0' }}>
        {error}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem 1rem',
        color: '#6c757d'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🃏</div>
        <h3 style={{ color: '#495057', marginBottom: '0.5rem' }}>
          {emptyMessage}
        </h3>
        <p style={{ fontSize: '0.9rem', margin: 0 }}>
          Try adjusting your search terms or browse different abilities
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <h3 style={{
          margin: 0,
          color: '#495057',
          fontSize: '1.25rem'
        }}>
          {cards.length} {cards.length === 1 ? 'card' : 'cards'} found
        </h3>
        <div style={{
          fontSize: '0.9rem',
          color: '#6c757d'
        }}>
          Showing results from Scryfall
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {cards.map((card, index) => (
          <div key={card.id || index} style={{
            opacity: 0,
            animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`
          }}>
            <CardDisplay
              card={card}
              currentUser={currentUser}
              onFavoriteToggle={onFavoriteToggle}
              showFavoriteButton={showFavoriteButtons}
            />
          </div>
        ))}
      </div>

      {/* Load More Message */}
      {cards.length >= 20 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          background: '#f8f9fa',
          borderRadius: '0.5rem',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📚</div>
          <h4 style={{ color: '#495057', marginBottom: '0.5rem' }}>
            More cards available
          </h4>
          <p style={{
            fontSize: '0.9rem',
            color: '#6c757d',
            margin: 0
          }}>
            Refine your search to find more specific results
          </p>
        </div>
      )}

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .cards-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .cards-grid {
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
