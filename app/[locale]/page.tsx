'use client';

import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { curatedSites } from '../data/sites';
import SiteCard from '../components/SiteCard';
import FavoritesPanel from '../components/FavoritesPanel';
import { useFavorites } from '../hooks/useFavorites';
import { useKeyboard } from '../hooks/useKeyboard';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations('home');
  const tCategory = useTranslations('category');
  const tFavorites = useTranslations('favorites');
  const tSiteCard = useTranslations('siteCard');
  const tCommon = useTranslations('common');

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');
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
      try {
        (window as any).adsbygoogle.push({});
      } catch (e) {
        // Ignore duplicate push errors
      }
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

  const allTags = useMemo(() => {
    const tags = new Set<string>(['全部']);
    curatedSites.forEach((site) => tags.add(site.tag));
    return Array.from(tags);
  }, []);

  const getCategoryKey = (tag: string): string => {
    const mapping: Record<string, string> = {
      '商店': 'store',
      '社区': 'community',
      '媒体': 'media',
      '直播': 'streaming',
      '工具': 'tool',
      '数据': 'data',
      '独立': 'indie',
      '优惠': 'deal',
    };
    return mapping[tag] || tag;
  };

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{t('eyebrow')}</p>
          <h1>{t('title')}</h1>
          <p className="description">{t('description')}</p>
          <div className="search-panel">
            <div className="search-input-wrapper">
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('searchPlaceholder')}
              />
              {query && (
                <button
                  className="clear-button"
                  onClick={() => setQuery('')}
                  aria-label={tCommon('clear')}
                  type="button"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          <div className="hero-tags">
            <Link href={`/${locale}/news`} className="category-tag">📰 {tCommon('news') || '资讯'}</Link>
            <Link href={`/${locale}/deals`} className="category-tag">🏷️ {tCommon('deals')}</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glass-card">
            <h2>{t('featured')}</h2>
            <p>{t('featuredDesc')}</p>
            <div className="stats-grid">
              <div>
                <strong>12+</strong>
                <span>{t('sitesCount')}</span>
              </div>
              <div>
                <strong>8</strong>
                <span>{t('recommendCount')}</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>{t('infoCount')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2>{t('sectionTitle')}</h2>
            <p>{t('sectionDesc')}</p>
          </div>
          <span>{filteredSites.length} {t('resultsCount')}</span>
        </div>
        <nav className="category-nav" aria-label="站点分类">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`category-tag ${activeCategory === tag ? 'active' : ''}`}
              onClick={() => setActiveCategory(tag)}
            >
              {tag === '全部' ? tCategory('all') : tCategory(getCategoryKey(tag))}
            </button>
          ))}
        </nav>
        <div className="grid-list" style={{ marginTop: '24px' }}>
          {hasResults ? (
            filteredSites.map((site) => (
              <SiteCard
                key={site.name}
                site={site}
                isFavorite={isFavorite(site.name)}
                onToggleFavorite={() => toggleFavorite(site.name)}
                favoriteLabel={tCommon('favorite')}
                unfavoriteLabel={tCommon('unfavorite')}
                visitText={tSiteCard('visit')}
              />
            ))
          ) : hasSearch ? (
            <div className="empty-state">
              <p>{tCommon('noResults')}</p>
              <button
                className="refresh-button"
                onClick={() => {
                  setQuery('');
                  setActiveCategory('全部');
                }}
                type="button"
              >
                {t('clearSearch')}
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <p>{tCommon('noResults')}</p>
            </div>
          )}
        </div>
      </section>

      {favorites.length > 0 && (
        <FavoritesPanel
          favorites={favorites}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          title={tFavorites('title')}
          description={tFavorites('description')}
          emptyText={tFavorites('empty')}
          emptyHint={tFavorites('emptyHint')}
          favoriteCountText={(count) => `你收藏了 ${count} 个站点`}
        />
      )}
    </main>
  );
}
