# GameGuide Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all GameGuide improvements including tag navigation, favorites, keyboard shortcuts, mobile optimization, and SEO enhancements.

**Architecture:** Refactor the page into smaller components (CategoryNav, SiteCard, SearchBar, FavoritesPanel) with custom hooks for favorites and keyboard shortcuts. Data is separated into typed constants.

**Tech Stack:** Next.js 14 App Router, TypeScript, CSS Modules/Global CSS, localStorage

---

## File Structure

```
app/
├── page.tsx                    # Main page (refactored)
├── components/
│   ├── CategoryNav.tsx         # Category navigation bar
│   ├── SiteCard.tsx            # Site card component with favorite button
│   ├── SearchBar.tsx           # Search bar with clear button
│   └── FavoritesPanel.tsx      # Favorites panel/tab
├── hooks/
│   ├── useFavorites.ts         # Favorites localStorage logic
│   └── useKeyboard.ts          # Keyboard shortcuts logic
├── data/
│   └── sites.ts                # Curated sites data
└── types/
    └── index.ts                # TypeScript types

app/globals.css                 # Add scroll-behavior, mobile styles
app/layout.tsx                  # Add SEO structured data
```

---

## Task 1: Create TypeScript Types

**Files:**
- Create: `app/types/index.ts`

- [ ] **Step 1: Create types file**

```typescript
export interface Site {
  name: string;
  description: string;
  url: string;
  tag: string;
}
```

---

## Task 2: Extract Sites Data

**Files:**
- Create: `app/data/sites.ts`
- Modify: `app/page.tsx` (remove inline `curatedSites` array)

- [ ] **Step 1: Create sites data file**

```typescript
import { Site } from '../types';

export const curatedSites: Site[] = [
  {
    name: 'Steam',
    description: '全球最大的PC游戏平台，提供折扣、社区和云存档。',
    url: 'https://store.steampowered.com',
    tag: '商店',
  },
  {
    name: 'Epic Games Store',
    description: '热门大作免费领取与独占游戏。',
    url: 'https://www.epicgames.com/store/zh-CN/',
    tag: '商店',
  },
  {
    name: 'GOG',
    description: '无DRM经典游戏与独立佳作收藏。',
    url: 'https://www.gog.com',
    tag: '商店',
  },
  {
    name: 'WeGame',
    description: '腾讯旗下游戏平台，支持国服游戏、促销与社区交流。',
    url: 'https://www.wegame.com.cn',
    tag: '商店',
  },
  {
    name: 'TapTap',
    description: '国内主流手游社区与移动游戏下载平台。',
    url: 'https://www.taptap.com',
    tag: '社区',
  },
  {
    name: 'Netease Games',
    description: '网易游戏官网，覆盖热门网游与手游新闻。',
    url: 'https://game.163.com',
    tag: '媒体',
  },
  {
    name: '17173',
    description: '中文游戏资讯、攻略与玩家交流社区。',
    url: 'https://www.17173.com',
    tag: '媒体',
  },
  {
    name: 'Bilibili 游戏',
    description: 'B站游戏频道，结合视频、直播与社区互动。',
    url: 'https://www.bilibili.com/v/game',
    tag: '直播',
  },
  {
    name: '4399',
    description: '经典网页游戏与小游戏平台，适合快速娱乐。',
    url: 'https://www.4399.com',
    tag: '工具',
  },
  {
    name: 'IGN',
    description: '游戏新闻、评测、攻略与新游专题。',
    url: 'https://www.ign.com',
    tag: '媒体',
  },
  {
    name: 'GameSpot',
    description: '最新游戏资讯、评测和视频内容。',
    url: 'https://www.gamespot.com',
    tag: '媒体',
  },
  {
    name: 'Metacritic',
    description: '汇总评分与新游口碑数据。',
    url: 'https://www.metacritic.com',
    tag: '数据',
  },
  {
    name: 'Kotaku',
    description: '深度游戏报道与业界观察。',
    url: 'https://kotaku.com',
    tag: '媒体',
  },
  {
    name: 'Polygon',
    description: '游戏文化、评论和原创专题。',
    url: 'https://www.polygon.com',
    tag: '社区',
  },
  {
    name: 'GameFAQs',
    description: '最全游戏攻略、FAQ和玩家问答。',
    url: 'https://www.gamefaqs.com',
    tag: '工具',
  },
  {
    name: 'Twitch',
    description: '实时游戏直播与互动社区。',
    url: 'https://www.twitch.tv',
    tag: '直播',
  },
  {
    name: 'itch.io',
    description: '独立游戏创作者和实验性作品聚集地。',
    url: 'https://itch.io',
    tag: '独立',
  },
  {
    name: 'Humble Bundle',
    description: '游戏礼包与慈善捐赠组合优惠。',
    url: 'https://www.humblebundle.com',
    tag: '优惠',
  },
];

export const allTags = ['全部', ...Array.from(new Set(curatedSites.map((s) => s.tag)))];
```

