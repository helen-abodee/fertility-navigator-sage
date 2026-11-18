import { describe, it, expect } from "vitest";
import { filterAnswer } from "../lib/ask-filter";

describe("ask output filter", () => {
  const blocked = [
    "Your risk of infertility is about 60% with that regimen.",
    "There is a 40 percent chance you will stay fertile.",
    "You should choose egg freezing in your case.",
    "I recommend sperm banking before anything else.",
    "This will improve your fertility over time.",
    "Freezing guarantees a baby later.",
    "You are infertile based on what you describe.",
    "Be gentle with yourself this week.",
    "Act now, time is running out.",
  ];
  for (const t of blocked) {
    it(`blocks: ${t.slice(0, 40)}`, () => {
      expect(filterAnswer(t).ok).toBe(false);
    });
  }

  const allowed = [
    "Egg freezing costs about $12,400 on average, per the published figures, plus about $5,000 for medicines.",
    "ASCO recommends discussing fertility before treatment starts. Your care team can confirm your risk group.",
    "Storage is billed every year, usually $200 to $500.",
    "The POSITIVE trial followed 516 women; after 3 years their outcomes matched women who did not pause therapy.",
    "Sperm banking usually takes about a week, and even one sample helps.",
  ];
  for (const t of allowed) {
    it(`allows: ${t.slice(0, 40)}`, () => {
      expect(filterAnswer(t).ok).toBe(true);
    });
  }
});
