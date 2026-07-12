interface SiteUrlOptions {
  command: 'dev' | 'build';
  siteUrl?: string;
}

export function resolveSiteUrl({ command, siteUrl }: SiteUrlOptions): string {
  if (command === 'dev' && !siteUrl) return 'http://localhost:4321';
  if (!siteUrl) throw new Error('PUBLIC_SITE_URL is required for production builds');

  let url: URL;
  try {
    url = new URL(siteUrl);
  } catch {
    throw new Error('PUBLIC_SITE_URL must be a valid absolute HTTPS URL');
  }

  if (url.protocol !== 'https:' || url.hostname === 'example.com') {
    throw new Error('PUBLIC_SITE_URL must use HTTPS and cannot use example.com');
  }

  return url.origin;
}

export function buildRobotsTxt(site: URL): string {
  return `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', site)}\n`;
}
