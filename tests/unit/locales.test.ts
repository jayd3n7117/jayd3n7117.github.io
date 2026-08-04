import { describe, expect, it } from 'vitest';

import { applicationContent } from '../../src/application/content';
import { getContent, locales } from '../../src/content/locales';
import { getSupportingPage, supportingPageKeys } from '../../src/content/pages';
import { recruitmentTrust } from '../../src/content/trust';

const requiredSections = [
  'chrome',
  'meta',
  'nav',
  'hero',
  'momentum',
  'opportunity',
  'support',
  'culture',
  'progression',
  'video',
  'candidateFit',
  'faq',
  'analytics',
  'footer',
] as const;

describe('localized recruitment content', () => {
  it('centralizes the independent sales-team disclosure and application reviewer copy', () => {
    expect(recruitmentTrust.en.disclosure).toBe(
      'Coway Sales Career is an independent recruitment website operated by a Coway sales team in Malaysia. It is not the official corporate website of Coway (Malaysia) Sdn. Bhd.',
    );

    for (const locale of ['en', 'bm', 'zh'] as const) {
      expect(locales[locale].footer.disclaimer).toBe(recruitmentTrust[locale].disclosure);
      expect(applicationContent[locale].reviewer).toBe(recruitmentTrust[locale].reviewer);
    }
  });
  it('defines five useful supporting pages in English and Chinese', () => {
    expect(supportingPageKeys).toEqual([
      'coway-sales-career',
      'career-change-to-sales',
      'sales-training-leadership',
      'coway-sales-malaysia-locations',
      'application-faq',
    ]);

    for (const locale of ['en', 'zh'] as const) {
      for (const key of supportingPageKeys) {
        const page = getSupportingPage(locale, key);
        expect(page.meta.title.length).toBeGreaterThan(locale === 'zh' ? 12 : 20);
        expect(page.meta.description.length).toBeGreaterThan(locale === 'zh' ? 35 : 80);
        expect(page.sections.length).toBeGreaterThanOrEqual(3);
        expect(page.sections.flatMap(({ body }) => body).join(' ').length).toBeGreaterThanOrEqual(
          locale === 'zh' ? 450 : 500,
        );
      }
    }
  });
  it('provides complete dictionaries for every public locale', () => {
    expect(Object.keys(locales)).toEqual(['en', 'bm', 'zh']);

    for (const locale of Object.keys(locales) as Array<keyof typeof locales>) {
      const content = getContent(locale);

      expect(Object.keys(content)).toEqual(requiredSections);
      expect(content.meta.title.trim()).not.toBe('');
      expect(content.meta.description.trim()).not.toBe('');
      expect(content.meta.language.trim()).not.toBe('');
      expect(content.support.items).toHaveLength(6);
      expect(content.faq.items).toHaveLength(7);
      expect(content.opportunity.guarantee).toBe(false);
      expect(content.footer.socialHeading.trim()).not.toBe('');
      expect(content.footer.socialUnavailableLabel.trim()).not.toBe('');
      expect(content.chrome).not.toHaveProperty('officialSiteLabel');
    }
  });

  it('keeps each locale structurally identical to English', () => {
    const shape = (value: unknown): unknown => {
      if (Array.isArray(value)) {
        return value.map(shape);
      }

      if (value !== null && typeof value === 'object') {
        return Object.fromEntries(
          Object.entries(value).map(([key, child]) => [key, shape(child)]),
        );
      }

      return typeof value;
    };

    expect(shape(locales.bm)).toEqual(shape(locales.en));
    expect(shape(locales.zh)).toEqual(shape(locales.en));
  });

  it('discloses localized recruitment use and Formspree processing and storage', () => {
    const expected = {
      en: 'Your information is used for recruitment follow-up and is processed and stored through Formspree, our configured third-party form service.',
      bm: 'Maklumat anda digunakan untuk tindakan susulan pengambilan dan diproses serta disimpan melalui Formspree, perkhidmatan borang pihak ketiga yang dikonfigurasikan.',
      zh: '你的资料用于招聘跟进，并通过我们配置的第三方表单服务 Formspree 处理和存储。',
    } as const;
    const footerExpected = {
      en: `${expected.en} With your permission, Google Analytics also measures website use; recruitment form answers are not intentionally sent to analytics.`,
      bm: `${expected.bm} Dengan kebenaran anda, Google Analytics turut mengukur penggunaan laman; jawapan borang pengambilan tidak dihantar dengan sengaja kepada analitik.`,
      zh: `${expected.zh} 在获得你的许可后，Google Analytics 也会衡量网站使用情况；招聘申请表中的资料不会被刻意发送到分析服务。`,
    } as const;

    for (const locale of Object.keys(expected) as Array<keyof typeof expected>) {
      expect(applicationContent[locale].privacy).toBe(expected[locale]);
      expect(locales[locale].footer.privacy).toBe(footerExpected[locale]);
    }
  });

  it('preserves the required opportunity facts in all languages', () => {
    for (const content of Object.values(locales)) {
      expect(content.meta.title).toContain('Coway');
      expect(`${content.hero.title} ${content.hero.subtitle}`).toContain('Coway');
      expect(content.opportunity.incomeRange).toBe('RM2,500-RM10,000+');
      expect(content.opportunity.commissionBased).toBe(true);
      expect(content.opportunity.guarantee).toBe(false);
      expect(content.opportunity.disclaimer.trim()).not.toBe('');
    }
  });

  it('models the applicant priorities in order', () => {
    expect(locales.en.candidateFit.priorities.map(({ audience }) => audience)).toEqual([
      'aspiringLeaders',
      'careerSwitchers',
      'existingSalespeople',
      'freshGraduates',
    ]);
  });

  it('welcomes committed applicants without requiring sales experience', () => {
    expect(locales.en.faq.items[1].answer).toBe(
      'No. Sales experience is not required. What matters most is your ambition, commitment to the industry, and willingness to learn. With the right attitude and consistent action, we can develop your skills and grow together.',
    );
    expect(locales.bm.faq.items[1].answer).toBe(
      'Tidak. Pengalaman jualan tidak diperlukan. Yang paling penting ialah cita-cita anda, komitmen terhadap industri ini dan kesediaan untuk belajar. Dengan sikap yang betul dan tindakan yang konsisten, kita boleh membina kemahiran anda dan berkembang bersama.',
    );
    expect(locales.zh.faq.items[1].answer).toBe(
      '不需要。销售经验并非必要条件。我们更看重你对这份事业的企图心、投入和学习意愿。只要保持正确的态度并持续行动，我们就能一起提升你的能力，共同成长。',
    );
  });
});
