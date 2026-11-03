import { describe, it, expect } from "vitest";
import { aidFit } from "../lib/aid-fit";
import type { AidOrg } from "../lib/content-schema";

const org = (fit: AidOrg["fit"]): AidOrg => ({
  id: "x",
  name: "X",
  what: "",
  eligibility: "",
  cap: "not published",
  url: "https://example.org",
  audience: {},
  citations: [],
  fit,
});

describe("aid eligibility fit", () => {
  it("age windows rule people out with a stated reason", () => {
    const r = aidFit(org({ minAge: 21, maxAge: 39 }), { age: 19 });
    expect(r.fit).toBe("unlikely");
    expect(r.reasons.join(" ")).toContain("21 to 39");
    expect(aidFit(org({ minAge: 21, maxAge: 39 }), { age: 25 }).fit).toBe("may_fit");
  });

  it("stage restrictions apply only when the user's stage is known", () => {
    expect(aidFit(org({ stage: "finished" }), { stage: "not_started" }).fit).toBe("unlikely");
    expect(aidFit(org({ stage: "finished" }), { stage: "finished" }).fit).toBe("may_fit");
    expect(aidFit(org({ stage: "finished" }), {}).fit).toBe("may_fit");
  });

  it("anatomy restrictions respect prefer-not-to-say", () => {
    expect(aidFit(org({ anatomy: ["ovaries_uterus"] }), { anatomy: "testes" }).fit).toBe("unlikely");
    expect(aidFit(org({ anatomy: ["ovaries_uterus"] }), { anatomy: "prefer_not_to_say" }).fit).toBe("may_fit");
  });

  it("unknown answers never exclude (anti-anxiety rule)", () => {
    expect(aidFit(org({ minAge: 16, maxAge: 36, stage: "not_started" }), {}).fit).toBe("may_fit");
  });

  it("orgs without structured fit data always stay visible", () => {
    expect(aidFit(org(undefined), { age: 99 }).fit).toBe("may_fit");
  });
});
