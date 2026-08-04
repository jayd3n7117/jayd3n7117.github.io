import { localeTags } from './seo';
import type {
  SupportingLocale,
  SupportingPageContent,
  SupportingPageKey,
} from './pages';
import type { Locale } from './locales';

export type StructuredData = Record<string, unknown>;

export function buildHomeStructuredData(locale: Locale, origin: URL): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Coway Sales Career',
    url: new URL(`/${locale}/`, origin).href,
    inLanguage: localeTags[locale],
  };
}

export function buildSupportingPageStructuredData(
  locale: SupportingLocale,
  pageKey: SupportingPageKey,
  content: SupportingPageContent,
  origin: URL,
): StructuredData[] {
  const homeUrl = new URL(`/${locale}/`, origin).href;
  const pageUrl = new URL(`/${locale}/${pageKey}/`, origin).href;
  const homeName = locale === 'zh' ? '首页' : 'Home';

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: homeName,
          item: homeUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.title,
          item: pageUrl,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: content.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];
}
