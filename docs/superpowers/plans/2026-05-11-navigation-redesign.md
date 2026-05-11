# Navigation Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fixed top navigation bar with glassmorphism effect containing Home, News, and Deals links with icons.

**Architecture:** Create a SiteHeader component with glassmorphism styling, add it to the root layout, and ensure it works with i18n locale routing.

**Tech Stack:** Next.js App Router, CSS Modules/globals.css, next-intl

---

## File Structure

- Create: `app/components/SiteHeader.tsx`
- Modify: `app/[locale]/layout.tsx` - add SiteHeader import and render
- Modify: `app/globals.css` - add glassmorphism nav styles

---

### Task 1: Create SiteHeader Component

**Files:**
- Create: `app/components/SiteHeader.tsx`

- [ ] **Step 1: Create the component file**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

const NAV_ITEMS = [
  { href: '', label: '首页', labelEn: 'Home', icon: '🏠' },
  { href: '/news', label: '资讯', labelEn: 'News', icon: '📰' },
  { href: '/deals', label: '折扣', labelEn: 'Deals', icon: '🏷️' },
];

export function SiteHeader() {
  const locale = useLocale();
  const pathname = usePathname();

  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    return pathname === fullPath || (href === '' && pathname === `/${locale}`);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href={`/${locale}`} className="site-logo">
          🎮 GameGuide
        </Link>
        <nav className="site-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={`site-nav-item ${isActive(item.href) ? 'active' : ''}`}
            >
              <span className="site-nav-icon">{item.icon}</span>
              <span className="site-nav-label">{locale === 'zh' ? item.label : item.labelEn}</span>
            </Link>
          ))}
        </nav>
        <div className="site-header-actions">
          <button
            onClick={() => {
              const newLocale = locale === 'zh' ? 'en' : 'zh';
              const segments = window.location.pathname.split('/');
              segments[1] = newLocale;
              window.location.href = segments.join('/');
            }}
            className="lang-toggle-btn"
          >
            {locale === 'zh' ? 'EN' : '中'}
          </button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/SiteHeader.tsx
git commit -m "feat: create SiteHeader component with glassmorphism nav"
```

---

### Task 2: Add Navigation Styles to globals.css

**Files:**
- Modify: `app/globals.css` - add site-header styles

- [ ] **Step 1: Add glassmorphism navigation styles**

Add these styles to `app/globals.css`:

```css
/* Site Header - Glassmorphism Navigation */
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
}

.site-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 32px;
}

.site-logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
}

.site-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.site-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  color: inherit;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.2s ease;
}

.site-nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.site-nav-item.active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.site-nav-icon {
  font-size: 1.1rem;
}

.site-nav-label {
  font-size: 0.95rem;
}

.site-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lang-toggle-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.lang-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Dark theme support */
@media (prefers-color-scheme: dark) {
  .site-header {
    background: rgba(0, 0, 0, 0.3);
  }
}

/* Mobile responsive */
@media (max-width: 640px) {
  .site-header-inner {
    padding: 0 16px;
    gap: 16px;
  }

  .site-nav-label {
    display: none;
  }

  .site-nav-item {
    padding: 8px 12px;
  }

  .site-logo {
    font-size: 1rem;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "style: add glassmorphism styles for site header"
```

---

### Task 3: Add SiteHeader to Layout

**Files:**
- Modify: `app/[locale]/layout.tsx` - import and render SiteHeader

- [ ] **Step 1: Add SiteHeader to layout**

In `app/[locale]/layout.tsx`, add import:
```tsx
import SiteHeader from '../components/SiteHeader';
```

Add `<SiteHeader />` inside the body, before the main content:
```tsx
<body>
  <SiteHeader />
  <NextIntlClientProvider messages={messages}>
    ...
  </NextIntlClientProvider>
</body>
```

Also add padding-top to body or main content to account for fixed header:
```css
body {
  padding-top: 60px;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/[locale]/layout.tsx
git commit -m "feat: add SiteHeader to root layout"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Create SiteHeader.tsx component |
| 2 | Add glassmorphism CSS styles |
| 3 | Add SiteHeader to layout |
