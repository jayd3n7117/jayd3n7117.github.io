import { describe, expect, it } from 'vitest';
import { clamp01, sectionProgress } from '../../src/motion/scroll';

describe('scroll motion calculations', () => {
  it('clamps progress', () => {
    expect(clamp01(-0.2)).toBe(0);
    expect(clamp01(0.45)).toBe(0.45);
    expect(clamp01(1.2)).toBe(1);
  });

  it('maps section entry to normalized progress', () => {
    expect(sectionProgress(900, 600, 900)).toBe(0);
    expect(sectionProgress(300, 600, 900)).toBeCloseTo(0.667, 2);
  });
});
