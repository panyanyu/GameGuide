'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '', label: '首页', labelEn: 'Home', icon: '🏠' },
  { href: '/news', label: '资讯', labelEn: 'News', icon: '📰' },
  { href: '/deals', label: '折扣', labelEn: 'Deals', icon: '🏷️' },
];

interface SiteHeaderProps {
  locale: string;
}

export function SiteHeader({ locale }: SiteHeaderProps) {
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
