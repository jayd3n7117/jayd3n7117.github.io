import { describe, expect, it } from "vitest";

import {
  submitApplication,
  validateApplication,
} from "../../src/application/schema";

const valid = {
  name: "  Aina Rahman  ",
  ageRange: "25-34",
  currentJob: "Sales executive",
  state: "Selangor",
  city: "Shah Alam",
  salesExperience: "1-3",
  experienceDetail: "Retail and account management",
  consent: true,
};

describe("application validation", () => {
  it("trims and accepts a complete valid application", () => {
    expect(validateApplication(valid)).toEqual({
      valid: true,
      data: { ...valid, name: "Aina Rahman" },
      errors: {},
    });
  });

  it("returns field-keyed codes for invalid required values and enums", () => {
    const result = validateApplication({
      ...valid,
      name: " A ",
      ageRange: "17",
      currentJob: " ",
      state: "",
      salesExperience: "many",
      consent: false,
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      name: "NAME_TOO_SHORT",
      ageRange: "INVALID_OPTION",
      currentJob: "REQUIRED",
      state: "REQUIRED",
      salesExperience: "INVALID_OPTION",
      consent: "CONSENT_REQUIRED",
    });
  });

  it("limits all free text fields to 120 characters", () => {
    const result = validateApplication({
      ...valid,
      currentJob: "x".repeat(121),
      city: "x".repeat(121),
      experienceDetail: "x".repeat(121),
    });

    expect(result.errors).toMatchObject({
      currentJob: "TOO_LONG",
      city: "TOO_LONG",
      experienceDetail: "TOO_LONG",
    });
  });

  it("never transmits and reports that submission is not configured", async () => {
    await expect(submitApplication(valid)).resolves.toEqual({
      ok: false,
      code: "SUBMISSION_NOT_CONFIGURED",
    });
  });
});
