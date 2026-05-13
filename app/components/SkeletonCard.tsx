'use client';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-header">
        <div className="skeleton-tag" />
        <div className="skeleton-favorite" />
      </div>
      <div className="skeleton-title" />
      <div className="skeleton-desc" />
      <div className="skeleton-link" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}