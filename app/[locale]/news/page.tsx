'use client';

import { useState } from 'react';
import Head from 'next/head';
import { useLocale, useTranslations } from 'next-intl';
import { useNewsFeed } from '../../hooks/useNewsFeed';
import NewsList from '../../components/NewsList';
import ImageModal from '../../components/ImageModal';
import { Breadcrumb } from '../../components/Breadcrumb';

export default function NewsPage() {
  const locale = useLocale();
  const tCommon = useTranslations('common');
  const { items, loading, error, hasMore, loadMore, refresh } = useNewsFeed();
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <Head>
        <title>{tCommon('news')} - GameGuide</title>
        <meta name="description" content={locale === 'zh'
          ? '汇集 Steam、3DM、游民星空、NGA 等游戏媒体的最新资讯'
          : 'Latest gaming news from Steam, 3DM, Gamersky, NGA and more'} />
      </Head>
      <main className="page-shell">
        <Breadcrumb
          items={[
            { label: tCommon('home'), href: `/${locale}` },
            { label: tCommon('news') },
          ]}
        />
        <section className="news-page-header">
          <h1>🎮 {tCommon('news')}</h1>
          <button
            className="refresh-button"
            onClick={refresh}
            disabled={loading}
            type="button"
          >
            {loading ? tCommon('loading') : tCommon('refresh') || '刷新'}
          </button>
        </section>

        {error ? (
          <div className="news-error">
            <p>⚠ {error}</p>
            <button className="refresh-button" onClick={refresh} type="button">
              {tCommon('retry') || '重试'}
            </button>
          </div>
        ) : (
          <NewsList
            items={items}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onImageClick={(src) => setModalImage({ src, alt: '' })}
          />
        )}

        {modalImage && (
          <ImageModal
            src={modalImage.src}
            alt={modalImage.alt}
            onClose={() => setModalImage(null)}
          />
        )}
      </main>
    </>
  );
}
