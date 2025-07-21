import CardDisplay from "./CardDisplay";
import Loading from "../UI/Loading";
import { CardErrorBoundary } from "../ErrorBoundary";
import { CardListSkeleton } from "../UI/Skeleton";

export default function CardList({
  cards = [],
  loading = false,
  error = "",
  currentUser,
  onFavouriteToggle,
  emptyMessage = "No cards found",
  showFavouriteButtons = true,
}) {
  if (loading) {
    return <CardListSkeleton count={8} showFavouriteButtons={showFavouriteButtons} />;
  }

  if (error) {
    return <div className="error text-center mt-3 mb-3">{error}</div>;
  }

  if (cards.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🃏</div>
        <h3 className="empty-state-title">{emptyMessage}</h3>
        <p className="empty-state-text">
          Try adjusting your search terms or browse different abilities
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Cards Grid */}
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div
            key={card.id || index}
            className={`fade-in fade-in-delay-${Math.min(index + 1, 5)}`}
          >
            <CardErrorBoundary>
              <CardDisplay
                card={card}
                currentUser={currentUser}
                onFavouriteToggle={onFavouriteToggle}
                showFavouriteButton={showFavouriteButtons}
              />
            </CardErrorBoundary>
          </div>
        ))}
      </div>

      {/* Load More Message */}
      {cards.length >= 20 && (
        <div className="more-cards-section">
          <div className="more-cards-icon">📚</div>
          <h4 className="more-cards-title">More cards available</h4>
          <p className="more-cards-text">
            Refine your search or try different keywords to find specific cards
          </p>
        </div>
      )}
    </div>
  );
}
