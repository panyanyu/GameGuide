'use client';

import { curatedSites } from '../data/sites';
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
