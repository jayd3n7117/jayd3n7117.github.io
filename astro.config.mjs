import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { resolveSiteUrl } from './src/config/site.ts';

const command = process.argv.includes('build') ? 'build' : 'dev';

export default defineConfig({
  site: resolveSiteUrl({ command, siteUrl: process.env.PUBLIC_SITE_URL }),
  output: 'static',
  trailingSlash: 'always',
  redirects: {
    '/': '/en/',
  },
  integrations: [sitemap()],
  i18n: {
    locales: ['en', 'bm', 'zh'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
