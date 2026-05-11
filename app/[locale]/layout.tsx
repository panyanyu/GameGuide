import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import '../globals.css';
import { getMessages, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '../../i18n';
import AdSenseLoader from '../components/AdSenseLoader';
import { LanguageToggle } from '../components/LanguageToggle';
import { SiteHeader } from '../components/SiteHeader';

export const metadata: Record<string, Metadata> = {
  zh: {
    title: 'GameGuide - 游戏导航站',
    description: '现代游戏导航站，汇集热门游戏平台、媒体、社区和工具，提供快速访问和实时推荐。',
    keywords: ['游戏导航', '游戏网站', 'Steam', 'Twitch', '游戏资讯', '游戏攻略', '游戏社区'],
    openGraph: {
      title: 'GameGuide - 游戏导航站',
      description: '现代游戏导航站，汇集热门游戏平台、媒体、社区和工具，提供快速访问和实时推荐。',
      type: 'website',
      locale: 'zh-CN',
      siteName: 'GameGuide',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'GameGuide - 游戏导航站',
      description: '现代游戏导航站，汇集热门游戏平台、媒体、社区和工具。',
    },
  },
  en: {
    title: 'GameGuide - Gaming Portal',
    description: 'Your gateway to gaming platforms, media, communities and tools. One click to your gaming world.',
    keywords: ['game guide', 'gaming', 'Steam', 'Twitch', 'game news', 'game community'],
    openGraph: {
      title: 'GameGuide - Gaming Portal',
      description: 'Your gateway to gaming platforms, media, communities and tools. One click to your gaming world.',
      type: 'website',
      locale: 'en-US',
      siteName: 'GameGuide',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'GameGuide - Gaming Portal',
      description: 'Your gateway to gaming platforms, media, communities and tools.',
    },
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'GameGuide',
              description: locale === 'zh'
                ? '游戏导航站，汇集热门游戏平台、资讯媒体、社区与工具'
                : 'Your gateway to gaming platforms, media, communities and tools',
              url: 'https://gameguide.example.com',
            }),
          }}
        />
      </head>
      <body>
        <SiteHeader />
        <NextIntlClientProvider messages={messages}>
          <LanguageToggle className="lang-toggle-fixed" />
          <AdSenseLoader />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
