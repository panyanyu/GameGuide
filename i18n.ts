import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh';

export default getRequestConfig(async () => {
  const locale = await getLocale();
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

async function getLocale(): Promise<Locale> {
  // This will be overridden by middleware for locale routing
  return defaultLocale;
}
