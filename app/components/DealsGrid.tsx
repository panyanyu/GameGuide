'use client';

import { GameDeal } from '../types/deals';
import { DealCard } from './DealCard';

interface DealsGridProps {
  games: GameDeal[];
  cheapestLabel?: string;
  noPriceText?: string;
}

export function DealsGrid({ games, cheapestLabel, noPriceText }: DealsGridProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <div className="deals-grid">
      {games.map((game) => (
        <DealCard key={game.id} game={game} cheapestLabel={cheapestLabel} noPriceText={noPriceText} />
      ))}
    </div>
  );
}
