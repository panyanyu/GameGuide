'use client';

import { useState, FormEvent } from 'react';

interface DealsSearchProps {
  onSearch: (query: string) => void;
  loading: boolean;
  placeholder?: string;
  buttonText?: string;
}

export function DealsSearch({ onSearch, loading, placeholder = '搜索游戏名称...', buttonText = '搜索' }: DealsSearchProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form className="deals-search-panel" onSubmit={handleSubmit}>
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="deals-search-input"
        />
        {query && (
          <button
            type="button"
            className="clear-button"
            onClick={() => setQuery('')}
            aria-label="清除"
          >
            ×
          </button>
        )}
      </div>
      <button type="submit" className="deals-search-btn" disabled={loading || !query.trim()}>
        {buttonText}
      </button>
    </form>
  );
}
