'use client';

import { NewsItem } from '../hooks/useNews';

interface NewsSectionProps {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const SOURCE_LABELS = {
  steam: 'Steam',
  gamersky: '游民星空',
};

const SOURCE_COLORS = {
  steam: {
    bg: 'rgba(59, 130, 246, 0.15)',
    text: '#60a5fa',
  },
  gamersky: {
    bg: 'rgba(251, 146, 60, 0.15)',
    text: '#fb923c',
  },
};

export default function NewsSection({
  items,
  loading,
  error,
  onRefresh,
}: NewsSectionProps) {
  return (
    <section className="news-section">
      <div className="news-header">
        <h2>🎮 游戏资讯</h2>
        <button
          className="refresh-button"
          onClick={onRefresh}
          disabled={loading}
          type="button"
        >
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="news-loading">
          <div className="loading-skeleton" />
          <div className="loading-skeleton" />
          <div className="loading-skeleton" />
          <p>正在加载最新资讯...</p>
        </div>
      ) : error && items.length === 0 ? (
        <div className="news-error">
          <p>⚠ {error}</p>
          <button className="refresh-button" onClick={onRefresh} type="button">
            重试
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="news-empty">
          <p>暂无最新资讯</p>
        </div>
      ) : (
        <ul className="news-list">
          {items.map((item, index) => (
            <li key={`${item.link}-${index}`} className="news-item">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  className="news-source"
                  style={{
                    background: SOURCE_COLORS[item.source].bg,
                    color: SOURCE_COLORS[item.source].text,
                  }}
                >
                  {SOURCE_LABELS[item.source]}
                </span>
                <span className="news-title">{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
