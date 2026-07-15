import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

const root = process.cwd();

describe('GitHub Pages deployment configuration', () => {
  it('protects original source assets from Git tracking', () => {
    const gitignore = readFileSync(join(root, '.gitignore'), 'utf8');

    expect(gitignore.split(/\r?\n/)).toContain('assets-source/');
  });

  it('builds and deploys the production site from master', () => {
    const workflow = readFileSync(
      join(root, '.github', 'workflows', 'deploy.yml'),
      'utf8',
    );

    expect(workflow).toContain('branches: [master]');
    expect(workflow).toContain('PUBLIC_SITE_URL: https://jayd3n7117.github.io');
    expect(workflow).toContain('uses: withastro/action@v6');
    expect(workflow).toContain('uses: actions/deploy-pages@v4');
  });
});
