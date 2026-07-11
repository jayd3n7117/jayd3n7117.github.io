import type { Locale } from './locales';

export const localeTags: Record<Locale, 'en-MY' | 'ms-MY' | 'zh-CN'> = {
  en: 'en-MY',
  bm: 'ms-MY',
  zh: 'zh-CN',
};

export interface SeoData {
  lang: (typeof localeTags)[Locale];
  canonical: string;
  alternates: Record<(typeof localeTags)[Locale], string>;
}

export function getSeo(locale: Locale, origin: URL): SeoData {
  return {
    lang: localeTags[locale],
    canonical: new URL(`/${locale}/`, origin).href,
    alternates: {
      'en-MY': new URL('/en/', origin).href,
      'ms-MY': new URL('/bm/', origin).href,
      'zh-CN': new URL('/zh/', origin).href,
    },
  };
}
