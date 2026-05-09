'use client';

import { allTags } from '../data/sites';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <nav className="category-nav" aria-label="站点分类">
      {allTags.map((tag) => (
        <button
          key={tag}
          className={`category-tag ${activeCategory === tag ? 'active' : ''}`}
          onClick={() => onCategoryChange(tag)}
          type="button"
        >
          {tag}
        </button>
      ))}
    </nav>
  );
}
