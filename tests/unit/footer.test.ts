import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';

import Footer from '../../src/components/Footer.astro';
import { locales } from '../../src/content/locales';
import type { SocialProfile } from '../../src/config/social';

describe('footer social rendering', () => {
  it('renders a blank social destination as a localized inert control', async () => {
    const profiles: readonly SocialProfile[] = [
      { id: 'facebook', label: 'Facebook', url: '' },
    ];
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer, {
      props: { locale: 'en', content: locales.en, profiles },
    });
    const control = html.match(/<(?:a|span)[^>]*data-social-platform="facebook"[^>]*>/)?.[0];

    expect(control).toBeDefined();
    expect(control).toMatch(/^<span\b/);
    expect(control).toContain('aria-disabled="true"');
    expect(control).toContain('aria-label="Facebook: link not available yet"');
    expect(control).not.toContain('href=');
    expect(control).not.toContain('tabindex="0"');
  });
});
