import { describe, it, expect } from "vitest";
import { newLinkCode, isLinkCode, syncPayload, syncEnabled } from "../lib/sync";
import { decodeShareCode } from "../lib/share";
import { emptyJourney, toggleStage } from "../lib/journey";

describe("care-team sync", () => {
  it("is off until the environment is configured", () => {
    expect(syncEnabled).toBe(false);
  });

  it("link codes are short, speakable, and never use lookalike characters", () => {
    for (let i = 0; i < 50; i++) {
      const c = newLinkCode();
      expect(isLinkCode(c)).toBe(true);
      expect(c).not.toMatch(/[01OIL]/);
    }
  });

  it("the wire payload is exactly the share code: stages only", () => {
    let j = emptyJourney();
    j = toggleStage(j, "had_consult");
    const payload = syncPayload(j, "R.");
    const back = decodeShareCode(payload);
    expect(back?.journey.done).toEqual(["had_consult"]);
    expect(back?.nickname).toBe("R.");
  });
});
