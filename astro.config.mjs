import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://example.com',
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
