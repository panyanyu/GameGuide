'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { DealsSearch } from '../../components/DealsSearch';
import { DealsGrid } from '../../components/DealsGrid';
import { useDeals } from '../../hooks/useDeals';
import { Breadcrumb } from '../../components/Breadcrumb';

export default function DealsPage() {
  const locale = useLocale();
  const t = useTranslations('deals');
  const tCommon = useTranslations('common');

  const { results, loading, error, search } = useDeals();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setHasSearched(true);
    await search(query);
  };

  return (
    <div className="page-shell">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: `/${locale}` },
          { label: tCommon('deals') },
        ]}
      />
      <div className="deals-hero">
        <div className="eyebrow">{t('eyebrow')}</div>
        <h1>{t('title')}</h1>
        <p className="description">{t('description')}</p>
        <DealsSearch onSearch={handleSearch} loading={loading} placeholder={t('searchPlaceholder')} buttonText={loading ? t('searching') : t('search')} />
      </div>

      <div className="deals-content">
        {loading && (
          <div className="deals-loading">
            <div className="deals-spinner" />
            <p>{t('loading')}</p>
          </div>
        )}

        {error && (
          <div className="error-message">{t('searchFailed')}</div>
        )}

        {!loading && hasSearched && results.length === 0 && !error && (
          <div className="empty-state">
            <p>{t('noResults')}</p>
          </div>
        )}

        {!loading && !hasSearched && (
          <div className="empty-state">
            <p>{t('startSearch')}</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <DealsGrid games={results} cheapestLabel={t('cheapestLabel')} noPriceText={t('noPrice')} />
        )}
      </div>
    </div>
  );
}
