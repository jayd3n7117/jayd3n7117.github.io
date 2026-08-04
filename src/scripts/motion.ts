import { revealDelay } from '../motion/scroll';

const root = document.documentElement;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const revealItems = [
  ...document.querySelectorAll<HTMLElement>('[data-reveal]'),
];

for (const group of document.querySelectorAll<HTMLElement>('[data-reveal-group]')) {
  group.querySelectorAll<HTMLElement>('[data-reveal]').forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${revealDelay(index)}ms`);
  });
}

for (const item of revealItems) {
  if (!item.style.getPropertyValue('--reveal-delay')) {
    item.style.setProperty('--reveal-delay', '0ms');
  }
}

let observer: IntersectionObserver | undefined;

const revealEverything = () => {
  for (const item of revealItems) item.classList.add('is-revealed');
};

const initialize = () => {
  observer?.disconnect();
  observer = undefined;
  root.classList.remove('motion-ready', 'motion-reduced');

  if (motionPreference.matches) {
    root.classList.add('motion-reduced');
    revealEverything();
    return;
  }

  root.classList.add('motion-ready');
  if (!('IntersectionObserver' in window)) {
    revealEverything();
    return;
  }

  observer = new IntersectionObserver(
    (entries, revealObserver) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  for (const item of revealItems) observer.observe(item);
};

motionPreference.addEventListener('change', initialize);
addEventListener(
  'pagehide',
  () => {
    observer?.disconnect();
    motionPreference.removeEventListener('change', initialize);
  },
  { once: true },
);
initialize();
