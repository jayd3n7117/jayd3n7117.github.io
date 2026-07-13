import { describe, expect, it } from 'vitest';

import { getSocialLinkAttributes, socialProfiles } from '../../src/config/social';

describe('social profile configuration', () => {
  it('lists the four requested platforms with their supplied destinations', () => {
    expect(socialProfiles).toEqual([
      { id: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/share/19WmC6tBsQ/' },
      { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/heipige_choy?igsh=eWc2YjFienF5bHdi' },
      { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@captain.choy?_r=1&_t=ZS-97zTdFNzYhw' },
      { id: 'xiaohongshu', label: 'Xiaohongshu', url: 'https://xhslink.com/m/2fkDxBavMuL' },
    ]);
  });

  it('keeps blank destinations inert and secures configured external links', () => {
    expect(getSocialLinkAttributes('   ')).toBeNull();
    expect(getSocialLinkAttributes('https://www.facebook.com/share/19WmC6tBsQ/')).toEqual({
      href: 'https://www.facebook.com/share/19WmC6tBsQ/',
      target: '_blank',
      rel: 'noopener noreferrer',
    });
  });
});
