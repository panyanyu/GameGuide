import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './i18n';

export default getRequestConfig(async ({ locale }) => {
  return {
    locale: locale || defaultLocale,
    messages: (await import(`./messages/${locale || defaultLocale}.json`)).default,
  };
});

export { locales, defaultLocale };