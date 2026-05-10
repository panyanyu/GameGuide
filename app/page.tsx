'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { ADSENSE_CONFIG } from '../config/adsense';
import { curatedSites } from './data/sites';
import CategoryNav from './components/CategoryNav';
import SiteCard from './components/SiteCard';
import FavoritesPanel from './components/FavoritesPanel';
import { useFavorites } from './hooks/useFavorites';
import { useKeyboard } from './hooks/useKeyboard';
import NewsSection from './components/NewsSection';
import { useNews } from './hooks/useNews';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
  const searchRef = useRef<HTMLInputElement>(null);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { items, loading, error, refresh } = useNews();

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

      <NewsSection
        items={items}
        loading={loading}
        error={error}
        onRefresh={refresh}
      />

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