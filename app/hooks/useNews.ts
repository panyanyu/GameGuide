'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NewsItem {
  title: string;
  link: string;
  source: 'steam' | 'gamersky';
  pubDate: string;
}

const RSS_FEEDS = [
  {
    url: 'https://store.steampowered.com/feeds/news/?l=schinese',
    source: 'steam' as const,
  },
  {
    url: 'https://www.gamersky.com/news/rss.xml',
    source: 'gamersky' as const,
  },
];

const API_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';

export function useNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all(
        RSS_FEEDS.map(async (feed) => {
          const response = await fetch(
            `${API_BASE}${encodeURIComponent(feed.url)}`
          );
          if (!response.ok) throw new Error('网络请求失败');
          const data = await response.json();
          if (data.status !== 'ok') throw new Error('API 返回错误');
          return (data.items || [])
            .slice(0, 3)
            .filter((item: any) => item.title && item.link)
            .map((item: any) => ({
              title: item.title,
              link: item.link,
              source: feed.source,
              pubDate: item.pubDate,
            }));
        })
      );

      const allItems = results
        .flat()
        .sort(
          (a, b) =>
            new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        )
        .slice(0, 6);

      setItems(allItems);
    } catch (err) {
      setError((err as Error).message ?? '加载失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { items, loading, error, refresh: fetchNews };
}
