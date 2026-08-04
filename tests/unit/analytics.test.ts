import { describe, expect, it, vi } from 'vitest';

import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
} from '../../src/config/analytics';
import { getContent } from '../../src/content/locales';
import { trackApplicationLead } from '../../src/application/analytics';

describe('analytics configuration', () => {
  it('emits a non-PII generate_lead event only with granted analytics consent', () => {
    const gtag = vi.fn();
    const grantedStorage = {
      getItem: vi.fn(() => 'granted'),
    } as unknown as Storage;

    expect(trackApplicationLead({ storage: grantedStorage, gtag })).toBe(true);
    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith('event', 'generate_lead', {
      form_id: 'career_application',
      opportunity_type: 'commission_sales',
    });
    expect(JSON.stringify(gtag.mock.calls)).not.toMatch(
      /name|phone|contact|city|experience_detail/i,
    );

    const deniedGtag = vi.fn();
    const deniedStorage = {
      getItem: vi.fn(() => 'denied'),
    } as unknown as Storage;
    expect(trackApplicationLead({ storage: deniedStorage, gtag: deniedGtag })).toBe(false);
    expect(deniedGtag).not.toHaveBeenCalled();
  });

  it('fails closed when analytics consent storage cannot be read', () => {
    const gtag = vi.fn();
    const storage = {
      getItem: vi.fn(() => { throw new Error('unavailable'); }),
    } as unknown as Storage;

    expect(trackApplicationLead({ storage, gtag })).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });
  it('uses the approved public GA4 identifiers', () => {
    expect(GA_MEASUREMENT_ID).toBe('G-KGTRGW5765');
    expect(ANALYTICS_CONSENT_STORAGE_KEY).toBe('coway-analytics-consent');
  });

  it.each(['en', 'bm', 'zh'] as const)(
    'provides complete %s consent and privacy copy',
    (locale) => {
      const content = getContent(locale);

      expect(content.analytics.message.trim()).not.toBe('');
      expect(content.analytics.accept.trim()).not.toBe('');
      expect(content.analytics.decline.trim()).not.toBe('');
      expect(content.footer.privacy).toContain('Google Analytics');
    },
  );
});
