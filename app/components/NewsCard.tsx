'use client';

import { useState } from 'react';
import { NewsItem } from '../hooks/useNewsFeed';

interface NewsCardProps {
  item: NewsItem;
  onImageClick: (src: string) => void;
}

const SOURCE_CONFIG = {
  steam: { label: 'Steam', color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.15)' },
  '3dm': { label: '3DM', color: '#a78bfa', bg: 'rgba(139, 92, 246, 0.15)' },
  gamersky: { label: '游民星空', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.15)' },
  nga: { label: 'NGA', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)' },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}天前`;
  return date.toLocaleDateString('zh-CN');
}

export default function NewsCard({ item, onImageClick }: NewsCardProps) {
  const [imgError, setImgError] = useState(false);
  const config = SOURCE_CONFIG[item.source];

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <article className="news-card">
      <div className="news-card-header">
        <span
          className="news-source-tag"
          style={{ background: config.bg, color: config.color }}
        >
          {config.label}
        </span>
        <span className="news-date">{formatDate(item.pubDate)}</span>
      </div>
      <h3 className="news-card-title">
        <a href={item.link} target="_blank" rel="noopener noreferrer">
          {item.title}
        </a>
      </h3>
      {item.description && (
        <p className="news-card-desc">{item.description}</p>
      )}
      {item.thumbnail && !imgError ? (
        <div className="news-card-image">
          <img
            src={item.thumbnail}
            alt={item.title}
            onError={handleImageError}
            onClick={() => onImageClick(item.thumbnail!)}
          />
        </div>
      ) : (
        <div
          className="news-card-icon"
          style={{ background: config.bg }}
          onClick={() => item.thumbnail && onImageClick(item.thumbnail)}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill={config.color}>
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={config.color} strokeWidth="2" fill="none" />
          </svg>
        </div>
      )}
    </article>
  );
}