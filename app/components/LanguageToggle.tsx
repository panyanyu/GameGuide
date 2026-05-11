'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <button
      onClick={toggleLocale}
      className={`lang-toggle ${className || ''}`}
      aria-label="Toggle language"
    >
      {locale === 'zh' ? 'EN' : '中'}
    </button>
  );
}
