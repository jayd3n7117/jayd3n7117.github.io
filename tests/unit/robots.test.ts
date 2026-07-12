import { describe, expect, it } from 'vitest';

import { buildRobotsTxt } from '../../src/config/site';

describe('robots.txt', () => {
  it('allows crawling and advertises the generated sitemap index', () => {
    expect(buildRobotsTxt(new URL('https://join.example.org'))).toBe(
      'User-agent: *\nAllow: /\nSitemap: https://join.example.org/sitemap-index.xml\n',
    );
  });
});
