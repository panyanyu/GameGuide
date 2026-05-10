'use client';

import { NewsItem } from '../hooks/useNewsFeed';

interface NewsSectionProps {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const SOURCE_LABELS: Record<string, string> = {
  steam: 'Steam',
  '3dm': '3DM',
  gamersky: '游民星空',
  nga: 'NGA',
};

const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  steam: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
  '3dm': { bg: 'rgba(139, 92, 246, 0.15)', text: '#a78bfa' },
  gamersky: { bg: 'rgba(251, 146, 60, 0.15)', text: '#fb923c' },
  nga: { bg: 'rgba(74, 222, 128, 0.15)', text: '#4ade80' },
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
        <a href="/news" className="news-more-link">
          查看更多 →
        </a>
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
                    background: SOURCE_COLORS[item.source]?.bg,
                    color: SOURCE_COLORS[item.source]?.text,
                  }}
                >
                  {SOURCE_LABELS[item.source] || item.source}
                </span>
                <span className="news-title">{item.title}</span>
                <span className="news-time">{formatDate(item.pubDate)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
