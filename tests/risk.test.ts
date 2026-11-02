import { describe, it, expect } from "vitest";
import { assessRisk } from "../lib/risk";

describe("CRISP regimen rule (most specific, wins when the regimen is known)", () => {
  const base: import("../lib/types").Answers = {
    anatomy: "ovaries_uterus",
    cancerType: "breast",
    treatments: ["chemo"],
    chemoRegimen: "CMF (Cyclophosphamide, Methotrexate, Fluorouracil)",
  };

  it("uses the CRISP band for the exact regimen and age", () => {
    const young = assessRisk({ ...base, age: 24 });
    expect(young.category).toBe("lower");
    expect(young.citations.some((c) => c.sourceName.includes("CRISP"))).toBe(true);
    expect(young.citations.some((c) => c.sourceName.includes("Sukumvanich"))).toBe(true);
    const older = assessRisk({ ...base, age: 44 });
    expect(older.category).toBe("intermediate");
  });

  it("falls back to the general rules when the regimen is unknown", () => {
    const r = assessRisk({ ...base, chemoRegimen: "not_sure", chemoAgents: ["cyclophosphamide"], age: 24 });
    expect(r.category).toBe("lower"); // the breast+cyclophosphamide+under-30 rule
    expect(r.citations.some((c) => c.sourceName.includes("Livestrong"))).toBe(true);
  });

  it("an UNKNOWN CRISP band is honest, not a guess", () => {
    const r = assessRisk({ ...base, chemoRegimen: "KP (TDM-1, pertuzumab)", age: 24 });
    expect(r.category).toBe("variable");
    expect(r.body).toContain("not about you");
  });
});

describe("risk assessment (published-framework categories)", () => {
  it("transplant conditioning is in the high group for every anatomy", () => {
    for (const anatomy of ["ovaries_uterus", "testes", "prefer_not_to_say", undefined] as const) {
      const r = assessRisk({ treatments: ["transplant", "chemo"], anatomy });
      expect(r.category).toBe("high");
      expect(r.citations.length).toBeGreaterThan(0);
    }
  });

  it("an alkylating agent plus pelvic radiation is in the high group", () => {
    const r = assessRisk({
      treatments: ["chemo", "radiation"],
      chemoAgents: ["cyclophosphamide"],
      radiationArea: "abdomen_pelvis",
      anatomy: "testes",
    });
    expect(r.category).toBe("high");
  });

  it("cisplatin-containing treatment with ovaries is in the intermediate group", () => {
    const r = assessRisk({
      treatments: ["chemo"],
      chemoAgents: ["cisplatin"],
      anatomy: "ovaries_uterus",
    });
    expect(r.category).toBe("intermediate");
  });

  it("cisplatin in males is dose-keyed, so it lands in the depends-on-dose group", () => {
    const r = assessRisk({
      treatments: ["chemo"],
      chemoAgents: ["cisplatin"],
      anatomy: "testes",
    });
    expect(r.category).toBe("variable");
  });

  it("cyclophosphamide-containing breast cancer treatment under 30 is in the lower group", () => {
    const r = assessRisk({
      treatments: ["chemo"],
      chemoAgents: ["cyclophosphamide"],
      cancerType: "breast",
      age: 24,
      anatomy: "ovaries_uterus",
    });
    expect(r.category).toBe("lower");
  });

  it("a standalone alkylating agent without dose lands in depends-on-dose, with a CED prompt", () => {
    const r = assessRisk({
      treatments: ["chemo"],
      chemoAgents: ["ifosfamide"],
      anatomy: "testes",
      age: 19,
    });
    expect(r.category).toBe("variable");
    expect(r.askTeam.toLowerCase()).toContain("dose");
  });

  it("radiation without a dose lands in depends-on-dose", () => {
    const r = assessRisk({
      treatments: ["radiation"],
      radiationArea: "abdomen_pelvis",
      anatomy: "ovaries_uterus",
    });
    expect(r.category).toBe("variable");
  });

  it("no treatment information lands in unknown, never a guess", () => {
    expect(assessRisk({}).category).toBe("unknown");
    expect(assessRisk({ treatments: ["not_sure"] }).category).toBe("unknown");
  });

  it("never returns a number, probability, or recommendation, and always points to the care team", () => {
    const r = assessRisk({
      treatments: ["transplant"],
      anatomy: "ovaries_uterus",
      age: 24,
    });
    const flat = { ...r } as unknown as Record<string, unknown>;
    for (const v of Object.values(flat)) {
      expect(typeof v).not.toBe("number");
    }
    expect(flat).not.toHaveProperty("probability");
    expect(flat).not.toHaveProperty("recommendation");
    expect(r.askTeam.length).toBeGreaterThan(0);
  });
});
