import { describe, expect, it } from 'vitest';

import { getSeo } from '../../src/content/seo';
import {
  buildHomeStructuredData,
  buildSupportingPageStructuredData,
} from '../../src/content/structured-data';
import { getSupportingPage } from '../../src/content/pages';

describe('localized SEO URLs', () => {
  it('builds useful page schemas without presenting the opportunity as a job posting', () => {
    const origin = new URL('https://cowaysalescareer.my');
    const page = getSupportingPage('en', 'application-faq');
    const supporting = buildSupportingPageStructuredData(
      'en',
      'application-faq',
      page,
      origin,
    );
    const home = buildHomeStructuredData('en', origin);
    const serialized = JSON.stringify([home, ...supporting]);

    expect(home['@type']).toBe('WebSite');
    expect(supporting.map((schema) => schema['@type'])).toEqual([
      'BreadcrumbList',
      'FAQPage',
    ]);
    expect(serialized).not.toContain('JobPosting');
    expect(serialized).toContain('https://cowaysalescareer.my/en/application-faq/');
  });
  it('builds reciprocal English and Chinese URLs for a supporting page', () => {
    const seo = getSeo(
      'zh',
      new URL('https://cowaysalescareer.my'),
      'career-change-to-sales',
    );

    expect(seo.canonical).toBe(
      'https://cowaysalescareer.my/zh/career-change-to-sales/',
    );
    expect(seo.alternates['en-MY']).toBe(
      'https://cowaysalescareer.my/en/career-change-to-sales/',
    );
    expect(seo.alternates['zh-CN']).toBe(
      'https://cowaysalescareer.my/zh/career-change-to-sales/',
    );
    expect(seo.alternates['x-default']).toBe(
      'https://cowaysalescareer.my/en/career-change-to-sales/',
    );
    expect(seo.alternates['ms-MY']).toBeUndefined();
  });

  it('builds the canonical and every language alternate from the supplied origin', () => {
    expect(getSeo('bm', new URL('https://recruit.example'))).toMatchObject({
      lang: 'ms-MY',
      canonical: 'https://recruit.example/bm/',
      alternates: {
        'en-MY': 'https://recruit.example/en/',
        'ms-MY': 'https://recruit.example/bm/',
        'zh-CN': 'https://recruit.example/zh/',
      },
    });
  });

  it.each([
    ['en', 'en-MY'],
    ['bm', 'ms-MY'],
    ['zh', 'zh-CN'],
  ] as const)('maps %s to the exact %s language tag', (locale, lang) => {
    expect(getSeo(locale, new URL('https://recruit.example/base/')).lang).toBe(lang);
  });
});
