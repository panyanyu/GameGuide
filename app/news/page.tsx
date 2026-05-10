'use client';

import { useState } from 'react';
import Head from 'next/head';
import { useNewsFeed } from '../hooks/useNewsFeed';
import NewsList from '../components/NewsList';
import ImageModal from '../components/ImageModal';

export default function NewsPage() {
  const { items, loading, error, hasMore, loadMore, refresh } = useNewsFeed();
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <>
      <Head>
        <title>游戏资讯 - GameGuide</title>
        <meta name="description" content="汇集 Steam、3DM、游民星空、NGA 等游戏媒体的最新资讯" />
      </Head>
      <main className="page-shell">
        <section className="news-page-header">
          <h1>🎮 游戏资讯</h1>
          <button
            className="refresh-button"
            onClick={refresh}
            disabled={loading}
            type="button"
          >
            {loading ? '刷新中...' : '刷新'}
          </button>
        </section>

        {error ? (
          <div className="news-error">
            <p>⚠ {error}</p>
            <button className="refresh-button" onClick={refresh} type="button">
              重试
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
