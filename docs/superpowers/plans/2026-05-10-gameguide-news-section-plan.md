# GameGuide 新闻区块实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 添加游戏新闻区块，显示 Steam 新闻和游民星空的最新资讯

**Architecture:** 创建 useNews hook 获取 RSS 数据，创建 NewsSection 组件展示新闻列表，集成到 page.tsx

**Tech Stack:** Next.js, TypeScript, rss2json API

---

## File Structure

```
app/
├── components/
│   └── NewsSection.tsx    # 新闻区块组件
├── hooks/
│   └── useNews.ts         # 新闻数据获取 hook
└── page.tsx               # 集成新闻区块
```

---

## Task 1: Create useNews Hook

**Files:**
- Create: `app/hooks/useNews.ts`

- [ ] **Step 1: Create useNews hook**

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NewsItem {
  title: string;
  link: string;
  source: 'steam' | 'gamersky';
  pubDate: string;
}

const RSS_FEEDS = [
  {
    url: 'https://store.steampowered.com/feeds/news/?l=schinese',
    source: 'steam' as const,
  },
  {
    url: 'https://www.gamersky.com/news/rss.xml',
    source: 'gamersky' as const,
  },
];

const API_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';

export function useNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        RSS_FEEDS.map(async (feed) => {
          const response = await fetch(
            `${API_BASE}${encodeURIComponent(feed.url)}`
          );
          if (!response.ok) throw new Error('网络请求失败');
          const data = await response.json();
          if (data.status !== 'ok') throw new Error('API 返回错误');
          return (data.items || [])
            .slice(0, 3)
            .filter((item: any) => item.title && item.link)
            .map((item: any) => ({
              title: item.title,
              link: item.link,
              source: feed.source,
              pubDate: item.pubDate,
            }));
        })
      );

      const allItems = results
        .flat()
        .sort(
          (a, b) =>
            new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        )
        .slice(0, 6);

      setItems(allItems);
    } catch (err) {
      setError((err as Error).message ?? '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { items, loading, error, refresh: fetchNews };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/hooks/useNews.ts
git commit -m "feat: add useNews hook for RSS feed fetching"
```

---

## Task 2: Create NewsSection Component

**Files:**
- Create: `app/components/NewsSection.tsx`

- [ ] **Step 1: Create NewsSection component**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add app/components/NewsSection.tsx
git commit -m "feat: add NewsSection component"
```

---

## Task 3: Add NewsSection Styles

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add news section styles**

Add before `.adsense-block` or at the end of the file:

```css
/* News Section */
.news-section {
  margin-top: 36px;
  padding: 24px 28px;
  border-radius: 24px;
  background: rgba(9, 14, 29, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.news-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.news-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.news-item a {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
}

.news-item a:hover {
  opacity: 0.8;
}

.news-item a:hover .news-title {
  text-decoration: underline;
}

.news-source {
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}

.news-title {
  font-size: 0.95rem;
  color: #d9e0ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.news-loading,
.news-error,
.news-empty {
  padding: 32px;
  text-align: center;
  color: #8ca0ff;
}

.news-loading .loading-skeleton {
  height: 20px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 14px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.news-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: add styles for news section"
```

---

## Task 4: Integrate NewsSection into page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update imports**

Add to the imports section:
```typescript
import NewsSection from './components/NewsSection';
import { useNews } from './hooks/useNews';
```

- [ ] **Step 2: Add hook and render**

Add after the `useFavorites` hook call:
```typescript
const { items, loading, error, refresh } = useNews();
```

Add in the JSX, after the `</section>` of adsense-block and before the `section-block` of games:
```tsx
<NewsSection
  items={items}
  loading={loading}
  error={error}
  onRefresh={refresh}
/>
```

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: integrate news section into page"
```

---

## Task 5: Final Testing

- [ ] **Step 1: Run TypeScript check**

```bash
cd "f:/项目/GameGuide" && npx tsc --noEmit
```

- [ ] **Step 2: Start dev server and verify**

```bash
cd "f:/项目/GameGuide" && npm run dev
```
Verify the news section loads and displays correctly.

- [ ] **Step 3: Commit final changes**

```bash
git add -A && git commit -m "feat: add game news section with RSS feeds

- Integrate Steam and gamersky RSS feeds
- Add NewsSection component with loading/error states
- Add useNews hook for data fetching

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
