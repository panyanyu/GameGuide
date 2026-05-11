'use client';

import { useState, useCallback } from 'react';
import { GameDeal, ITADSearchResult } from '../types/deals';
import { ITAD_BASE_URL, ITAD_API_KEY, SUPPORTED_SHOPS } from '../data/deals';

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
      const searchUrl = `${ITAD_BASE_URL}/v01/search/search/?title=${encodeURIComponent(query)}&limit=8&key=${ITAD_API_KEY}`;
      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      if (!searchData.data || searchData.data.length === 0) {
        setResults([]);
        setLoading(false);
        return;
      }

      const games: GameDeal[] = await Promise.all(
        searchData.data.map(async (game: ITADSearchResult) => {
          const shopPrices = await Promise.all(
            SUPPORTED_SHOPS.map(async (shop) => {
              try {
                const priceUrl = `${ITAD_BASE_URL}/v01/game/${shop.id}/${game.id}/prices/?key=${ITAD_API_KEY}`;
                const priceRes = await fetch(priceUrl);
                const priceData = await priceRes.json();

                if (priceData.data && priceData.data.current) {
                  return {
                    shop: shop.id,
                    shopName: shop.name,
                    price: priceData.data.current.price,
                    cut: priceData.data.cut || 0,
                    url: priceData.data.url || '',
                  };
                }
                return {
                  shop: shop.id,
                  shopName: shop.name,
                  price: null,
                  cut: 0,
                  url: '',
                };
              } catch {
                return {
                  shop: shop.id,
                  shopName: shop.name,
                  price: null,
                  cut: 0,
                  url: '',
                };
              }
            })
          );

          const pricesWithDeal = shopPrices.filter((p) => p.price !== null);
          const cheapest = pricesWithDeal.length > 0
            ? Math.min(...pricesWithDeal.map((p) => p.price as number))
            : null;
          const cheapestCut = pricesWithDeal.length > 0
            ? Math.max(...pricesWithDeal.map((p) => p.cut))
            : 0;

          return {
            id: game.id,
            title: game.title,
            image: game.image,
            shops: shopPrices,
            cheapest,
            cheapestCut,
          };
        })
      );

      setResults(games);
    } catch (err) {
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
