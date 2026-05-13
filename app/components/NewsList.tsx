'use client';

import { useEffect, useRef, useCallback } from 'react';
import { NewsItem } from '../hooks/useNewsFeed';
import NewsCard from './NewsCard';

interface NewsListProps {
  items: NewsItem[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onImageClick: (src: string) => void;
}

export default function NewsList({
  items,
  loading,
  hasMore,
  onLoadMore,
  onImageClick,
}: NewsListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading) {
        onLoadMore();
      }
    },
    [hasMore, loading, onLoadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="news-list">
      <div className="news-list-vertical">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} onImageClick={onImageClick} />
        ))}
      </div>
      <div ref={loadMoreRef} className="load-more-trigger">
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <p className="no-more">All news loaded</p>
        )}
      </div>
    </div>
  );
}
