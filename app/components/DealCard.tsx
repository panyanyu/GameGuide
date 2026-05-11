'use client';

import { GameDeal } from '../types/deals';

interface DealCardProps {
  game: GameDeal;
  cheapestLabel?: string;
  noPriceText?: string;
}

const SHOP_COLORS: Record<string, string> = {
  steam: '#1b9ef0',
  epic: '#2a2a2a',
  gog: '#86328a',
  wegame: '#ff6b00',
};

export function DealCard({ game, cheapestLabel = '最低价', noPriceText = '暂无价格' }: DealCardProps) {
  return (
    <div className="deal-card">
      <div className="deal-card-image">
        {game.image ? (
          <img src={game.image} alt={game.title} />
        ) : (
          <div className="deal-card-placeholder" />
        )}
      </div>
      <div className="deal-card-content">
        <h3 className="deal-card-title">{game.title}</h3>
        <div className="deal-card-shops">
          {game.shops.map((shop) => (
            <a
              key={shop.shop}
              href={shop.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`deal-shop-item ${shop.price !== null && shop.price === game.cheapest ? 'cheapest' : ''}`}
              style={{ '--shop-color': SHOP_COLORS[shop.shop] || '#7c5bff' } as React.CSSProperties}
            >
              <span className="deal-shop-name">{shop.shopName}</span>
              {shop.price !== null ? (
                <>
                  <span className="deal-shop-price">
                    ¥{shop.price.toFixed(2)}
                    {shop.cut > 0 && (
                      <span className="deal-cut">-{shop.cut}%</span>
                    )}
                  </span>
                </>
              ) : (
                <span className="deal-shop-noprice">{noPriceText}</span>
              )}
            </a>
          ))}
        </div>
        {game.cheapest !== null && game.cheapestCut > 0 && (
          <div className="deal-cheapest">
            {cheapestLabel}: ¥{game.cheapest.toFixed(2)} (-{game.cheapestCut}%)
          </div>
        )}
      </div>
    </div>
  );
}
