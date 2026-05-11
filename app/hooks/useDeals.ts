'use client';

import { useState, useCallback } from 'react';
import { GameDeal } from '../types/deals';

interface ITADSearchResult {
  id: string;
  slug: string;
  title: string;
  type: string;
  mature: boolean;
  assets: {
    boxart?: string;
    banner145?: string;
    banner300?: string;
  };
}

interface ITADPriceResult {
  id: string;
  deals: Array<{
    shop: { id: number; name: string };
    price: { amount: number; currency: string };
    cut: number;
    url: string;
  }>;
  historyLow: {
    all: { amount: number; currency: string };
  };
}

interface UseDealsReturn {
  results: GameDeal[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
}

export function useDeals(): UseDealsReturn {
  const [results, setResults] = useState<GameDeal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Search for games
      const searchUrl = `/api/deals?title=${encodeURIComponent(query)}&limit=8`;
      const searchRes = await fetch(searchUrl);
      const searchData: ITADSearchResult[] = await searchRes.json();

      if (!searchData || searchData.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }

      // Fetch prices for all games in one call
      const gameIds = searchData.map((g) => g.id);
      const pricesRes = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameIds),
      });
      const pricesData: ITADPriceResult[] = await pricesRes.json();

      // Create price lookup map
      const priceMap = new Map<string, ITADPriceResult>();
      pricesData.forEach((p) => priceMap.set(p.id, p));

      const games: GameDeal[] = searchData.map((game) => {
        const priceInfo = priceMap.get(game.id);
        const deals = priceInfo?.deals || [];
        const cheapestDeal = deals.length > 0
          ? deals.reduce((min, d) => (d.price.amount < min.price.amount ? d : min))
          : null;

        return {
          id: game.id,
          title: game.title,
          image: game.assets.boxart || '',
          shops: deals.map((d) => ({
            shop: d.shop.id.toString(),
            shopName: d.shop.name,
            price: d.price.amount,
            cut: d.cut,
            url: d.url,
          })),
          cheapest: cheapestDeal?.price.amount || null,
          cheapestCut: cheapestDeal?.cut || 0,
        };
      });

      setResults(games);
    } catch (err) {
      console.error('Deals search error:', err);
      setError('搜索失败，请稍后重试');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clearResults };
}
