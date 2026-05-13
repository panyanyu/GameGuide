'use client';

import { useState } from 'react';
import { NewsItem } from '../hooks/useNewsFeed';

interface NewsCardProps {
  item: NewsItem;
  onImageClick: (src: string) => void;
}

const SOURCE_CONFIG: Record<string, { label: string; labelEn: string; color: string; bg: string }> = {
  steam: { label: 'Steam', labelEn: 'Steam', color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.15)' },
  '3dm': { label: '3DM', labelEn: '3DM', color: '#a78bfa', bg: 'rgba(139, 92, 246, 0.15)' },
  gamersky: { label: '游民星空', labelEn: 'Gamersky', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.15)' },
  nga: { label: 'NGA', labelEn: 'NGA', color: '#4ade80', bg: 'rgba(74, 222, 128, 0.15)' },
};

function formatDate(dateStr: string, locale: string = 'zh'): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return locale === 'zh' ? '刚刚' : 'Just now';
  if (hours < 24) return locale === 'zh' ? `${hours}小时前` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return locale === 'zh' ? `${days}天前` : `${days}d ago`;
  return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US');
}

export default function NewsCard({ item, onImageClick }: NewsCardProps) {
  const [imgError, setImgError] = useState(false);
  const config = SOURCE_CONFIG[item.source] || { label: item.source, labelEn: item.source, color: '#8ca0ff', bg: 'rgba(140, 160, 255, 0.15)' };

  const handleImageClick = () => {
    if (item.thumbnail && !imgError) {
      onImageClick(item.thumbnail);
    }
  };

  return (
    <article className="news-card news-card-horizontal">
      {item.thumbnail && !imgError ? (
        <div className="news-card-thumb" onClick={handleImageClick}>
          <img
            src={item.thumbnail}
            alt={item.title}
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="news-card-thumb news-card-thumb-placeholder" style={{ background: config.bg }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={config.color} strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      )}
      <div className="news-card-content">
        <div className="news-card-meta">
          <span className="news-source-tag" style={{ background: config.bg, color: config.color }}>
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
      </div>
    </article>
  );
}