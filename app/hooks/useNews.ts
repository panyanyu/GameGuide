'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NewsItem {
  title: string;
  link: string;
  source: 'steam';
  pubDate: string;
}

const RSS_URL = 'https://store.steampowered.com/feeds/news/?l=schinese';
const API_BASE = 'https://api.rss2json.com/v1/api.json?rss_url=';

export function useNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}${encodeURIComponent(RSS_URL)}`);
      if (!response.ok) throw new Error('网络请求失败');
      const data = await response.json();
      if (data.status !== 'ok') throw new Error('API 返回错误');

      const newsItems = (data.items || [])
        .slice(0, 6)
        .filter((item: any) => item.title && item.link)
        .map((item: any) => ({
          title: item.title,
          link: item.link,
          source: 'steam' as const,
          pubDate: item.pubDate,
        }));

      setItems(newsItems);
      if (newsItems.length === 0) {
        setError('暂时无法加载新闻，请稍后重试');
      }
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