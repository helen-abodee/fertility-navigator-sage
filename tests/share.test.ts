import { describe, it, expect } from "vitest";
import { encodeShareCode, decodeShareCode, prioritize, type TeamEntry } from "../lib/share";
import { emptyJourney, toggleStage, setOutcome } from "../lib/journey";

describe("progress share codes", () => {
  it("round-trips a journey with an optional nickname", () => {
    let j = emptyJourney();
    j = toggleStage(j, "contacted_clinic");
    j = toggleStage(j, "learned_risk");
    const code = encodeShareCode(j, "A.R.");
    expect(code.startsWith("FPN1.")).toBe(true);
    const back = decodeShareCode(code);
    expect(back?.nickname).toBe("A.R.");
    expect(back?.journey.done).toContain("contacted_clinic");
    expect(back?.journey.outcome).toBeNull();
  });

  it("carries only stages, outcome, date, nickname; never answers", () => {
    const code = encodeShareCode(emptyJourney(), "B");
    const payload = JSON.parse(Buffer.from(code.slice(5), "base64url").toString());
    expect(Object.keys(payload).sort()).toEqual(["d", "n", "o", "u"]);
  });

  it("rejects garbage instead of crashing", () => {
    expect(decodeShareCode("FPN1.!!!!")).toBeNull();
    expect(decodeShareCode("hello")).toBeNull();
    expect(decodeShareCode("FPN1." + Buffer.from('{"x":1}').toString("base64url"))).toBeNull();
  });
});

describe("caseload prioritization", () => {
  const entry = (label: string, done: number, outcome: "completed" | "decided_not_to" | null, updated: string): TeamEntry => {
    let j = emptyJourney();
    const stages = ["learned_risk", "talked_care_team", "checked_coverage", "contacted_clinic", "had_consult", "started_preservation"] as const;
    for (let i = 0; i < done; i++) j = toggleStage(j, stages[i]);
    if (outcome) j = setOutcome(j, outcome);
    return { label, journey: { ...j, updated }, addedAt: "2026-11-02" };
  };

  it("people still in motion outrank finished ones, oldest update first", () => {
    const list = [
      entry("done-person", 6, "completed", "2026-10-01"),
      entry("stalled-early", 1, null, "2026-10-10"),
      entry("recent-mover", 4, null, "2026-11-01"),
      entry("decided-not-to", 2, "decided_not_to", "2026-10-20"),
    ];
    const order = prioritize(list).map((e) => e.label);
    expect(order[0]).toBe("stalled-early");
    expect(order[1]).toBe("recent-mover");
    expect(order.slice(2)).toEqual(expect.arrayContaining(["done-person", "decided-not-to"]));
  });
});
