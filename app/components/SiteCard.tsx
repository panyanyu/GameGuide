'use client';

import { Site } from '../types';

interface SiteCardProps {
  site: Site;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  favoriteLabel?: string;
  unfavoriteLabel?: string;
  visitText?: string;
}

export default function SiteCard({
  site,
  isFavorite,
  onToggleFavorite,
  favoriteLabel = '添加收藏',
  unfavoriteLabel = '取消收藏',
  visitText = '访问 →',
}: SiteCardProps) {
  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className="site-card"
    >
      <div className="site-card-content">
        <p className="site-tag">{site.tag}</p>
        <h3>{site.name}</h3>
        <p>{site.description}</p>
      </div>
      <div className="site-card-footer">
        <button
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
          aria-label={isFavorite ? unfavoriteLabel : favoriteLabel}
          type="button"
        >
          {isFavorite ? '★' : '☆'}
        </button>
        <span className="visit-link">{visitText}</span>
      </div>
    </a>
  );
}
