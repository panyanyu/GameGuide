import type { Metadata } from 'next';
import './globals.css';
import { ADSENSE_CONFIG } from '../config/adsense';
import AdSenseLoader from './components/AdSenseLoader';

export const metadata: Metadata = {
  title: 'GameGuide - 游戏导航站',
  description: '现代游戏导航站，汇集热门游戏平台、媒体、社区和工具，提供快速访问和实时推荐。',
  keywords: [
    '游戏导航',
    '游戏网站',
    'Steam',
    'Twitch',
    '游戏资讯',
    '游戏攻略',
    '游戏社区',
  ],
  robots: {
    index: true,
    follow: true,
  },
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'GameGuide',
              description: '游戏导航站，汇集热门游戏平台、资讯媒体、社区与工具',
              url: 'https://gameguide.example.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://gameguide.example.com/?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body>
        <AdSenseLoader />
        {children}
      </body>
    </html>
  );
}
