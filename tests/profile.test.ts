import { describe, it, expect } from "vitest";
import { profilesEnabled, CONSENT_VERSION, saveProfileData } from "../lib/profile";
import { emptyJourney } from "../lib/journey";

describe("lane-2 profiles", () => {
  it("is off without the flag and env", () => {
    expect(profilesEnabled).toBe(false);
  });

  it("never stores anything without consent, even when called", async () => {
    const ok = await saveProfileData({ age: 24 }, emptyJourney(), false);
    expect(ok).toBe(false);
  });

  it("consent version is a dated string that the consent screen must show", () => {
    expect(CONSENT_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
