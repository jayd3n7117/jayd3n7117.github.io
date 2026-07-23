import { describe, expect, it, vi } from "vitest";

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
  contactNumber: "012-345 6789",
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

  it("rejects missing or forged enum and Malaysian location values", () => {
    const result = validateApplication({
      ...valid,
      ageRange: "",
      salesExperience: "unknown",
      state: "London",
    });

    expect(result.errors).toMatchObject({
      ageRange: "INVALID_OPTION",
      salesExperience: "INVALID_OPTION",
      state: "INVALID_OPTION",
    });
  });

  it("rejects an overlong name", () => {
    expect(validateApplication({ ...valid, name: "x".repeat(121) }).errors).toMatchObject({
      name: "TOO_LONG",
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

  it("trims optional text and omits blank optional values", () => {
    const result = validateApplication({
      ...valid,
      city: "  Shah Alam  ",
      experienceDetail: "   ",
    });

    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.city).toBe("Shah Alam");
      expect(result.data).not.toHaveProperty("experienceDetail");
    }
  });

  it("requires a contact number", () => {
    expect(validateApplication({ ...valid, contactNumber: "" })).toEqual(
      expect.objectContaining({
        valid: false,
        errors: expect.objectContaining({ contactNumber: "REQUIRED" }),
      }),
    );
  });

  it("accepts Malaysian-formatted contact numbers", () => {
    expect(validateApplication({ ...valid, contactNumber: "012-345 6789" }).valid).toBe(true);
    expect(validateApplication({ ...valid, contactNumber: "+60 12-345 6789" }).valid).toBe(true);
  });

  it("rejects malformed and seven-digit contact numbers", () => {
    for (const contactNumber of ["1234567", "012-ABC-6789"]) {
      expect(validateApplication({ ...valid, contactNumber })).toEqual(
        expect.objectContaining({
          valid: false,
          errors: expect.objectContaining({ contactNumber: "INVALID_PHONE" }),
        }),
      );
    }
  });

  it("rejects a contact number containing a tab", () => {
    for (const contactNumber of ["012\t345 6789", "012-345 6789\t"]) {
      expect(validateApplication({ ...valid, contactNumber })).toEqual(
        expect.objectContaining({
          valid: false,
          errors: expect.objectContaining({ contactNumber: "INVALID_PHONE" }),
        }),
      );
    }
  });

  it("rejects a contact number containing a newline", () => {
    for (const contactNumber of ["012\n345 6789", "012-345 6789\n"]) {
      expect(validateApplication({ ...valid, contactNumber })).toEqual(
        expect.objectContaining({
          valid: false,
          errors: expect.objectContaining({ contactNumber: "INVALID_PHONE" }),
        }),
      );
    }
  });

  it("posts the application to Formspree as JSON", async () => {
    const fetcher = vi.fn(async () => new Response("{}", { status: 200 }));

    await expect(submitApplication(valid, fetcher)).resolves.toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledWith(
      "https://formspree.io/f/xvzebykj",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(valid),
      },
    );
  });

  it("reports a rejected Formspree response", async () => {
    const fetcher = vi.fn(async () => new Response("{}", { status: 500 }));

    await expect(submitApplication(valid, fetcher)).resolves.toEqual({ ok: false });
  });

  it("reports a network failure without throwing", async () => {
    const fetcher = vi.fn(async () => {
      throw new TypeError("Network unavailable");
    });

    await expect(submitApplication(valid, fetcher)).resolves.toEqual({ ok: false });
  });
});
