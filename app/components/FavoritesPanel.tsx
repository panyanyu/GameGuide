'use client';

import { curatedSites } from '../data/sites';
import SiteCard from './SiteCard';

interface FavoritesPanelProps {
  favorites: string[];
  isFavorite: (name: string) => boolean;
  onToggleFavorite: (name: string) => void;
  title?: string;
  description?: string;
  emptyText?: string;
  emptyHint?: string;
  favoriteCountText?: (count: number) => string;
}

export default function FavoritesPanel({
  favorites,
  isFavorite,
  onToggleFavorite,
  title = '我的收藏',
  description = '收藏你喜欢的游戏站点，方便快速访问。',
  emptyText = '还没有收藏任何站点',
  emptyHint = '点击站点卡片的 ☆ 按钮添加收藏',
  favoriteCountText,
}: FavoritesPanelProps) {
  const favoriteSites = curatedSites.filter((site) =>
    favorites.includes(site.name)
  );

  if (favoriteSites.length === 0) {
    return (
      <section className="section-block favorites-section">
        <div className="section-header">
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
        <div className="empty-state">
          <p>{emptyText}</p>
          {emptyHint && <p style={{ marginTop: '8px', fontSize: '0.9em', color: '#8ca0ff' }}>{emptyHint}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="section-block favorites-section" id="favorites">
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          <p>{favoriteCountText ? favoriteCountText(favoriteSites.length) : `你收藏了 ${favoriteSites.length} 个站点`}</p>
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
