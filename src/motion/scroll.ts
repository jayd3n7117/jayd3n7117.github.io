export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const sectionProgress = (
  rectTop: number,
  rectHeight: number,
  viewportHeight: number,
) => clamp01((viewportHeight - rectTop) / (rectHeight + viewportHeight / 3));
