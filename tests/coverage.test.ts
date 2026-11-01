import { describe, it, expect } from "vitest";
import { assessCoverage } from "../lib/coverage";

describe("coverage checker (D4 toolkit + SB 600 / SB 729)", () => {
  it("CA fully insured job plan, before treatment: likely covered under SB 600", () => {
    const v = assessCoverage({
      channel: "job",
      funding: "fully_insured",
      basedInCalifornia: "yes",
      stage: "not_started",
    });
    expect(v.verdict).toBe("likely_covered");
    expect(v.body).toContain("SB 600");
    expect(v.steps.length).toBeGreaterThan(1);
    expect(v.citations.length).toBeGreaterThan(0);
  });

  it("self-funded employer plan: not subject to the state mandate", () => {
    const v = assessCoverage({
      channel: "job",
      funding: "self_funded",
      basedInCalifornia: "yes",
      stage: "not_started",
    });
    expect(v.verdict).toBe("likely_not_covered");
  });

  it("unknown funding: depends, and the first step is finding out the funding type", () => {
    const v = assessCoverage({
      channel: "job",
      funding: "unknown",
      basedInCalifornia: "yes",
      stage: "not_started",
    });
    expect(v.verdict).toBe("depends");
    expect(v.steps[0].label.toLowerCase()).toContain("self-funded");
  });

  it("survivor on a large-group CA fully insured plan: SB 729 IVF coverage", () => {
    const v = assessCoverage({
      channel: "job",
      funding: "fully_insured",
      employerSize: "large",
      basedInCalifornia: "yes",
      stage: "finished",
    });
    expect(v.verdict).toBe("likely_covered");
    expect(v.body).toContain("SB 729");
  });

  it("survivor on a small-group plan: offer-only, so it depends", () => {
    const v = assessCoverage({
      channel: "job",
      funding: "fully_insured",
      employerSize: "small",
      basedInCalifornia: "yes",
      stage: "finished",
    });
    expect(v.verdict).toBe("depends");
  });

  it("Medi-Cal: honestly not covered, with aid as the next step", () => {
    const v = assessCoverage({ channel: "medi_cal", stage: "not_started" });
    expect(v.verdict).toBe("likely_not_covered");
    expect(v.steps.map((s) => s.label).join(" ").toLowerCase()).toContain("aid");
  });

  it("Medicare and military dependents: not covered; active service members and federal employees: covered", () => {
    expect(assessCoverage({ channel: "medicare" }).verdict).toBe("likely_not_covered");
    expect(assessCoverage({ channel: "military_dependent" }).verdict).toBe("likely_not_covered");
    expect(assessCoverage({ channel: "military_active" }).verdict).toBe("likely_covered");
    expect(assessCoverage({ channel: "federal" }).verdict).toBe("likely_covered");
  });

  it("plan based outside California: depends on that state's law", () => {
    const v = assessCoverage({
      channel: "job",
      funding: "fully_insured",
      basedInCalifornia: "no",
      stage: "not_started",
    });
    expect(v.verdict).toBe("depends");
    expect(v.body.toLowerCase()).toContain("state");
  });

  it("no insurance: not covered, aid and clinic cash programs as next steps", () => {
    const v = assessCoverage({ channel: "none" });
    expect(v.verdict).toBe("likely_not_covered");
    expect(v.steps.length).toBeGreaterThan(0);
  });

  it("never promises: covered verdicts still say to verify", () => {
    const v = assessCoverage({
      channel: "covered_ca",
      basedInCalifornia: "yes",
      stage: "not_started",
    });
    expect(v.verdict).toBe("likely_covered");
    const all = (v.body + v.steps.map((s) => s.label + (s.detail ?? "")).join(" ")).toLowerCase();
    expect(all).toMatch(/verify|ask|call/);
  });
});
