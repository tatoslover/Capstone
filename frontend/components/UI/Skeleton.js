import React from "react";

// Base skeleton component with customizable styles
export default function Skeleton({
  width = "100%",
  height = "20px",
  borderRadius = "4px",
  className = "",
  variant = "default",
  animation = "pulse"
}) {
  const baseStyles = {
    display: "inline-block",
    backgroundColor: "var(--skeleton-base, #374151)",
    backgroundImage: animation === "shimmer"
      ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
      : "none",
    backgroundSize: "200px 100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "-200px 0",
    width,
    height,
    borderRadius,
    position: "relative",
    overflow: "hidden",
  };

  const animationClass = animation === "pulse" ? "skeleton-pulse" : "skeleton-shimmer";

  return (
    <span
      className={`skeleton ${animationClass} ${className}`}
      style={baseStyles}
      aria-hidden="true"
    />
  );
}

// Card skeleton component
export function CardSkeleton({ showFavouriteButton = true }) {
  return (
    <div className="card mtg-card">
      <div className="card-header">
        <div className="card-header-row">
          <Skeleton width="60%" height="24px" />
          <Skeleton width="80px" height="20px" />
        </div>
      </div>

      <div className="card-image-container">
        <Skeleton
          width="100%"
          height="340px"
          borderRadius="8px"
          className="card-image-skeleton"
        />
      </div>

      <div className="card-body">
        <Skeleton width="40%" height="16px" className="mb-2" />
        <div className="mb-2">
          <Skeleton width="100%" height="14px" className="mb-1" />
          <Skeleton width="100%" height="14px" className="mb-1" />
          <Skeleton width="80%" height="14px" />
        </div>
      </div>

      <div className="card-footer">
        <div className="card-footer-row">
          <Skeleton width="60px" height="20px" borderRadius="12px" />
          {showFavouriteButton && (
            <Skeleton width="32px" height="32px" borderRadius="50%" />
          )}
        </div>
      </div>
    </div>
  );
}

// Search result card skeleton
export function SearchCardSkeleton() {
  return (
    <div className="search-card">
      <div className="search-card-image-container">
        <Skeleton
          width="100%"
          height="100%"
          borderRadius="8px"
          className="search-card-image-skeleton"
        />
      </div>
      <Skeleton
        width="32px"
        height="32px"
        borderRadius="50%"
        className="favourite-btn-skeleton"
      />
    </div>
  );
}

// Card list skeleton
export function CardListSkeleton({ count = 8, showFavouriteButtons = true }) {
  return (
    <div className="cards-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`fade-in fade-in-delay-${Math.min(index + 1, 5)}`}>
          <CardSkeleton showFavouriteButton={showFavouriteButtons} />
        </div>
      ))}
    </div>
  );
}

// Search results skeleton
export function SearchResultsSkeleton({ count = 10 }) {
  return (
    <div className="cards-grid">
      {Array.from({ length: count }).map((_, index) => (
        <SearchCardSkeleton key={index} />
      ))}
    </div>
  );
}

// User list skeleton
export function UserListSkeleton({ count = 5 }) {
  return (
    <div className="user-list">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="user-item-skeleton">
          <Skeleton width="100%" height="40px" className="mb-1" />
        </div>
      ))}
    </div>
  );
}

// Card preview skeleton
export function CardPreviewSkeleton() {
  return (
    <div className="card-preview">
      <div className="card-preview-header">
        <Skeleton width="70%" height="28px" />
        <Skeleton width="100px" height="24px" />
      </div>

      <div className="card-preview-image-container">
        <Skeleton width="100%" height="100%" borderRadius="8px" />
      </div>

      <div className="card-preview-content">
        <div className="card-preview-type">
          <Skeleton width="60%" height="18px" />
        </div>

        <div className="card-preview-oracle">
          <Skeleton width="100%" height="14px" className="mb-1" />
          <Skeleton width="100%" height="14px" className="mb-1" />
          <Skeleton width="90%" height="14px" className="mb-1" />
          <Skeleton width="70%" height="14px" />
        </div>

        <div className="card-preview-stats">
          <Skeleton width="80px" height="20px" borderRadius="12px" />
          <Skeleton width="60px" height="20px" />
        </div>

        <div className="card-preview-footer">
          <Skeleton width="120px" height="16px" />
          <Skeleton width="32px" height="32px" borderRadius="50%" />
        </div>
      </div>
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <table className="doc-table">
      <thead>
        <tr>
          {Array.from({ length: columns }).map((_, index) => (
            <th key={index}>
              <Skeleton width="80%" height="20px" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <td key={colIndex}>
                <Skeleton
                  width={colIndex === 0 ? "60%" : "90%"}
                  height="16px"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Text content skeleton
export function TextSkeleton({ lines = 3, lastLineWidth = "60%" }) {
  return (
    <div className="text-skeleton">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? lastLineWidth : "100%"}
          height="16px"
          className="mb-1"
        />
      ))}
    </div>
  );
}

// Mechanic card skeleton
export function MechanicCardSkeleton() {
  return (
    <div className="mechanic-card">
      <div className="mechanic-card-title">
        <Skeleton width="70%" height="20px" />
      </div>
      <div className="mechanic-card-badges">
        <Skeleton width="80px" height="24px" borderRadius="12px" />
        <Skeleton width="60px" height="24px" borderRadius="12px" />
      </div>
    </div>
  );
}

// Mechanics grid skeleton
export function MechanicsGridSkeleton({ count = 12 }) {
  return (
    <div className="mechanics-grid">
      {Array.from({ length: count }).map((_, index) => (
        <MechanicCardSkeleton key={index} />
      ))}
    </div>
  );
}