- [ ] **Step 2: Update page.tsx imports**

Add at top of `app/page.tsx`:
```typescript
import { curatedSites, allTags } from './data/sites';
import { Site } from './types';
```
Remove the inline `curatedSites` array from page.tsx.

- [ ] **Step 3: Commit**

```bash
git add app/types/index.ts app/data/sites.ts app/page.tsx
git commit -m "refactor: extract types and sites data"
```

---

## Task 3: Create useFavorites Hook

**Files:**
- Create: `app/hooks/useFavorites.ts`

- [ ] **Step 1: Create useFavorites hook**

```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'gameguide_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = useCallback((siteName: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(siteName)
        ? prev.filter((name) => name !== siteName)
        : [...prev, siteName];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (siteName: string) => favorites.includes(siteName),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
```

- [ ] **Step 2: Commit**

```bash
git add app/hooks/useFavorites.ts
git commit -m "feat: add useFavorites hook with localStorage"
```

---

## Task 4: Create useKeyboard Hook

**Files:**
- Create: `app/hooks/useKeyboard.ts`

- [ ] **Step 1: Create useKeyboard hook**

```typescript
'use client';

import { useEffect, useCallback, RefObject } from 'react';

interface UseKeyboardOptions {
  onSlash?: () => void;
  onEscape?: () => void;
  searchRef?: RefObject<HTMLInputElement | null>;
}

export function useKeyboard({ onSlash, onEscape, searchRef }: UseKeyboardOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === '/') {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          onSlash?.();
          searchRef?.current?.focus();
        }
      }

      if (event.key === 'Escape') {
        onEscape?.();
        searchRef?.current?.blur();
      }
    },
    [onSlash, onEscape, searchRef]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/hooks/useKeyboard.ts
git commit -m "feat: add useKeyboard hook for shortcuts"
```

---

## Task 5: Create SearchBar Component

**Files:**
- Create: `app/components/SearchBar.tsx`

- [ ] **Step 1: Create SearchBar component**

```typescript
'use client';

import { RefObject } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export default function SearchBar({ value, onChange, inputRef }: SearchBarProps) {
  return (
    <div className="search-panel">
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索游戏网站、资讯、攻略…"
        />
        {value && (
          <button
            className="clear-button"
            onClick={() => onChange('')}
            aria-label="清除搜索"
            type="button"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add clear button styles to globals.css**

Add after `.search-panel button`:
```css
.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-input-wrapper input {
  width: 100%;
}

.clear-button {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #d3d8ff;
  font-size: 16px;
  line-height: 1;
}

.clear-button:hover {
  background: rgba(255, 255, 255, 0.2);
}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/SearchBar.tsx app/globals.css
git commit -m "feat: add SearchBar component with clear button"
```

---

## Task 6: Create CategoryNav Component

**Files:**
- Create: `app/components/CategoryNav.tsx`

- [ ] **Step 1: Create CategoryNav component**

```typescript
'use client';

