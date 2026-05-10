'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: 'steam' | '3dm' | 'gamersky' | 'nga';
  pubDate: string;
  description: string;
  thumbnail: string | null;
}

interface FeedConfig {
  url: string;
  source: NewsItem['source'];
  name: string;
}

const RSS_FEEDS: FeedConfig[] = [
  {
    url: 'https://store.steampowered.com/feeds/news/?l=schinese',
    source: 'steam',
    name: 'Steam',
  },
  {
    url: 'https://www.gamersky.com/news/rss.xml',
    source: 'gamersky',
    name: '游民星空',
  },
  {
    url: 'https://www.3dmgame.com/news/rss.xml',
    source: '3dm',
    name: '3DM',
  },
  {
    url: 'https://nga.178.com/rss/news.xml',
    source: 'nga',
    name: 'NGA',
  },
];

const API_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';
const PAGE_SIZE = 20;

export function useNewsFeed() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<NewsItem[]>([]);

  const fetchAllNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        RSS_FEEDS.map(async (feed) => {
          try {
            const response = await fetch(
              `${API_BASE}${encodeURIComponent(feed.url)}`
            );
            if (!response.ok) return [];
            const data = await response.json();
            if (data.status !== 'ok') return [];
            return (data.items || [])
              .filter((item: any) => item.title && item.link)
              .map((item: any, idx: number) => ({
                id: `${feed.source}-${idx}-${Date.now()}`,
                title: item.title,
                link: item.link,
                source: feed.source,
                pubDate: item.pubDate,
                description: item.description?.replace(/<[^>]*>/g, '').slice(0, 100) || '',
                thumbnail: null,
              }));
          } catch {
            return [];
          }
        })
      );

      const flat = results.flat().sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );

      setAllItems(flat);
      setItems(flat.slice(0, PAGE_SIZE));
      setHasMore(flat.length > PAGE_SIZE);
      setPage(1);
    } catch (err) {
      setError((err as Error).message ?? '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    const nextItems = allItems.slice(0, nextPage * PAGE_SIZE);
    setItems(nextItems);
    setPage(nextPage);
    setHasMore(nextItems.length < allItems.length);
  }, [loading, hasMore, page, allItems]);

  useEffect(() => {
    fetchAllNews();
  }, [fetchAllNews]);

  return { items, loading, error, hasMore, loadMore, refresh: fetchAllNews };
}
