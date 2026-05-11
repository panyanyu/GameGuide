'use client';

import { useState } from 'react';
import { DealsSearch } from '../components/DealsSearch';
import { DealsGrid } from '../components/DealsGrid';
import { useDeals } from '../hooks/useDeals';

export default function DealsPage() {
  const { results, loading, error, search, clearResults } = useDeals();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setHasSearched(true);
    await search(query);
  };

  return (
    <div className="page-shell">
      <div className="deals-hero">
        <div className="eyebrow">游戏折扣</div>
        <h1>全网最低价</h1>
        <p className="description">
          搜索游戏名称，比较 Steam、Epic、GOG、WeGame 等平台的价格，找到最优惠的购买渠道。
        </p>
        <DealsSearch onSearch={handleSearch} loading={loading} />
      </div>

      <div className="deals-content">
        {loading && (
          <div className="deals-loading">
            <div className="deals-spinner" />
            <p>正在搜索游戏价格...</p>
          </div>
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {!loading && hasSearched && results.length === 0 && !error && (
          <div className="empty-state">
            <p>未找到相关游戏，请尝试其他关键词</p>
          </div>
        )}

        {!loading && !hasSearched && (
          <div className="empty-state">
            <p>输入游戏名称开始搜索</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <DealsGrid games={results} />
        )}
      </div>
    </div>
  );
}
