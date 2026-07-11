const revealItems = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || revealItems.length === 0) {
  document.documentElement.classList.add('motion-reduced');
} else {
  document.documentElement.classList.add('motion-ready');

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-revealed'));
  } else {
    let remaining = revealItems.length;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
          remaining -= 1;
        }

        if (remaining === 0) observer.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    revealItems.forEach((item) => observer.observe(item));
  }
}
