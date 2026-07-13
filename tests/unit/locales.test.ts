import { describe, expect, it } from 'vitest';

import { applicationInterim, getContent, locales } from '../../src/content/locales';

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
  'form',
  'faq',
  'footer',
] as const;

describe('localized recruitment content', () => {
  it('provides complete dictionaries for every public locale', () => {
    expect(Object.keys(locales)).toEqual(['en', 'bm', 'zh']);

    for (const locale of Object.keys(locales) as Array<keyof typeof locales>) {
      const content = getContent(locale);

      expect(Object.keys(content)).toEqual(requiredSections);
      expect(content.meta.title.trim()).not.toBe('');
      expect(content.meta.description.trim()).not.toBe('');
      expect(content.meta.language.trim()).not.toBe('');
      expect(content.support.items).toHaveLength(6);
      expect(content.form.fields).toHaveLength(5);
      expect(content.faq.items).toHaveLength(7);
      expect(content.opportunity.guarantee).toBe(false);
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

  it('provides an honest localized interim application message', () => {
    expect(Object.keys(applicationInterim)).toEqual(['en', 'bm', 'zh']);
    for (const message of Object.values(applicationInterim)) {
      expect(message.trim()).not.toBe('');
    }
  });

  it('preserves the required opportunity facts in all languages', () => {
    for (const content of Object.values(locales)) {
      expect(content.meta.title).toContain('Coway');
      expect(content.hero.title).toContain('Coway');
      expect(content.opportunity.incomeRange).toBe('RM2,500-RM10,000+');
      expect(content.opportunity.commissionBased).toBe(true);
      expect(content.opportunity.guarantee).toBe(false);
      expect(content.opportunity.disclaimer.trim()).not.toBe('');
    }
  });

  it('models the five required applicant categories in priority order', () => {
    expect(locales.en.form.fields.map(({ key }) => key)).toEqual([
      'name',
      'ageRange',
      'currentJob',
      'location',
      'salesExperience',
    ]);
    expect(locales.en.candidateFit.priorities.map(({ audience }) => audience)).toEqual([
      'experiencedSalespeople',
      'careerSwitchers',
      'ambitiousNewcomers',
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
