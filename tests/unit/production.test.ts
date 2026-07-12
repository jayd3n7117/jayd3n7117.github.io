import { describe, expect, it } from 'vitest';

import { resolveSiteUrl } from '../../src/config/site';

describe('production site origin', () => {
  it('uses localhost when running the local development server', () => {
    expect(resolveSiteUrl({ command: 'dev', siteUrl: undefined })).toBe('http://localhost:4321');
  });

  it('uses PUBLIC_SITE_URL after validating it', () => {
    expect(resolveSiteUrl({ command: 'build', siteUrl: 'https://join.example.org/' })).toBe(
      'https://join.example.org',
    );
  });

  it('rejects a production build without PUBLIC_SITE_URL', () => {
    expect(() => resolveSiteUrl({ command: 'build', siteUrl: undefined })).toThrow(
      'PUBLIC_SITE_URL is required for production builds',
    );
  });

  it.each(['https://example.com', 'not-a-url', 'ftp://join.example.org'])('rejects unsafe production origin %s', (siteUrl) => {
    expect(() => resolveSiteUrl({ command: 'build', siteUrl })).toThrow();
  });
});
