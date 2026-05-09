'use client';

import { useEffect, useMemo, useState } from 'react';
import { ADSENSE_CONFIG } from '../config/adsense';
import { curatedSites, allTags } from './data/sites';
import { Site } from './types';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [networkResults, setNetworkResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    }
  }, []);

  const filteredSites = useMemo(() => {
    if (!query.trim()) return curatedSites;
    const lower = query.toLowerCase();
    return curatedSites.filter(
      (site) =>
        site.name.toLowerCase().includes(lower) ||
        site.description.toLowerCase().includes(lower) ||
        site.tag.toLowerCase().includes(lower),
    );
  }, [query]);

  const searchNetwork = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://api.publicapis.org/entries?category=Games');
      if (!response.ok) {
        throw new Error('网络请求失败，请稍后重试。');
      }
      const data = await response.json();
      const entries = Array.isArray(data.entries) ? data.entries : [];
      const results = entries
        .filter((entry: any) => {
          if (!query.trim()) return true;
          const term = query.toLowerCase();
          return (
            entry.API.toLowerCase().includes(term) ||
            entry.Description.toLowerCase().includes(term) ||
            entry.Link.toLowerCase().includes(term)
          );
        })
        .slice(0, 8);
      setNetworkResults(results);
    } catch (err) {
      setError((err as Error).message ?? '加载失败');
    } finally {
      setLoading(false);
    }
  };

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
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索游戏网站、资讯、攻略…"
            />
            <button onClick={searchNetwork} disabled={loading}>
              {loading ? '搜索中…' : '联网搜索推荐'}
            </button>
          </div>
          <div className="hero-tags">
            <span>热门</span>
            <span>直播</span>
            <span>优惠</span>
            <span>独立</span>
            <span>评测</span>
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
        <div className="grid-list">
          {filteredSites.map((site) => (
            <a key={site.name} href={site.url} target="_blank" rel="noreferrer" className="site-card">
              <div>
                <p className="site-tag">{site.tag}</p>
                <h3>{site.name}</h3>
                <p>{site.description}</p>
              </div>
              <span>访问 →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section-block network-section">
        <div className="section-header">
          <div>
            <h2>联网推荐结果</h2>
            <p>实时查询游戏相关公开 API 信息，为你的导航站提供更多灵感。</p>
          </div>
          <button className="refresh-button" onClick={searchNetwork} disabled={loading}>
            刷新推荐
          </button>
        </div>

        {error ? <p className="error-message">{error}</p> : null}

        <div className="network-grid">
          {networkResults.length > 0 ? (
            networkResults.map((item) => (
              <a
                key={item.Link}
                href={item.Link}
                target="_blank"
                rel="noreferrer"
                className="network-card"
              >
                <div>
                  <h3>{item.API}</h3>
                  <p>{item.Description}</p>
                </div>
                <span>{item.Category}</span>
              </a>
            ))
          ) : (
            <div className="empty-state">
              <p>点击“联网搜索推荐”获取最新游戏相关站点和 API 建议。</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
