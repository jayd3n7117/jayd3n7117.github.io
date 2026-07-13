import { describe, expect, it } from 'vitest';

import { getSocialLinkAttributes, socialProfiles } from '../../src/config/social';

describe('social profile configuration', () => {
  it('lists the four requested platforms with empty initial destinations', () => {
    expect(socialProfiles.map(({ id, label }) => ({ id, label }))).toEqual([
      { id: 'facebook', label: 'Facebook' },
      { id: 'instagram', label: 'Instagram' },
      { id: 'tiktok', label: 'TikTok' },
      { id: 'xiaohongshu', label: 'Xiaohongshu' },
    ]);
    expect(socialProfiles.every(({ url }) => url === '')).toBe(true);
  });

  it('keeps blank destinations inert and secures configured external links', () => {
    expect(getSocialLinkAttributes('   ')).toBeNull();
    expect(getSocialLinkAttributes('https://social.example/profile')).toEqual({
      href: 'https://social.example/profile',
      target: '_blank',
      rel: 'noopener noreferrer',
    });
  });
});
