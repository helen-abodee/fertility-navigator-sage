import { describe, it, expect } from "vitest";
import { questionSequence, nextQuestion, prevQuestion, progress, sectionOf } from "../lib/flow";
import type { Answers } from "../lib/types";

describe("entry triage calibrates the depth", () => {
  it("'just learning' goes straight to the hub, no personal questions", () => {
    expect(questionSequence({ entry: "exploring" })).toEqual(["goal", "entry"]);
    expect(nextQuestion({ entry: "exploring" }, "entry")).toBe("results");
  });

  it("no treatment plan yet: no treatment-detail questions at all", () => {
    const seq = questionSequence({ entry: "plan_no" });
    expect(seq).toEqual(["goal", "entry", "fertility_position", "has_plan", "age", "anatomy", "cancer_type", "feelings", "insurance", "zip"]);
  });

  it("in treatment now: full detail, no started-yet question needed", () => {
    const seq = questionSequence({ entry: "plan_yes", treatments: ["chemo"], cancerType: "breast", anatomy: "ovaries_uterus" });
    expect(seq).not.toContain("stage");
    expect(seq.indexOf("chemo_drugs")).toBe(seq.indexOf("treatments") + 1);
    expect(seq.indexOf("chemo_regimen")).toBe(seq.indexOf("chemo_drugs") + 1);
  });

  it("before treatment with a plan gets the treatment detail; without one, not", () => {
    expect(questionSequence({ entry: "plan_no", hasPlan: "yes" })).toContain("treatments");
    expect(questionSequence({ entry: "plan_no", hasPlan: "no" })).not.toContain("treatments");
    expect(questionSequence({ entry: "plan_no" })).not.toContain("treatments");
  });

  it("survivors get how-long-ago and the treatment detail", () => {
    const seq = questionSequence({ entry: "finished", stage: "finished" });
    expect(seq.indexOf("time_since")).toBe(seq.indexOf("fertility_position") + 1);
    expect(seq).toContain("treatments");
  });

  it("caregivers walk the full flow on the person's behalf", () => {
    const seq = questionSequence({ entry: "caregiver" });
    expect(seq).toContain("anatomy");
    expect(seq).toContain("feelings");
  });
});

describe("the regimen question stays gated", () => {
  it("never for testes, never without CRISP coverage", () => {
    const base: Answers = { entry: "plan_yes", treatments: ["chemo"], cancerType: "breast", anatomy: "ovaries_uterus" };
    expect(questionSequence(base)).toContain("chemo_regimen");
    expect(questionSequence({ ...base, anatomy: "testes" })).not.toContain("chemo_regimen");
    expect(questionSequence({ ...base, cancerType: "thyroid" })).not.toContain("chemo_regimen");
  });
});

describe("the practical section is gated on wanting children", () => {
  it("answering 'no' to children skips insurance, partner, and ZIP", () => {
    const seq = questionSequence({ entry: "plan_no", feelings: "no" });
    expect(seq).not.toContain("insurance");
    expect(seq).not.toContain("partner_insurance");
    expect(seq).not.toContain("zip");
    expect(seq[seq.length - 1]).toBe("feelings");
  });

  it("yes, maybe, and not sure all keep the practical section", () => {
    for (const feelings of ["yes", "maybe", "not_sure"] as const) {
      expect(questionSequence({ entry: "plan_no", feelings })).toContain("insurance");
    }
  });

  it("the survey never asks about partners (individual-first, per the social work guidance)", () => {
    expect(questionSequence({ entry: "plan_no", whoFor: "me_and_partner", feelings: "yes" })).not.toContain("partner_insurance");
    expect(questionSequence({ entry: "plan_no", feelings: "yes" })).not.toContain("who_for");
  });
});

describe("sections", () => {
  it("maps questions to the three survey sections", () => {
    expect(sectionOf("entry")).toBe(1);
    expect(sectionOf("radiation_area")).toBe(1);
    expect(sectionOf("feelings")).toBe(2);
    expect(sectionOf("insurance")).toBe(3);
    expect(sectionOf("zip")).toBe(3);
  });
});

describe("navigation still works", () => {
  it("advances and returns 'results' after the last question", () => {
    expect(nextQuestion({ entry: "plan_no" }, "entry")).toBe("fertility_position");
    expect(nextQuestion({ entry: "plan_no" }, "zip")).toBe("results");
  });

  it("back works across conditional questions", () => {
    expect(prevQuestion({ entry: "finished", stage: "finished" }, "age")).toBe("time_since");
    expect(prevQuestion({}, "entry")).toBe("goal");
    expect(prevQuestion({}, "goal")).toBe(null);
  });

  it("progress stays within [0, 1) everywhere", () => {
    const answers: Answers = { entry: "plan_yes", whoFor: "me_and_partner", treatments: ["chemo", "radiation"], cancerType: "breast" };
    for (const q of questionSequence(answers)) {
      const p = progress(answers, q);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThan(1);
    }
  });
});
