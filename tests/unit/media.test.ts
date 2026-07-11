import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { media } from '../../src/content/media';
import {
  createVideoDescriptor,
  requireVideoCapabilities,
} from '../../scripts/optimize-media.mjs';

const publicRoot = join(process.cwd(), 'public');
const webSafePath = /^\/media\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:avif|webm|webp|mp4|png)$/;

const imageEntries = [media.logo, media.hero, ...media.culture, ...media.achievements];

describe('media manifest', () => {
  it('requires MP4 support but represents unavailable WebM as null', () => {
    expect(() => requireVideoCapabilities({
      supportsMov: true,
      supportsMp4: true,
      supportsWebm: false,
    })).not.toThrow();
    expect(createVideoDescriptor({ supportsWebm: false }).webm).toBeNull();

    expect(() => requireVideoCapabilities({
      supportsMov: true,
      supportsMp4: false,
      supportsWebm: true,
    })).toThrow(/MP4.*libx264/i);
  });

  it('provides authentic culture and achievement media', () => {
    expect(media.culture.length).toBeGreaterThan(0);
    expect(media.achievements.length).toBeGreaterThan(0);
  });

  it('provides intrinsic dimensions and factual localized alt text for every image', () => {
    for (const entry of imageEntries) {
      expect(entry.width).toBeGreaterThan(0);
      expect(entry.height).toBeGreaterThan(0);
      expect(entry.alt.en.trim()).not.toBe('');
      expect(entry.alt.bm.trim()).not.toBe('');
      expect(entry.alt.zh.trim()).not.toBe('');
    }
  });

  it('references generated files with web-safe names', () => {
    const paths = imageEntries.flatMap((entry) => [
      entry.src,
      ...entry.sources.webp.map((source) => source.src),
      ...entry.sources.avif.map((source) => source.src),
    ]);

    paths.push(
      ...([media.video.poster, media.video.mp4, media.video.webm] as (string | null)[]).filter(
        (path): path is string => path !== null,
      ),
    );

    for (const path of paths) {
      expect(path).toMatch(webSafePath);
      expect(existsSync(join(publicRoot, path))).toBe(true);
    }
  });

  it('provides responsive 640, 960, and 1440 image candidates where useful', () => {
    for (const entry of [...media.culture, ...media.achievements]) {
      expect(entry.sources.webp.map(({ width }) => width)).toEqual([640, 960, 1440]);
      expect(entry.sources.avif.map(({ width }) => width)).toEqual([640, 960, 1440]);
    }
  });
});
