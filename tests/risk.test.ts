import { describe, it, expect } from "vitest";
import { assessRisk } from "../lib/risk";

describe("risk module placeholder", () => {
  it("returns 'coming soon' for any input until the clinical document arrives", () => {
    expect(assessRisk({})).toEqual({ status: "coming_soon" });
    expect(
      assessRisk({ treatments: ["chemo", "radiation"], age: 24, anatomy: "ovaries_uterus", chemoAgents: ["cyclophosphamide"] }),
    ).toEqual({ status: "coming_soon" });
  });

  it("never returns a number, probability, or recommendation", () => {
    const result = assessRisk({ treatments: ["chemo"], age: 30 }) as unknown as Record<string, unknown>;
    const values = Object.values(result);
    for (const v of values) {
      expect(typeof v).not.toBe("number");
    }
    expect(result).not.toHaveProperty("probability");
    expect(result).not.toHaveProperty("recommendation");
    expect(result).not.toHaveProperty("category");
  });
});
