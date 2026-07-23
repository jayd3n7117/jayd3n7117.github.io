import { defineConfig } from '@playwright/test';

const useExternalServer = process.env.PLAYWRIGHT_EXTERNAL_SERVER === '1';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 10_000,
  reporter: 'line',
  use: { baseURL: 'http://127.0.0.1:4321' },
  webServer: useExternalServer ? undefined : {
    command: 'node node_modules/astro/bin/astro.mjs preview --host 127.0.0.1',
    env: { ...process.env, PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL ?? 'https://join.coway.test' },
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
  },
});
