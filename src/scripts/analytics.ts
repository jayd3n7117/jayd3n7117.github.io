type ConsentChoice = 'granted' | 'denied';
type GtagArguments = [command: string, ...values: unknown[]];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: GtagArguments) => void;
  }
}

const root = document.querySelector<HTMLElement>('[data-analytics-consent]');

if (root) {
  const accept = root.querySelector<HTMLButtonElement>(
    '[data-analytics-accept]',
  );
  const decline = root.querySelector<HTMLButtonElement>(
    '[data-analytics-decline]',
  );
  const measurementId = root.dataset.measurementId;
  const storageKey = root.dataset.storageKey;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    (function gtag() {
      window.dataLayer.push(arguments);
    } as Window['gtag']);

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });

  const loadGoogleTag = () => {
    if (
      !measurementId ||
      document.querySelector(
        `[data-google-analytics-tag="${measurementId}"]`,
      )
    ) {
      return;
    }

    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      measurementId,
    )}`;
    script.dataset.googleAnalyticsTag = measurementId;
    document.head.append(script);
  };

  const readChoice = (): ConsentChoice | null => {
    if (!storageKey) return null;
    try {
      const value = window.localStorage.getItem(storageKey);
      return value === 'granted' || value === 'denied' ? value : null;
    } catch {
      return null;
    }
  };

  const saveChoice = (choice: ConsentChoice) => {
    if (!storageKey) return false;
    try {
      window.localStorage.setItem(storageKey, choice);
      return true;
    } catch {
      return false;
    }
  };

  const applyChoice = (choice: ConsentChoice) => {
    if (choice === 'granted') loadGoogleTag();
    root.hidden = true;
  };

  const savedChoice = readChoice();
  if (savedChoice) {
    applyChoice(savedChoice);
  } else {
    root.hidden = false;
  }

  accept?.addEventListener('click', () => {
    if (saveChoice('granted')) applyChoice('granted');
  });
  decline?.addEventListener('click', () => {
    if (saveChoice('denied')) applyChoice('denied');
  });
}

export {};
