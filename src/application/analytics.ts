import { ANALYTICS_CONSENT_STORAGE_KEY } from '../config/analytics';

type LeadGtag = (command: string, ...values: unknown[]) => void;

interface LeadAnalyticsDependencies {
  storage?: Pick<Storage, 'getItem'>;
  gtag?: LeadGtag;
}

export function trackApplicationLead(
  dependencies: LeadAnalyticsDependencies = {},
): boolean {
  const storage = dependencies.storage ?? (
    typeof window === 'undefined' ? undefined : window.localStorage
  );
  const gtag = dependencies.gtag ?? (
    typeof window === 'undefined' ? undefined : window.gtag
  );

  if (!storage || !gtag) return false;

  try {
    if (storage.getItem(ANALYTICS_CONSENT_STORAGE_KEY) !== 'granted') {
      return false;
    }
  } catch {
    return false;
  }

  gtag('event', 'generate_lead', {
    form_id: 'career_application',
    opportunity_type: 'commission_sales',
  });
  return true;
}
