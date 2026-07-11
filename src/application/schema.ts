export const AGE_RANGES = ["18-24", "25-34", "35-44", "45+"] as const;
export const SALES_EXPERIENCE = ["none", "<1", "1-3", "4-6", "7+"] as const;
export const MALAYSIAN_LOCATIONS = ["Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang", "Penang", "Perak", "Perlis", "Sabah", "Sarawak", "Selangor", "Terengganu", "Kuala Lumpur", "Labuan", "Putrajaya"] as const;
export type State = (typeof MALAYSIAN_LOCATIONS)[number];

export interface ApplicationData {
  name: string;
  ageRange: (typeof AGE_RANGES)[number];
  currentJob: string;
  state: State;
  city?: string;
  salesExperience: (typeof SALES_EXPERIENCE)[number];
  experienceDetail?: string;
  consent: true;
}

export type ApplicationField = keyof ApplicationData;
export type ValidationErrorCode =
  | "REQUIRED"
  | "NAME_TOO_SHORT"
  | "INVALID_OPTION"
  | "TOO_LONG"
  | "CONSENT_REQUIRED";

export type ValidationResult =
  | { valid: true; data: ApplicationData; errors: {} }
  | { valid: false; errors: Partial<Record<ApplicationField, ValidationErrorCode>> };

const textFields = ["currentJob", "state", "city", "experienceDetail"] as const;

export function validateApplication(input: Record<string, unknown>): ValidationResult {
  const value = Object.fromEntries(
    Object.entries(input).map(([key, item]) => [key, typeof item === "string" ? item.trim() : item]),
  ) as Record<string, unknown>;
  const errors: Partial<Record<ApplicationField, ValidationErrorCode>> = {};

  const name = typeof value.name === "string" ? value.name : "";
  if (!name) errors.name = "REQUIRED";
  else if (name.length < 2) errors.name = "NAME_TOO_SHORT";
  else if (name.length > 120) errors.name = "TOO_LONG";

  for (const field of textFields) {
    const text = typeof value[field] === "string" ? value[field] : "";
    if ((field === "currentJob" || field === "state") && !text) errors[field] = "REQUIRED";
    else if (text.length > 120) errors[field] = "TOO_LONG";
  }
  if (typeof value.state === "string" && value.state && !MALAYSIAN_LOCATIONS.includes(value.state as never)) errors.state = "INVALID_OPTION";
  if (!AGE_RANGES.includes(value.ageRange as never)) errors.ageRange = "INVALID_OPTION";
  if (!SALES_EXPERIENCE.includes(value.salesExperience as never)) errors.salesExperience = "INVALID_OPTION";
  if (value.consent !== true) errors.consent = "CONSENT_REQUIRED";

  if (Object.keys(errors).length) return { valid: false, errors };
  const data = value as unknown as ApplicationData;
  if (!data.city) delete data.city;
  if (!data.experienceDetail) delete data.experienceDetail;
  return { valid: true, data, errors: {} };
}

export async function submitApplication(_data: ApplicationData | Record<string, unknown>) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return { ok: false as const, code: "SUBMISSION_NOT_CONFIGURED" as const };
}
