# GameGuide 新闻页面实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建独立新闻页面 `/news`，瀑布流布局显示多源 RSS 新闻，支持无限滚动和图片预览

**Architecture:** 新建 `app/news/page.tsx` 页面，重构 `useNews` 为 `useNewsFeed` 支持分页，创建 `NewsCard`/`NewsList`/`ImageModal` 组件，首页保留简化新闻入口

**Tech Stack:** Next.js, TypeScript, CSS Columns (瀑布流), Intersection Observer (无限滚动)

---

## File Structure

```
app/
├── hooks/
│   ├── useNews.ts           # 现有 hook（保留）
│   └── useNewsFeed.ts       # 新建：新闻数据 hook（支持分页）
├── components/
│   ├── NewsSection.tsx      # 现有（首页简化版）
│   ├── NewsCard.tsx         # 新建：新闻卡片
│   ├── NewsList.tsx         # 新建：瀑布流列表
│   └── ImageModal.tsx       # 新建：图片预览弹窗
├── news/
│   └── page.tsx             # 新建：新闻页面
└── page.tsx                 # 修改：简化首页新闻入口
```

---

## Task 1: Create useNewsFeed Hook

**Files:**
- Create: `app/hooks/useNewsFeed.ts`

- [ ] **Step 1: Create useNewsFeed hook with pagination support**

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: 'steam' | '3dm' | 'gamersky' | 'nga';
  pubDate: string;
  description: string;
  thumbnail: string | null;
}

interface FeedConfig {
  url: string;
  source: NewsItem['source'];
  name: string;
}

const RSS_FEEDS: FeedConfig[] = [
  {
    url: 'https://store.steampowered.com/feeds/news/?l=schinese',
    source: 'steam',
    name: 'Steam',
  },
  {
    url: 'https://www.gamersky.com/news/rss.xml',
    source: 'gamersky',
    name: '游民星空',
  },
  {
    url: 'https://www.3dmgame.com/news/rss.xml',
    source: '3dm',
    name: '3DM',
  },
  {
    url: 'https://nga.178.com/rss/news.xml',
    source: 'nga',
    name: 'NGA',
  },
];

const API_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';
const PAGE_SIZE = 20;

export function useNewsFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<NewsItem[]>([]);

  const fetchAllNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        RSS_FEEDS.map(async (feed) => {
          try {
            const response = await fetch(
              `${API_BASE}${encodeURIComponent(feed.url)}`
            );
            if (!response.ok) return [];
            const data = await response.json();
            if (data.status !== 'ok') return [];
            return (data.items || [])
              .filter((item: any) => item.title && item.link)
              .map((item: any, idx: number) => ({
                id: `${feed.source}-${idx}-${Date.now()}`,
                title: item.title,
                link: item.link,
                source: feed.source,
                pubDate: item.pubDate,
                description: item.description?.replace(/<[^>]*>/g, '').slice(0, 100) || '',
                thumbnail: null,
              }));
          } catch {
            return [];
          }
        })
      );

      const flat = results.flat().sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );

      setAllItems(flat);
      setItems(flat.slice(0, PAGE_SIZE));
      setHasMore(flat.length > PAGE_SIZE);
      setPage(1);
    } catch (err) {
      setError((err as Error).message ?? '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    const nextItems = allItems.slice(0, nextPage * PAGE_SIZE);
    setItems(nextItems);
    setPage(nextPage);
    setHasMore(nextItems.length < allItems.length);
  }, [loading, hasMore, page, allItems]);

  useEffect(() => {
    fetchAllNews();
  }, [fetchAllNews]);

  return { items, loading, error, hasMore, loadMore, refresh: fetchAllNews };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/hooks/useNewsFeed.ts
git commit -m "feat: add useNewsFeed hook with pagination support"
```

---

## Task 2: Create ImageModal Component

**Files:**
- Create: `app/components/ImageModal.tsx`

- [ ] **Step 1: Create ImageModal component**

```typescript
'use client';

import { useEffect } from 'react';

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add ImageModal styles to globals.css**

Add before `.adsense-block`:

```css
/* Image Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.modal-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.modal-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  padding: 8px;
  line-height: 1;
}

.modal-close:hover {
  opacity: 0.8;
}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/ImageModal.tsx app/globals.css
git commit -m "feat: add ImageModal component for image preview"
```

---

## Task 3: Create NewsCard Component

**Files:**
- Create: `app/components/NewsCard.tsx`

- [ ] **Step 1: Create NewsCard component**

```typescript
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
```

- [ ] **Step 2: Add NewsCard styles to globals.css**

Add after `.modal-close` styles:

```css
/* News Card */
.news-card {
  break-inside: avoid;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 12px;
  background: rgba(9, 14, 29, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.news-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.news-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.news-source-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.news-date {
  color: #8ca0ff;
  font-size: 0.8rem;
}

.news-card-title {
  margin: 0 0 8px 0;
  font-size: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card-title a {
  color: #d9e0ff;
  text-decoration: none;
}

.news-card-title a:hover {
  text-decoration: underline;
}

.news-card-desc {
  margin: 0 0 12px 0;
  color: #8ca0ff;
  font-size: 0.85rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card-image {
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.news-card-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.news-card-image:hover img {
  transform: scale(1.02);
}

.news-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  border-radius: 8px;
  cursor: pointer;
}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/NewsCard.tsx app/globals.css
git commit -m "feat: add NewsCard component"
```

---

## Task 4: Create NewsList Component

**Files:**
- Create: `app/components/NewsList.tsx`

- [ ] **Step 1: Create NewsList component**

