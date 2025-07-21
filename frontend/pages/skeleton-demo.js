import { useState } from "react";
import Layout from "../components/Layout/Layout";
import Skeleton, {
  CardSkeleton,
  SearchCardSkeleton,
  CardListSkeleton,
  SearchResultsSkeleton,
  UserListSkeleton,
  CardPreviewSkeleton,
  TableSkeleton,
  TextSkeleton,
  MechanicCardSkeleton,
  MechanicsGridSkeleton,
} from "../components/UI/Skeleton";

export default function SkeletonDemoPage() {
  const [animation, setAnimation] = useState("pulse");

  return (
    <Layout title="Skeleton Loading Demo - Planeswalker's Primer">
      <div className="container page-content">
        <div className="text-center mb-3">
          <h1>Skeleton Loading Components</h1>
          <p>Demo page for skeleton loading states</p>
        </div>

        {/* Animation Control */}
        <div className="card mb-3">
          <h3>Animation Style</h3>
          <div className="d-flex gap-2">
            <button
              onClick={() => setAnimation("pulse")}
              className={animation === "pulse" ? "btn btn-primary" : "btn btn-secondary"}
            >
              Pulse
            </button>
            <button
              onClick={() => setAnimation("shimmer")}
              className={animation === "shimmer" ? "btn btn-primary" : "btn btn-secondary"}
            >
              Shimmer
            </button>
          </div>
        </div>

        {/* Basic Skeleton Examples */}
        <div className="card mb-3">
          <h3>Basic Skeletons</h3>
          <div className="mb-2">
            <p>Default skeleton (100% width, 20px height):</p>
            <Skeleton animation={animation} />
          </div>
          <div className="mb-2">
            <p>Custom dimensions:</p>
            <Skeleton width="200px" height="40px" animation={animation} />
          </div>
          <div className="mb-2">
            <p>Circular skeleton:</p>
            <Skeleton width="60px" height="60px" borderRadius="50%" animation={animation} />
          </div>
        </div>

        {/* Text Skeleton */}
        <div className="card mb-3">
          <h3>Text Content Skeleton</h3>
          <TextSkeleton lines={3} lastLineWidth="70%" />
        </div>

        {/* Card Skeleton */}
        <div className="card mb-3">
          <h3>Card Skeleton</h3>
          <div style={{ maxWidth: "300px" }}>
            <CardSkeleton showFavouriteButton={true} />
          </div>
        </div>

        {/* Search Card Skeleton */}
        <div className="card mb-3">
          <h3>Search Card Skeleton</h3>
          <div className="cards-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            <SearchCardSkeleton />
            <SearchCardSkeleton />
            <SearchCardSkeleton />
          </div>
        </div>

        {/* Card List Skeleton */}
        <div className="card mb-3">
          <h3>Card List Skeleton (Grid of 4)</h3>
          <CardListSkeleton count={4} showFavouriteButtons={true} />
        </div>

        {/* Search Results Skeleton */}
        <div className="card mb-3">
          <h3>Search Results Skeleton</h3>
          <SearchResultsSkeleton count={6} />
        </div>

        {/* User List Skeleton */}
        <div className="card mb-3">
          <h3>User List Skeleton</h3>
          <div style={{ maxWidth: "400px" }}>
            <UserListSkeleton count={3} />
          </div>
        </div>

        {/* Card Preview Skeleton */}
        <div className="card mb-3">
          <h3>Card Preview Skeleton</h3>
          <div style={{ maxWidth: "600px" }}>
            <CardPreviewSkeleton />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="card mb-3">
          <h3>Table Skeleton</h3>
          <TableSkeleton rows={5} columns={4} />
        </div>

        {/* Mechanic Card Skeleton */}
        <div className="card mb-3">
          <h3>Mechanic Card Skeleton</h3>
          <div style={{ maxWidth: "300px" }}>
            <MechanicCardSkeleton />
          </div>
        </div>

        {/* Mechanics Grid Skeleton */}
        <div className="card mb-3">
          <h3>Mechanics Grid Skeleton</h3>
          <MechanicsGridSkeleton count={6} />
        </div>

        {/* Usage Example */}
        <div className="card mb-3">
          <h3>Usage Example</h3>
          <pre className="code-block">
            <code>{`// Import skeleton components
import { CardListSkeleton } from "../components/UI/Skeleton";

// Use in loading state
if (loading) {
  return <CardListSkeleton count={8} />;
}

// Or with custom animation
<Skeleton
  width="200px"
  height="40px"
  animation="shimmer"
  borderRadius="8px"
/>`}</code>
          </pre>
        </div>

        {/* Real vs Skeleton Comparison */}
        <div className="card mb-3">
          <h3>Real Content vs Skeleton</h3>
          <div className="doc-grid">
            <div>
              <h4>Skeleton State</h4>
              <div className="card">
                <Skeleton width="60%" height="24px" className="mb-2" />
                <TextSkeleton lines={2} />
              </div>
            </div>
            <div>
              <h4>Loaded State</h4>
              <div className="card">
                <h3 className="card-title">Real Content</h3>
                <p>This is what the content looks like when loaded.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
