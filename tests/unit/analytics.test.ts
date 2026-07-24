import { describe, expect, it } from 'vitest';

import {
  ANALYTICS_CONSENT_STORAGE_KEY,
  GA_MEASUREMENT_ID,
} from '../../src/config/analytics';
import { getContent } from '../../src/content/locales';

describe('analytics configuration', () => {
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
