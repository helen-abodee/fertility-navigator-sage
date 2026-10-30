import { describe, it, expect } from "vitest";
import {
  questionSequence,
  nextQuestion,
  prevQuestion,
  progress,
} from "../lib/flow";
import type { Answers } from "../lib/types";

describe("questionSequence", () => {
  it("gives the base sequence for a single person who has not started treatment", () => {
    const answers: Answers = { whoFor: "me", stage: "not_started" };
    expect(questionSequence(answers)).toEqual([
      "who_for",
      "stage",
      "age",
      "anatomy",
      "cancer_type",
      "treatments",
      "feelings",
      "insurance",
      "zip",
    ]);
  });

  it("asks how long ago only when treatment is finished", () => {
    const answers: Answers = { whoFor: "me", stage: "finished" };
    const seq = questionSequence(answers);
    expect(seq.indexOf("time_since")).toBe(seq.indexOf("stage") + 1);
  });

  it("asks about partner insurance only when a partner is involved", () => {
    const partnered: Answers = { whoFor: "me_and_partner", stage: "not_started" };
    const single: Answers = { whoFor: "me", stage: "not_started" };
    expect(questionSequence(partnered)).toContain("partner_insurance");
    expect(questionSequence(single)).not.toContain("partner_insurance");
    const seq = questionSequence(partnered);
    expect(seq.indexOf("partner_insurance")).toBe(seq.indexOf("insurance") + 1);
  });

  it("keeps a stable sequence when nothing is answered yet (all questions skippable)", () => {
    const seq = questionSequence({});
    expect(seq[0]).toBe("who_for");
    expect(seq[seq.length - 1]).toBe("zip");
    expect(seq).not.toContain("time_since");
    expect(seq).not.toContain("partner_insurance");
  });
});

describe("navigation", () => {
  it("advances to the next question even when the current one was skipped", () => {
    expect(nextQuestion({}, "who_for")).toBe("stage");
    expect(nextQuestion({}, "stage")).toBe("age");
  });

  it("returns 'results' after the last question", () => {
    expect(nextQuestion({ whoFor: "me" }, "zip")).toBe("results");
  });

  it("inserts time_since after stage once 'finished' is chosen", () => {
    expect(nextQuestion({ stage: "finished" }, "stage")).toBe("time_since");
    expect(nextQuestion({ stage: "finished" }, "time_since")).toBe("age");
  });

  it("goes back without losing conditional questions", () => {
    expect(prevQuestion({ stage: "finished" }, "age")).toBe("time_since");
    expect(prevQuestion({}, "age")).toBe("stage");
    expect(prevQuestion({}, "who_for")).toBe(null);
  });
});

describe("progress", () => {
  it("is 0 at the first question and approaches 1 at the last", () => {
    const answers: Answers = { whoFor: "me", stage: "not_started" };
    expect(progress(answers, "who_for")).toBe(0);
    expect(progress(answers, "zip")).toBeCloseTo(8 / 9);
  });

  it("stays between 0 and 1 for every question in every branch", () => {
    const answers: Answers = { whoFor: "me_and_partner", stage: "finished" };
    for (const q of questionSequence(answers)) {
      const p = progress(answers, q);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThan(1);
    }
  });
});
