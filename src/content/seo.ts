import type { Locale } from './locales';
import type { SupportingPageKey } from './pages';

export const localeTags: Record<Locale, 'en-MY' | 'ms-MY' | 'zh-CN'> = {
  en: 'en-MY',
  bm: 'ms-MY',
  zh: 'zh-CN',
};

export interface SeoData {
  lang: (typeof localeTags)[Locale];
  canonical: string;
  alternates: Partial<
    Record<(typeof localeTags)[Locale] | 'x-default', string>
  >;
}

export function getSeo(
  locale: Locale,
  origin: URL,
  pathKey?: SupportingPageKey,
): SeoData {
  if (pathKey) {
    if (locale === 'bm') {
      throw new Error('Bahasa Malaysia supporting pages are not available');
    }

    const english = new URL(`/en/${pathKey}/`, origin).href;
    const chinese = new URL(`/zh/${pathKey}/`, origin).href;
    return {
      lang: localeTags[locale],
      canonical: locale === 'en' ? english : chinese,
      alternates: {
        'en-MY': english,
        'zh-CN': chinese,
        'x-default': english,
      },
    };
  }

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
