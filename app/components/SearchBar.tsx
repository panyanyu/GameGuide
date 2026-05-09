'use client';

import { RefObject } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export default function SearchBar({ value, onChange, inputRef }: SearchBarProps) {
  return (
    <div className="search-panel">
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="搜索游戏网站、资讯、攻略… 按 / 聚焦"
        />
        {value && (
          <button
            className="clear-button"
            onClick={() => onChange('')}
            aria-label="清除搜索"
            type="button"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}