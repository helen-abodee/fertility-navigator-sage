import { describe, it, expect } from "vitest";
import { ALLOWED_EVENTS, analyticsEnabled, sessionId, track } from "../lib/analytics";

describe("lane-1 analytics", () => {
  it("is off without the sync environment", () => {
    expect(analyticsEnabled).toBe(false);
    expect(() => track("app_open")).not.toThrow();
  });

  it("the allowlist contains no event that could carry health meaning", () => {
    for (const e of ALLOWED_EVENTS) {
      expect(e).not.toMatch(/egg|sperm|embryo|ovar|test(es|icular)|cancer|chemo|radiat|risk_(high|low)|anatomy|diagnos/i);
    }
  });

  it("session ids are random 8-char tokens, stable per device", () => {
    const a = sessionId();
    expect(a).toMatch(/^[a-z0-9]{8}$/);
    expect(sessionId()).toBe(a);
  });
});
