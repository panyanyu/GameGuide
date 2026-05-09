import { Site } from '../types';

interface SiteCardProps {
  site: Site;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function SiteCard({ site, isFavorite, onToggleFavorite }: SiteCardProps) {
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
          aria-label={isFavorite ? '取消收藏' : '添加收藏'}
          type="button"
        >
          {isFavorite ? '★' : '☆'}
        </button>
        <span className="visit-link">访问 →</span>
      </div>
    </a>
  );
}
