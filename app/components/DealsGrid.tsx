'use client';

import { GameDeal } from '../types/deals';
import { DealCard } from './DealCard';

interface DealsGridProps {
  games: GameDeal[];
}

export function DealsGrid({ games }: DealsGridProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <div className="deals-grid">
      {games.map((game) => (
        <DealCard key={game.id} game={game} />
      ))}
    </div>
  );
}
