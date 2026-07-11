import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 10_000,
  reporter: 'line',
  use: { baseURL: 'http://127.0.0.1:4321' },
  webServer: {
    command: '"C:\\Users\\CH\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin\\node.exe" node_modules/astro/bin/astro.mjs preview --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: false,
  },
});
