import { clamp01, sectionProgress } from '../motion/scroll';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
const hero = document.querySelector<HTMLElement>('[data-performance-hero]');
const heroTitle = document.querySelector<HTMLElement>('[data-motion="hero-title"]');
const heroImage = document.querySelector<HTMLElement>('[data-motion="hero-image"]');
const motionCards = [...document.querySelectorAll<HTMLElement>('[data-motion-card]')];
const tickerTrack = document.querySelector<HTMLElement>('[data-ticker-track]');
const journeys = [...document.querySelectorAll<HTMLElement>('[data-journey]')];
const mediaTiles = [...document.querySelectorAll<HTMLElement>('[data-media-tile]')];

if (reduced) {
  root.classList.add('motion-reduced');
  revealItems.forEach((item) => item.classList.add('is-revealed'));
} else {
  root.classList.add('motion-ready');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-revealed'));
  }

  let frame = 0;
  const render = () => {
    frame = 0;
    const viewportHeight = window.innerHeight;
    const maximumScroll = Math.max(1, root.scrollHeight - viewportHeight);
    const pageProgress = clamp01(window.scrollY / maximumScroll);
    root.style.setProperty('--page-progress', pageProgress.toFixed(4));

    if (hero) {
      const progress = sectionProgress(hero.getBoundingClientRect().top, hero.offsetHeight, viewportHeight);
      heroTitle?.style.setProperty('transform', `translate3d(0, ${(-18 * progress).toFixed(2)}px, 0)`);
      heroTitle?.style.setProperty('opacity', `${1 - progress * 0.12}`);
      heroImage?.style.setProperty('transform', `translate3d(0, ${(22 * progress).toFixed(2)}px, 0)`);
      motionCards.forEach((card, index) => {
        const offset = (index - 1) * 8 * progress;
        card.style.setProperty('transform', `translate3d(${offset.toFixed(2)}px, ${(-10 * progress).toFixed(2)}px, 0)`);
      });
    }

    tickerTrack?.style.setProperty('transform', `translate3d(${(-36 * pageProgress).toFixed(2)}px, 0, 0)`);
    journeys.forEach((journey) => {
      const rect = journey.getBoundingClientRect();
      journey.style.setProperty('--journey-progress', `${sectionProgress(rect.top, rect.height, viewportHeight)}`);
    });
    mediaTiles.forEach((tile) => {
      const rect = tile.getBoundingClientRect();
      const progress = sectionProgress(rect.top, rect.height, viewportHeight);
      tile.style.setProperty('transform', `translate3d(0, ${((progress - 0.5) * 18).toFixed(2)}px, 0)`);
    });
  };

  const scheduleRender = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  addEventListener('scroll', scheduleRender, { passive: true });
  addEventListener('resize', scheduleRender, { passive: true });
  scheduleRender();
}
