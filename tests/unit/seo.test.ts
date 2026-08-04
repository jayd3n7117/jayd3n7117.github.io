import { describe, expect, it } from 'vitest';

import { getSeo } from '../../src/content/seo';

describe('localized SEO URLs', () => {
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
