import { describe, it, expect } from "vitest";
import { matchesAudience, buildResults } from "../lib/results";
import type { AppContent } from "../lib/content-schema";
import type { Answers, Citation } from "../lib/types";

const cite: Citation = {
  sourceId: "test",
  sourceName: "Test source",
  retrieved: "2026-10-30",
};

const fixture: AppContent = {
  lastReviewed: "2026-10-30",
  options: [
    {
      id: "egg_freezing",
      name: "Egg freezing",
      shortDescription: "Eggs are collected and frozen before treatment.",
      status: "established",
      citations: [cite],
      audience: { anatomy: ["ovaries_uterus"], stages: ["not_started", "finished"] },
      audienceCitations: [cite],
      steps: [{ title: "Consult", body: "Meet the team." }],
      stepsCitations: [cite],
      expectations: "Results vary.",
      expectationsCitations: [cite],
      costs: [],
    },
    {
      id: "sperm_banking",
      name: "Sperm banking",
      shortDescription: "Sperm is collected and frozen.",
      status: "established",
      citations: [cite],
      audience: { anatomy: ["testes"], stages: ["not_started"] },
      audienceCitations: [cite],
      steps: [],
      stepsCitations: [cite],
      expectations: "Results vary.",
      expectationsCitations: [cite],
      costs: [],
    },
  ],
  guidance: [
    {
      id: "ca_commercial_pre",
      audience: { insurance: ["ca_commercial"], stages: ["not_started", "in_treatment"] },
      heading: "Your plan may be required to cover this",
      paragraphs: [{ text: "SB 600 applies.", citations: [cite] }],
    },
    {
      id: "survivor_testing",
      audience: { stages: ["finished"] },
      heading: "Understanding your fertility now",
      paragraphs: [{ text: "Labs can help.", citations: [cite] }],
    },
  ],
  aid: [
    {
      id: "worth_the_wait",
      name: "Worth the Wait",
      what: "Grants.",
      eligibility: "Ages 13 to 39.",
      cap: "$500 to $2,500",
      url: "https://example.org",
      audience: {},
      citations: [cite],
    },
  ],
  doctorQuestions: [
    {
      id: "timing",
      text: "Is there time for fertility preservation before treatment starts?",
      audience: { stages: ["not_started"] },
    },
    {
      id: "testing",
      text: "Which tests would tell us about my fertility now?",
      audience: { stages: ["finished"] },
    },
  ],
};

describe("matchesAudience", () => {
  it("matches when the answer is in the allowed list", () => {
    expect(matchesAudience({ anatomy: ["ovaries_uterus"] }, { anatomy: "ovaries_uterus" })).toBe(true);
    expect(matchesAudience({ anatomy: ["testes"] }, { anatomy: "ovaries_uterus" })).toBe(false);
  });

  it("never hides content from someone who skipped or answered 'not sure'", () => {
    expect(matchesAudience({ anatomy: ["testes"] }, {})).toBe(true);
    expect(matchesAudience({ anatomy: ["testes"] }, { anatomy: "prefer_not_to_say" })).toBe(true);
    expect(matchesAudience({ anatomy: ["testes"] }, { anatomy: "self_describe" })).toBe(true);
    expect(matchesAudience({ stages: ["finished"] }, { stage: "not_sure" })).toBe(true);
    expect(matchesAudience({ insurance: ["ca_commercial"] }, { insurance: "unknown" })).toBe(true);
  });

  it("matches treatments when any selected treatment overlaps", () => {
    expect(matchesAudience({ treatments: ["radiation"] }, { treatments: ["chemo", "radiation"] })).toBe(true);
    expect(matchesAudience({ treatments: ["radiation"] }, { treatments: ["chemo"] })).toBe(false);
    expect(matchesAudience({ treatments: ["radiation"] }, { treatments: ["not_sure"] })).toBe(true);
  });
});

describe("buildResults", () => {
  const checkpointPath: Answers = {
    whoFor: "me",
    stage: "not_started",
    age: 24,
    anatomy: "ovaries_uterus",
    insurance: "ca_commercial",
  };

  it("builds the checkpoint-2 path: 24, just diagnosed, ovaries, CA commercial", () => {
    const r = buildResults(checkpointPath, fixture);
    expect(r.options.map((o) => o.id)).toEqual(["egg_freezing"]);
    expect(r.guidance.map((g) => g.id)).toEqual(["ca_commercial_pre"]);
    expect(r.doctorQuestions.map((q) => q.id)).toEqual(["timing"]);
    expect(r.survivorSpine).toBe(false);
  });

  it("switches to the survivor spine when treatment is finished", () => {
    const r = buildResults({ ...checkpointPath, stage: "finished" }, fixture);
    expect(r.survivorSpine).toBe(true);
    expect(r.guidance.map((g) => g.id)).toContain("survivor_testing");
    expect(r.doctorQuestions.map((q) => q.id)).toContain("testing");
  });

  it("shows both anatomy tracks when anatomy was skipped", () => {
    const r = buildResults({ stage: "not_started" }, fixture);
    expect(r.options.map((o) => o.id)).toEqual(["egg_freezing", "sperm_banking"]);
  });

  it("always includes financial aid that has no audience restriction", () => {
    const r = buildResults(checkpointPath, fixture);
    expect(r.aid.map((a) => a.id)).toEqual(["worth_the_wait"]);
  });
});