import { allTags } from '../data/sites';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <nav className="category-nav" aria-label="站点分类">
      {allTags.map((tag) => (
        <button
          key={tag}
          className={`category-tag ${activeCategory === tag ? 'active' : ''}`}
          onClick={() => onCategoryChange(tag)}
          type="button"
        >
          {tag}
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Add CategoryNav styles to globals.css**

Add after `.hero-tags`:
```css
.category-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.category-tag {
  font-size: 0.92rem;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #d3d8ff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-tag:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(124, 91, 255, 0.3);
}

.category-tag.active {
  background: rgba(124, 91, 255, 0.2);
  border-color: rgba(124, 91, 255, 0.5);
  color: #c7d1ff;
}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/CategoryNav.tsx app/globals.css
git commit -m "feat: add CategoryNav component"
```

---

## Task 7: Create SiteCard Component

**Files:**
- Create: `app/components/SiteCard.tsx`

- [ ] **Step 1: Create SiteCard component**

```typescript
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
```

- [ ] **Step 2: Add SiteCard styles to globals.css**

Add after `.site-card span`:
```css
.site-card-content {
  flex: 1;
}

.site-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.favorite-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #8ca0ff;
  padding: 4px 8px;
  transition: transform 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn.favorited {
  color: #ffd700;
}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/SiteCard.tsx app/globals.css
git commit -m "feat: add SiteCard component with favorite button"
```

---

## Task 8: Create FavoritesPanel Component

**Files:**
- Create: `app/components/FavoritesPanel.tsx`

- [ ] **Step 1: Create FavoritesPanel component**

```typescript
'use client';

import { curatedSites } from '../data/sites';
import { Site } from '../types';
import SiteCard from './SiteCard';

interface FavoritesPanelProps {
  favorites: string[];
  isFavorite: (name: string) => boolean;
  onToggleFavorite: (name: string) => void;
}

export default function FavoritesPanel({
  favorites,
  isFavorite,
  onToggleFavorite,
}: FavoritesPanelProps) {
  const favoriteSites = curatedSites.filter((site) =>
    favorites.includes(site.name)
  );

  if (favoriteSites.length === 0) {
    return (
      <section className="section-block favorites-section">
        <div className="section-header">
          <div>
            <h2>我的收藏</h2>
            <p>收藏你喜欢的游戏站点，方便快速访问。</p>
          </div>
        </div>
        <div className="empty-state">
          <p>还没有收藏任何站点。点击站点卡片上的 ☆ 添加收藏。</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-block favorites-section" id="favorites">
      <div className="section-header">
        <div>
          <h2>我的收藏</h2>
          <p>你收藏了 {favoriteSites.length} 个站点</p>
        </div>
      </div>
      <div className="grid-list">
        {favoriteSites.map((site) => (
          <SiteCard
            key={site.name}
            site={site}
            isFavorite={isFavorite(site.name)}
            onToggleFavorite={() => onToggleFavorite(site.name)}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add favorites section styles to globals.css**

Add after `.favorites-section`:
```css
.favorites-section {
  border-color: rgba(255, 215, 0, 0.2);
}
```

- [ ] **Step 3: Commit**

```bash
git add app/components/FavoritesPanel.tsx app/globals.css
git commit -m "feat: add FavoritesPanel component"
```

---

## Task 9: Refactor page.tsx

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx with all improvements**

Replace the entire content with:

```typescript
'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { ADSENSE_CONFIG } from '../config/adsense';
import { curatedSites } from './data/sites';
import { Site } from './types';
import CategoryNav from './components/CategoryNav';
import SiteCard from './components/SiteCard';
import FavoritesPanel from './components/FavoritesPanel';
import { useFavorites } from './hooks/useFavorites';
import { useKeyboard } from './hooks/useKeyboard';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const [showFavorites, setShowFavorites] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const handleSlash = useCallback(() => {
    searchRef.current?.focus();
  }, []);

  const handleEscape = useCallback(() => {
    setQuery('');
    searchRef.current?.blur();
  }, []);

  useKeyboard({
    onSlash: handleSlash,
    onEscape: handleEscape,
    searchRef: searchRef,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    }
  }, []);

  const filteredSites = useMemo(() => {
    let sites = curatedSites;

    if (activeCategory !== '全部') {
      sites = sites.filter((site) => site.tag === activeCategory);
    }

    if (query.trim()) {
      const lower = query.toLowerCase();
      sites = sites.filter(
        (site) =>
          site.name.toLowerCase().includes(lower) ||
          site.description.toLowerCase().includes(lower) ||
          site.tag.toLowerCase().includes(lower)
      );
    }

    return sites;
  }, [query, activeCategory]);

  const hasResults = filteredSites.length > 0;
  const hasSearch = query.trim() !== '';

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">游戏导航</p>
          <h1>GameGuide</h1>
          <p className="description">
            汇集热门游戏平台、资讯媒体、社区与工具，一站直达你的游戏世界。
          </p>
          <div className="search-panel">
            <div className="search-input-wrapper">
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索游戏网站、资讯、攻略… 按 / 聚焦"
              />
              {query && (
                <button
                  className="clear-button"
                  onClick={() => setQuery('')}
                  aria-label="清除搜索"
                  type="button"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="hero-tags">
            <span>按 / 键快速搜索</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glass-card">
            <h2>今日精选</h2>
            <p>快速访问权威游戏站点、新闻媒体和社区资源。</p>
            <div className="stats-grid">
              <div>
                <strong>12+</strong>
                <span>热门站点</span>
              </div>
              <div>
                <strong>8</strong>
                <span>实时推荐</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>游戏资讯</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="adsense-block">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-client={ADSENSE_CONFIG.clientId}
          data-ad-slot={ADSENSE_CONFIG.homepageSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2>游戏导航目录</h2>
            <p>根据标签快速查找你需要的游戏资源。</p>
          </div>
          <span>{filteredSites.length} 个匹配结果</span>
        </div>
        <CategoryNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <div className="grid-list" style={{ marginTop: '24px' }}>
          {hasResults ? (
            filteredSites.map((site) => (
              <SiteCard
                key={site.name}
                site={site}
                isFavorite={isFavorite(site.name)}
                onToggleFavorite={() => toggleFavorite(site.name)}
              />
            ))
          ) : hasSearch ? (
            <div className="empty-state">
              <p>没有找到匹配结果</p>
              <button
                className="refresh-button"
                onClick={() => {
                  setQuery('');
                  setActiveCategory('全部');
                }}
                type="button"
              >
                清除搜索
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {favorites.length > 0 && (
        <FavoritesPanel
          favorites={favorites}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: refactor page with all improvements"
```

---

## Task 10: Add CSS scroll-behavior

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add smooth scroll to html**

Add at top of `html, body` rule:
```css
html {
  scroll-behavior: smooth;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: add smooth scroll behavior"
```

---

## Task 11: Add SEO Structured Data

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add Schema.org JSON-LD to layout**

Replace the empty `<head>` section with:
```tsx
<head>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'GameGuide',
        description: '游戏导航站，汇集热门游戏平台、资讯媒体、社区与工具',
        url: 'https://gameguide.example.com',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://gameguide.example.com/?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      }),
    }}
  />
</head>
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add SEO structured data"
```

---

## Task 12: Mobile Optimization

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Enhance mobile styles**

Replace the existing `@media (max-width: 640px)` block with:
```css
@media (max-width: 640px) {
  .page-shell {
    padding: 20px 16px 60px;
  }

  .search-panel {
    flex-direction: column;
  }

  .search-input-wrapper input {
    min-width: 0;
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .category-nav {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
  }

  .category-tag {
    flex-shrink: 0;
  }

  .section-block {
    padding: 24px 20px;
  }

  .section-header h2 {
    font-size: 1.5rem;
  }

  .site-card {
    padding: 20px;
  }

  .hero-visual {
    display: none;
  }
}
```

- [ ] **Step 2: Add tap highlight color**

Add after `button, input` rule:
```css
button {
  -webkit-tap-highlight-color: rgba(124, 91, 255, 0.2);
}
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: optimize mobile experience"
```

---

## Task 13: Verify All External Links Have noopener

**Files:**
- Modify: `app/components/SiteCard.tsx`

- [ ] **Step 1: Verify rel attribute**

The SiteCard component already has `rel="noopener noreferrer"` - this is complete.

- [ ] **Step 2: Commit (no changes needed)**

If no changes needed, skip commit.

---

## Task 14: Final Testing

- [ ] **Step 1: Run dev server**

```bash
cd f:/项目/GameGuide && npm run dev
```

- [ ] **Step 2: Test keyboard shortcuts**
- `/` should focus search input
- `Esc` should clear search and blur input

- [ ] **Step 3: Test category navigation**
- Click category tags to filter

- [ ] **Step 4: Test favorites**
- Click star button to add/remove favorites
- Refresh page, favorites should persist

- [ ] **Step 5: Test search**
- Type to filter results
- Clear button should work
- Empty state should show when no results

- [ ] **Step 6: Test mobile layout**
- Resize browser to 640px or less
- Check touch interactions work

- [ ] **Step 7: Commit final**

```bash
git add -A && git commit -m "feat: complete all GameGuide improvements

- Add category navigation with tag filtering
- Add favorites with localStorage persistence
- Add keyboard shortcuts (/ and Esc)
- Add search with clear button and no results state
- Add mobile optimizations
- Add SEO structured data
- Refactor into components (CategoryNav, SiteCard, FavoritesPanel)
- Extract types and data to separate files

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Self-Review Checklist

- [ ] All spec requirements covered
- [ ] No placeholder code (TBD, TODO)
- [ ] Type consistency across files
- [ ] All imports correct
- [ ] localStorage key matches (`gameguide_favorites`)
- [ ] Commit history is atomic and logical

---

**Plan execution option:**

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks
2. **Inline Execution** - I execute all tasks now in this session

Which approach would you like?
