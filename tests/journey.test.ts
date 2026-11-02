import { describe, it, expect } from "vitest";
import {
  emptyJourney,
  toggleStage,
  setOutcome,
  summaryLines,
  journeyStages,
} from "../lib/journey";

describe("journey tracker (patient-held)", () => {
  it("starts empty with no outcome", () => {
    const j = emptyJourney();
    expect(j.done).toEqual([]);
    expect(j.outcome).toBeNull();
  });

  it("toggles stages on and off without caring about order", () => {
    let j = emptyJourney();
    j = toggleStage(j, "contacted_clinic");
    j = toggleStage(j, "learned_risk");
    expect(j.done).toContain("contacted_clinic");
    expect(j.done).toContain("learned_risk");
    j = toggleStage(j, "contacted_clinic");
    expect(j.done).not.toContain("contacted_clinic");
  });

  it("outcomes are mutually exclusive and clearable", () => {
    let j = emptyJourney();
    j = setOutcome(j, "decided_not_to");
    expect(j.outcome).toBe("decided_not_to");
    j = setOutcome(j, "completed");
    expect(j.outcome).toBe("completed");
    j = setOutcome(j, "completed"); // tapping again clears
    expect(j.outcome).toBeNull();
  });

  it("deciding not to preserve is a complete, first-class endpoint in the summary", () => {
    let j = emptyJourney();
    j = toggleStage(j, "talked_care_team");
    j = setOutcome(j, "decided_not_to");
    const text = summaryLines(j).join(" ");
    expect(text).toContain("decided not to");
    expect(text.toLowerCase()).not.toContain("incomplete");
    expect(text.toLowerCase()).not.toContain("gave up");
  });

  it("has no scores, percentages, or streaks anywhere", () => {
    let j = emptyJourney();
    for (const s of journeyStages) j = toggleStage(j, s.id);
    const text = summaryLines(j).join(" ");
    expect(text).not.toMatch(/%|\bscore\b|\bstreak\b/i);
  });
});
