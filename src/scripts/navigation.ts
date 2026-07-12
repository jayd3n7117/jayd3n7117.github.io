const recognizedHashes = new Set([
  '#opportunity',
  '#support',
  '#growth',
  '#faq',
  '#apply',
]);

document.addEventListener('click', (event) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Element)) return;

  const link = target.closest<HTMLAnchorElement>('a[data-locale-link]');
  if (!link || link.hasAttribute('download') || link.target) return;

  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin) return;

  destination.hash = recognizedHashes.has(window.location.hash)
    ? window.location.hash
    : '';

  const locale = destination.pathname.split('/').filter(Boolean)[0];
  if (locale) {
    try {
      window.localStorage.setItem('preferredLocale', locale);
    } catch {
      // Storage is optional; navigation must continue when it is unavailable.
    }
  }

  event.preventDefault();
  window.location.assign(destination);
});
