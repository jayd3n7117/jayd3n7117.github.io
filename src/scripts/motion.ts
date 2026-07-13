import { clamp01, sectionProgress } from '../motion/scroll';

const root = document.documentElement;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const revealItems = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
const hero = document.querySelector<HTMLElement>('[data-performance-hero]');
const heroTitle = document.querySelector<HTMLElement>('[data-motion="hero-title"]');
const heroImage = document.querySelector<HTMLElement>('[data-motion="hero-image"]');
const motionCards = [...document.querySelectorAll<HTMLElement>('[data-motion-card]')];
const tickerTrack = document.querySelector<HTMLElement>('[data-ticker-track]');
const journeys = [...document.querySelectorAll<HTMLElement>('[data-journey]')];
const mediaLayers = [...document.querySelectorAll<HTMLElement>('[data-motion-media-layer]')];

let cleanup = () => {};
const initialize = () => {
  cleanup();
  root.classList.remove('motion-ready', 'motion-reduced');
  if (motionPreference.matches) {
    root.classList.add('motion-reduced');
    revealItems.forEach((item) => item.classList.add('is-revealed'));
    [heroTitle, heroImage, tickerTrack, ...motionCards, ...mediaLayers].forEach((item) => item?.style.removeProperty('transform'));
    heroTitle?.style.removeProperty('opacity');
    journeys.forEach((journey) => journey.style.removeProperty('--journey-progress'));
    root.style.removeProperty('--page-progress');
    return;
  }
  root.classList.add('motion-ready');

  let observer: IntersectionObserver | undefined;
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          revealObserver.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    observer = revealObserver;
    revealItems.forEach((item) => revealObserver.observe(item));
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
    mediaLayers.forEach((layer) => {
      const rect = layer.getBoundingClientRect();
      const progress = sectionProgress(rect.top, rect.height, viewportHeight);
      layer.style.setProperty('transform', `translate3d(0, ${((progress - 0.5) * 18).toFixed(2)}px, 0) scale(1.04)`);
    });
  };

  const scheduleRender = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  addEventListener('scroll', scheduleRender, { passive: true });
  addEventListener('resize', scheduleRender, { passive: true });
  scheduleRender();
  cleanup = () => {
    removeEventListener('scroll', scheduleRender);
    removeEventListener('resize', scheduleRender);
    if (frame) cancelAnimationFrame(frame);
    observer?.disconnect();
  };
};

motionPreference.addEventListener('change', initialize);
addEventListener('pagehide', () => {
  cleanup();
  motionPreference.removeEventListener('change', initialize);
}, { once: true });
initialize();
