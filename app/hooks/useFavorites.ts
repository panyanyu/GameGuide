'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'gameguide_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  const toggleFavorite = useCallback((siteName: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(siteName)
        ? prev.filter((name) => name !== siteName)
        : [...prev, siteName];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback(
    (siteName: string) => favorites.includes(siteName),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}