```typescript
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
      <div className="masonry-grid">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} onImageClick={onImageClick} />
        ))}
      </div>
      <div ref={loadMoreRef} className="load-more-trigger">
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>加载中...</p>
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <p className="no-more">已加载全部新闻</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add NewsList styles to globals.css**

Add after `.news-card-icon` styles:

```css
/* News List & Masonry */
.news-list {
  padding: 0 16px;
}

.masonry-grid {
  column-count: 3;
  column-gap: 16px;
}

@media (max-width: 1024px) {
  .masonry-grid {
    column-count: 2;
  }
}

@media (max-width: 640px) {
  .masonry-grid {
    column-count: 1;
  }
}

.load-more-trigger {
  padding: 32px;
  text-align: center;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #8ca0ff;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-more {
  color: #8ca0ff;
  font-size: 0.9rem;
}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/NewsList.tsx app/globals.css
git commit -m "feat: add NewsList component with infinite scroll"
```

---

## Task 5: Create News Page

**Files:**
- Create: `app/news/page.tsx`

- [ ] **Step 1: Create news page**

```typescript
'use client';

import { useState } from 'react';
import Head from 'next/head';
import { useNewsFeed } from '../hooks/useNewsFeed';
import NewsList from '../components/NewsList';
import ImageModal from '../components/ImageModal';

export default function NewsPage() {
  const { items, loading, error, hasMore, loadMore, refresh } = useNewsFeed();
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <Head>
        <title>游戏资讯 - GameGuide</title>
        <meta name="description" content="汇集 Steam、3DM、游民星空、NGA 等游戏媒体的最新资讯" />
      </Head>
      <main className="page-shell">
        <section className="news-page-header">
          <h1>🎮 游戏资讯</h1>
          <button
            className="refresh-button"
            onClick={refresh}
            disabled={loading}
            type="button"
          >
            {loading ? '刷新中...' : '刷新'}
          </button>
        </section>

        {error ? (
          <div className="news-error">
            <p>⚠ {error}</p>
            <button className="refresh-button" onClick={refresh} type="button">
              重试
            </button>
          </div>
        ) : (
          <NewsList
            items={items}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onImageClick={(src) => setModalImage({ src, alt: '' })}
          />
        )}

        {modalImage && (
          <ImageModal
            src={modalImage.src}
            alt={modalImage.alt}
            onClose={() => setModalImage(null)}
          />
        )}
      </main>
    </>
  );
}
```

- [ ] **Step 2: Add news page header styles to globals.css**

Add after `.hero` styles:

```css
/* News Page */
.news-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  margin-bottom: 24px;
}

.news-page-header h1 {
  margin: 0;
  font-size: 1.75rem;
}

@media (max-width: 640px) {
  .news-page-header {
    padding: 16px;
  }

  .news-page-header h1 {
    font-size: 1.5rem;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/news/page.tsx app/globals.css
git commit -m "feat: add news page with masonry layout"
```

---

## Task 6: Update Homepage News Section

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/components/NewsSection.tsx`

- [ ] **Step 1: Simplify homepage news section**

Update `app/page.tsx` - replace the existing news section import and usage with:

```typescript
import NewsSection from './components/NewsSection';
```

And replace the `<NewsSection ... />` block with:

```tsx
<NewsSection items={items.slice(0, 5)} loading={loading} error={error} onRefresh={refresh} />
```

- [ ] **Step 2: Update NewsSection to accept items prop**

Update `app/components/NewsSection.tsx`:

```typescript
'use client';

import { NewsItem } from '../hooks/useNews';

interface NewsSectionProps {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const SOURCE_LABELS: Record<string, string> = {
  steam: 'Steam',
};

const SOURCE_COLORS: Record<string, { bg: string; text: string }> = {
  steam: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa' },
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
```

- [ ] **Step 3: Add "View more" link style and time style**

Add to globals.css after `.news-list` styles:

```css
.news-more-link {
  font-size: 0.9rem;
  color: #60a5fa;
  text-decoration: none;
}

.news-more-link:hover {
  text-decoration: underline;
}

.news-time {
  margin-left: auto;
  color: #8ca0ff;
  font-size: 0.8rem;
  white-space: nowrap;
}

.news-item a {
  display: flex;
  align-items: center;
  gap: 10px;
}
```

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/components/NewsSection.tsx app/globals.css
git commit -m "feat: simplify homepage news section with link to full page"
```

---

## Task 7: Final Testing

- [ ] **Step 1: Run TypeScript check**

```bash
cd "f:/项目/GameGuide" && npx tsc --noEmit
```

- [ ] **Step 2: Start dev server and verify**

```bash
cd "f:/项目/GameGuide" && npm run dev
```

Verify:
- `/news` page loads with masonry grid
- RSS feeds from all 4 sources load correctly
- Infinite scroll works
- Image modal opens on image click
- Homepage shows simplified news section with link to full page

- [ ] **Step 3: Commit final changes**

```bash
git add -A && git commit -m "feat: complete news page with masonry layout and infinite scroll

- Add /news page with waterfall layout
- Integrate 4 RSS feeds: Steam, 3DM, Gamersky, NGA
- Add NewsCard, NewsList, ImageModal components
- Add useNewsFeed hook with pagination
- Simplify homepage news section

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

- [ ] All spec requirements covered
- [ ] No placeholder code (TBD, TODO)
- [ ] Type consistency (NewsItem interface used correctly)
- [ ] All imports correct
- [ ] Error handling implemented
- [ ] Loading state implemented
- [ ] External links have noopener noreferrer
- [ ] Responsive design works on mobile
