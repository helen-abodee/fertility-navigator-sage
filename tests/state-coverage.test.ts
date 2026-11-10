import { describe, it, expect } from "vitest";
import { coverageForState, stateCoverage } from "../content/app/state-coverage";
import { assessCoverage } from "../lib/coverage";

describe("AFP state coverage data", () => {
  it("carries 23 jurisdictions with laws (incl. DC, FEHB, VHA; CA handled separately)", () => {
    expect(stateCoverage.length).toBe(23);
    expect(coverageForState("CA")).toBeUndefined();
  });

  it("every entry has at least one plan kind or program, services, and an AFP link", () => {
    for (const s of stateCoverage) {
      expect(s.services.length, s.abb).toBeGreaterThan(0);
      expect(s.afpPath, s.abb).toMatch(/^\/states\//);
    }
  });

  it("New York covers all five services and Medicaid per AFP", () => {
    const ny = coverageForState("NY")!;
    for (const svc of ["sperm", "egg", "embryo", "ovarian_tissue", "storage"]) {
      expect(ny.services).toContain(svc);
    }
    expect(ny.plans).toContain("medicaid");
  });

  it("Texas is cancer-limited with no embryo coverage per AFP", () => {
    const tx = coverageForState("TX")!;
    expect(tx.notes).toContain("cancer_only");
    expect(tx.services).not.toContain("embryo");
  });
});

describe("out-of-state verdicts", () => {
  it("a New York fully insured job plan is likely covered, cited to AFP", () => {
    const v = assessCoverage({ channel: "job", basedInCalifornia: "no", planState: "NY", funding: "fully_insured" });
    expect(v.verdict).toBe("likely_covered");
    expect(v.headline).toContain("New York");
    expect(v.citations.some((c) => c.sourceId === "afp-coverage-map")).toBe(true);
  });

  it("self-funded beats any state law", () => {
    const v = assessCoverage({ channel: "job", basedInCalifornia: "no", planState: "NY", funding: "self_funded" });
    expect(v.verdict).toBe("likely_not_covered");
  });

  it("a state with no law gets the honest no plus aid", () => {
    const v = assessCoverage({ channel: "job", basedInCalifornia: "no", planState: "WY", funding: "fully_insured" });
    expect(v.verdict).toBe("likely_not_covered");
    expect(v.body).toContain("Alliance for Fertility Preservation");
  });

  it("unknown state keeps the depends verdict", () => {
    const v = assessCoverage({ channel: "job", basedInCalifornia: "no" });
    expect(v.verdict).toBe("depends");
  });
});
