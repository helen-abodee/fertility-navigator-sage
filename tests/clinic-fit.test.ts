import { describe, it, expect } from "vitest";
import clinics from "../data/clinics.json";
import { clinicFitsAnatomy } from "../lib/clinic-fit";
import type { Clinic } from "../lib/types";

const all = clinics as unknown as Clinic[];
const byId = (id: string) => all.find((c) => c.id === id)!;

describe("anatomy-aware clinic relevance", () => {
  it("California Cryobank is hidden from ovaries users, shown to testes users", () => {
    const ccb = byId("california-cryobank");
    expect(clinicFitsAnatomy(ccb, "ovaries_uterus")).toBe(false);
    expect(clinicFitsAnatomy(ccb, "testes")).toBe(true);
  });

  it("unknown or skipped anatomy hides nothing", () => {
    for (const c of all) {
      expect(clinicFitsAnatomy(c, undefined)).toBe(true);
    }
  });

  it("full-service fertility clinics stay visible to everyone", () => {
    const pinnacle = byId("pinnacle-fertility-los-angeles");
    expect(clinicFitsAnatomy(pinnacle, "ovaries_uterus")).toBe(true);
    expect(clinicFitsAnatomy(pinnacle, "testes")).toBe(true);
  });

  it("every clinic remains reachable by at least one anatomy", () => {
    for (const c of all) {
      const visible = clinicFitsAnatomy(c, "ovaries_uterus") || clinicFitsAnatomy(c, "testes");
      expect(visible, c.id).toBe(true);
    }
  });
});
