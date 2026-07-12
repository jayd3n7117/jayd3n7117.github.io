import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { media } from '../../src/content/media';
import {
  IMAGE_WIDTHS,
  canEncodeWebm,
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

  it('advertises only candidates that do not enlarge the original image', () => {
    const expectedWidthsByAsset: Record<string, number[]> = {
      'team-gathering': [640, 960, 1440, 1920],
      'team-social-gathering': [640, 960, 1440, 1920],
      'team-meeting': [640, 960, 1440, 1920],
      'team-outdoor-activity': [640, 960],
      'promotion-stage-photo': [640, 960],
      'certificate-group-photo': [640, 960, 1440, 1920],
      'manager-promotion-graphic': [640],
    };

    [...media.culture, ...media.achievements].forEach((entry) => {
      const asset = entry.src.match(/^\/media\/(.+)-\d+\.webp$/)?.[1];
      expect(asset).toBeDefined();
      expect(entry.sources.webp.map(({ width }) => width)).toEqual(expectedWidthsByAsset[asset!]);
      expect(entry.sources.avif.map(({ width }) => width)).toEqual(expectedWidthsByAsset[asset!]);
    });
  });
});

describe('high-quality media policy', () => {
  it('offers a 1920px candidate for edge-to-edge desktop photography', () => {
    expect(IMAGE_WIDTHS).toEqual([640, 960, 1440, 1920]);
  });

  it('keeps MP4 mandatory and WebM optional', () => {
    expect(createVideoDescriptor({ supportsWebm: false })).toEqual({
      poster: '/media/team-video-poster.webp',
      mp4: '/media/team-video-720.mp4',
      webm: null,
    });
  });

  it('skips WebM when VP9 is available but the Opus audio encoder is not', () => {
    const supportsWebm = canEncodeWebm({
      supportsMuxer: true,
      supportsVp9: true,
      supportsOpus: false,
    });

    expect(supportsWebm).toBe(false);
    expect(createVideoDescriptor({ supportsWebm }).webm).toBeNull();
  });
});
