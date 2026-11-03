import { describe, it, expect } from "vitest";
import { cashRange } from "../components/CostEstimator";
import { appContent } from "../content/app/content";

const egg = appContent.options.find((o) => o.id === "egg_freezing")!;
const tese = appContent.options.find((o) => o.id === "testicular_sperm_extraction")!;

describe("cost estimator math (published numbers only)", () => {
  it("adds the published egg freezing numbers plus storage years", () => {
    const r5 = cashRange(egg, 5);
    // cycle 12,400 + meds 5,000 + storage 5 x (200..500)
    expect(r5.min).toBe(12400 + 5000 + 5 * 200);
    expect(r5.max).toBe(12400 + 5000 + 5 * 500);
    const r1 = cashRange(egg, 1);
    expect(r1.min).toBe(12400 + 5000 + 200);
    const r0 = cashRange(egg, 0);
    expect(r0.min).toBe(12400 + 5000);
    expect(r0.max).toBe(12400 + 5000);
  });

  it("lists unpublished lines instead of inventing numbers for them", () => {
    const r = cashRange(egg, 5);
    expect(r.unpublished.join(" ")).toContain("Thawing");
  });

  it("never fabricates a total when the main price is unpublished", () => {
    const r = cashRange(tese, 5);
    // only storage is published for TESE; surgery is not
    expect(r.min).toBe(5 * 200);
    expect(r.unpublished.length).toBeGreaterThan(0);
  });
});
